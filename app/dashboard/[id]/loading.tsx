"use client";

import { Calendar, Clock, FileText, LayoutGrid, List, Search } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";

// Import types from the Convex data model
import type { Id } from "@/convex/_generated/dataModel";

// API
import { api } from "@/convex/_generated/api";

// Components
import MaxWContainer from "@/components/ui/MaxWContainer";
import CreateTableBtn from "@/components/dashboard-components/CreateTableBtn";
import CreateNoteBtn from "@/components/dashboard-components/CreateNoteBtn";
import TableSettings from "@/components/dashboard-components/TableSettings";
import NoteSettings from "@/components/dashboard-components/NoteSettings";
import TablesNotFound from "@/components/dashboard-components/TablesNotFound";
import SkeletonTextAnimation from "@/components/ui/SkeletonTextAnimation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PenSquare } from "lucide-react";

// Utils
import { getContentPreview } from "@/lib/getContentPreview";
import { JSX } from "react/jsx-runtime";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbSelector } from "react-icons/tb";
import LoadingAnimation from "@/components/ui/LoadingAnimation";
import { useHotkeys } from "react-hotkeys-hook";
import { cn } from "@/lib/utils";

// Skeleton component for reusable skeleton elements
const Skeleton = ({ className = "", ...props }: { className?: string; [key: string]: any }) => {
  return (
    <div
      className={`animate-pulse bg-primary/20 rounded-md ${className}`}
      {...props}
    />
  );
};

// Workspace Header Skeleton
function WorkspaceHeaderSkeleton(): JSX.Element {
  return (
    <header className="py-6">
      <div className="w-full p-6 bg-gradient-to-r from-primary/20 via-transparent via-15% to-primary/20 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2 self-end md:self-auto">
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </header>
  );
}

// Tab Navigation Skeleton
function TabNavigationSkeleton(): JSX.Element {
  return (
    <div className="mt-4">
      <div className="overflow-x-auto py-1">
        <div className="text-card-foreground justify-start w-fit flex-wrap h-fit gap-3 flex">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-20" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Notes Container Header Skeleton
function NotesContainerHeaderSkeleton(): JSX.Element {
  return (
    <div className="w-full flex items-center justify-between border-b border-border py-3 mb-5">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center">
          <TbSelector className="h-3 w-3 text-muted-foreground" />
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="flex items-center gap-2">
        {/* Search input skeleton */}
        <div className="relative w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
        {/* View mode buttons skeleton */}
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <Skeleton className="h-9 w-9 rounded-none" />
          <Skeleton className="h-9 w-9 rounded-none" />
        </div>
        {/* Action buttons skeleton */}
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-8" />
      </div>
    </div>
  );
}

// Grid Note Card Skeleton
function GridNoteCardSkeleton(): JSX.Element {
  return (
    <Card className="group bg-card/30 border-border">
      <CardHeader className="pb-2 relative">
        <Skeleton className="h-6 w-3/4" />
        <div className="absolute top-3 right-3">
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-7 w-12" />
      </CardFooter>
    </Card>
  );
}

// List Note Card Skeleton
function ListNoteCardSkeleton(): JSX.Element {
  return (
    <Card className="group bg-card/30 border-border">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-7 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Notes Grid Skeleton
function NotesGridSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }): JSX.Element {
  return (
    <div className="py-2">
      <NotesContainerHeaderSkeleton />
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "flex flex-col gap-3"
        }
      >
        {Array.from({ length: 8 }).map((_, index) =>
          viewMode === "grid" ? (
            <GridNoteCardSkeleton key={index} />
          ) : (
            <ListNoteCardSkeleton key={index} />
          )
        )}
      </div>
    </div>
  );
}

// Complete Workspace Loading Skeleton
function WorkspaceLoadingSkeleton(): JSX.Element {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <MaxWContainer className="mb-20">
      {/* Workspace Header Skeleton */}
      <WorkspaceHeaderSkeleton />

      {/* Tab Navigation Skeleton */}
      <TabNavigationSkeleton />

      {/* Notes Content Skeleton */}
      <div className="mt-6">
        <NotesGridSkeleton viewMode={viewMode} />
      </div>
    </MaxWContainer>
  );
}

// Types based on the schema
type ViewMode = "grid" | "list";

interface Note {
  _id: Id<"notes">;
  title?: string;
  slug?: string;
  workingSpacesSlug?: string;
  workingSpaceId?: Id<"workingSpaces">;
  userId?: Id<"users">;
  body?: string;
  favorite?: boolean;
  createdAt: number;
  updatedAt: number;
  tags?: Id<"tags">[];
  notesTableId?: Id<"notesTables"> | any | undefined;
  order?: number;
}

interface QuickAccessNoteCardProps {
  note: Note;
  workspaceName?: string;
  viewMode: ViewMode;
  provided?: any;
}

interface NotesDroppableContainerProps {
  tableId: Id<"notesTables">;
  viewMode: ViewMode;
  notes: Note[];
  workspaceSlug?: string;
  workspaceId?: Id<"workingSpaces">;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tables: any[];
  setViewMode: (mode: ViewMode) => void;
}

interface NoteCardProps {
  note: Note;
  provided: any;
  workspaceId?: Id<"workingSpaces">;
}

interface EmptySearchResultsProps {
  searchQuery: string;
  onClearSearch: () => void;
}

interface EmptyTableStateProps {
  tableId: Id<"notesTables">;
  workspaceSlug?: string;
  workspaceId?: Id<"workingSpaces">;
}

export default function WorkingSpacePage() {
  const params = useParams();
  const workingSpaceId = params.id as Id<"workingSpaces">;

  const workspace = useQuery(api.mutations.workingSpaces.getWorkingSpaceById, {
    _id: workingSpaceId,
  });
  const workingSpacesSlug: string | undefined =
    workspace && (workspace.slug as string);

  const tables = useQuery(api.mutations.notesTables.getTables, {
    workingSpaceId,
  });

  const workspaceNotes = useQuery(api.mutations.notes.getNotesByWorkspaceId, {
    workingSpaceId,
  });

  const allNotes = useQuery(api.mutations.notes.getNoteByUserId);

  const updateNoteOrder = useMutation(api.mutations.notes.updateNoteOrder);

  const [optimisticNotes, setOptimisticNotes] = useState<
    Note[] | null | undefined
  >(allNotes);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (allNotes) {
      setOptimisticNotes(allNotes);
    }
  }, [allNotes]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show skeleton for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleDragEnd = (result: any): void => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceTableId = source.droppableId as Id<"notesTables">;
    const destTableId = destination.droppableId as Id<"notesTables">;

    if (sourceTableId === destTableId && optimisticNotes) {
      const updatedNotes = [...optimisticNotes];
      const sourceTableNotes = updatedNotes.filter(
        (note) => note.notesTableId === sourceTableId,
      );

      const [movedNote] = sourceTableNotes.splice(source.index, 1);
      sourceTableNotes.splice(destination.index, 0, movedNote);

      const newOrder = sourceTableNotes.map((note) => note._id);

      const otherNotes = updatedNotes.filter(
        (note) => note.notesTableId !== sourceTableId,
      );

      setOptimisticNotes([...otherNotes, ...sourceTableNotes]);

      updateNoteOrder({
        tableId: sourceTableId,
        noteIds: newOrder,
      });
    }
  };

  const filteredNotes = useMemo<Note[]>(() => {
    const notesToFilter = optimisticNotes || allNotes || [];

    if (!searchQuery) return notesToFilter;

    return notesToFilter.filter((note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [optimisticNotes, allNotes, searchQuery]);

  useEffect(() => {
    if (!workspace?.name) return;

    // Update document title
    document.title = `${workspace.name} - Notevo Workspace`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionContent = `${workspace.name} workspace with ${
      tables?.length || 0
    } tables and ${
      filteredNotes?.length || 0
    } notes. Organize your thoughts with Notevo.`;

    if (metaDescription) {
      metaDescription.setAttribute("content", descriptionContent);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = descriptionContent;
      document.head.appendChild(newMeta);
    }
  }, [workspace, tables?.length, filteredNotes?.length]);

  const quickAccessNotes = useMemo<Note[]>(() => {
    return workspaceNotes?.filter((note) => !note.notesTableId) || [];
  }, [workspaceNotes]);

  const [CreateQuickAccessNoteLoading, setCreateQuickAccessNoteLoading] =
    useState(false);
  const [CreateTableLoading, setCreateTableLoading] = useState(false);

  const CreateQuickAccessNote = useMutation(api.mutations.notes.createNote);
  const createTable = useMutation(api.mutations.notesTables.createTable);
  
  const handleCreateTable = async () => {
    setCreateTableLoading(true);
    try {
      await createTable({ workingSpaceId: workingSpaceId, name: "Untitled" });
    } finally {
      setCreateTableLoading(false);
    }
  };
  
  const handleCreateQuickAccessNote = async (
    workingSpaceId: Id<"workingSpaces">,
    workingSpacesSlug: string | undefined,
  ) => {
    setCreateQuickAccessNoteLoading(true);
    try {
      await CreateQuickAccessNote({
        workingSpacesSlug: workingSpacesSlug as string,
        workingSpaceId: workingSpaceId as Id<"workingSpaces">,
        title: "New Quick Access Notes",
      });
    } finally {
      setCreateQuickAccessNoteLoading(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useHotkeys(
    "ctrl+s",
    (e: KeyboardEvent) => {
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    },
    [inputRef],
  );

  // Show loading skeleton
  if (isLoading || !workspace || !tables) {
    return <WorkspaceLoadingSkeleton />;
  }

  return (
    <MaxWContainer className="mb-20">
      {/* Workspace Header */}
      <header className="py-6">
        <div className="w-full p-6 bg-gradient-to-r from-primary/20 via-transparent via-15% to-primary/20 rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  {workspace.name}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                {tables?.length || 0} tables • {filteredNotes?.length || 0} notes
              </p>
            </div>
            <div className="flex items-center gap-2 self-end md:self-auto">
              <CreateTableBtn workingSpaceId={workingSpaceId} />
            </div>
          </div>
        </div>
      </header>

      {/* Tables and Notes Content */}
      {tables?.length ? (
        <Tabs defaultValue={tables[0]._id} className="mt-4">
          <div className="overflow-x-auto py-1">
            <TabsList className="text-card-foreground justify-start w-fit flex-wrap h-fit gap-3">
              {tables.map((table) => (
                <TabsTrigger
                  key={table._id}
                  value={table._id}
                  className="flex items-center gap-2"
                >
                  {table.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tables.map((table) => (
            <TabsContent key={table._id} value={table._id}>
              <NotesDroppableContainer
                tableId={table._id}
                viewMode={viewMode}
                notes={filteredNotes.filter(
                  (note) => note.notesTableId === table._id
                )}
                workspaceSlug={workingSpacesSlug}
                workspaceId={workingSpaceId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                tables={tables}
                setViewMode={setViewMode}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <TablesNotFound workingSpaceId={workingSpaceId} />
      )}
    </MaxWContainer>
  );
}

// Keep all your existing components here...
function QuickAccessNoteCard({
  note,
  workspaceName,
  viewMode,
  provided,
}: QuickAccessNoteCardProps): JSX.Element {
  return viewMode === "grid" ? (
    <GridNoteCard
      note={note}
      provided={provided || {} as any}
      workspaceId={note.workingSpaceId}
    />
  ) : (
    <ListNoteCard
      note={note}
      provided={provided || {} as any}
      workspaceId={note.workingSpaceId}
    />
  );
}

function NotesDroppableContainer({
  tableId,
  viewMode,
  notes,
  workspaceSlug,
  workspaceId,
  searchQuery,
  setSearchQuery,
  tables,
  setViewMode,
}: NotesDroppableContainerProps): JSX.Element {
  return (
    <div className="py-2">
      <div className="w-full flex items-center justify-between border-b border-border py-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-accent rounded-full flex items-center justify-center">
            <TbSelector className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="text-foreground font-medium">
            {notes.length} Notes
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 text-foreground border-border"
            />
          </div>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <Button
              variant="Trigger"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-none",
                viewMode === "grid" && "bg-muted"
              )}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="Trigger"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-none",
                viewMode === "list" && "bg-muted"
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          <CreateNoteBtn
            workingSpaceId={workspaceId}
            workingSpacesSlug={workspaceSlug}
            notesTableId={tableId}
          />
          <TableSettings notesTableId={tableId} tableName={tables?.find(t => t._id === tableId)?.name} />
        </div>
      </div>

      {searchQuery && notes.length === 0 ? (
        <EmptySearchResults
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
        />
      ) : notes.length === 0 ? (
        <EmptyTableState
          tableId={tableId}
          workspaceSlug={workspaceSlug}
          workspaceId={workspaceId}
        />
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {notes.map((note, index) =>
            viewMode === "grid" ? (
              <GridNoteCard
                key={note._id}
                note={note}
                provided={{} as any}
                workspaceId={workspaceId}
              />
            ) : (
              <ListNoteCard
                key={note._id}
                note={note}
                provided={{} as any}
                workspaceId={workspaceId}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

function GridNoteCard({
  note,
  provided,
  workspaceId,
}: NoteCardProps): JSX.Element {
  return (
    <Card className="group bg-card/30 border-border hover:border-border/40 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-lg text-foreground">
          {note.title
            ? note.title.length > 20
              ? `${note.title.substring(0, 20)}...`
              : note.title
            : "Untitled"}
        </CardTitle>
        <div className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity">
          <NoteSettings noteId={note._id} noteTitle={note.title} IconVariant="vertical_icon" DropdownMenuContentAlign="start" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {getContentPreview(note.body)}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {typeof window !== "undefined" ? (
            <span>{`${new Date(note.updatedAt).toLocaleDateString()}`}</span>
          ) : (
            <SkeletonTextAnimation className="w-20" />
          )}
        </div>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link
            href={`/dashboard/${workspaceId}/${note.slug}?id=${note._id}`}
          >
            Open
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ListNoteCard({
  note,
  provided,
  workspaceId,
}: NoteCardProps): JSX.Element {
  return (
    <Card className="group bg-card/30 border-border hover:border-border/40 transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-foreground font-medium">
              {note.title || "Untitled"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getContentPreview(note.body)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {typeof window !== "undefined" ? (
              <span>{`${new Date(note.updatedAt).toLocaleDateString()}`}</span>
            ) : (
              <SkeletonTextAnimation className="w-20" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <NoteSettings noteId={note._id} noteTitle={note.title} IconVariant="vertical_icon" DropdownMenuContentAlign="start" />
            <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
              <Link
                href={`/dashboard/${workspaceId}/${note.slug}?id=${note._id}`}
              >
                Open
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptySearchResults({
  searchQuery,
  onClearSearch,
}: EmptySearchResultsProps): JSX.Element {
  return (
    <Card className="bg-card/30 border-border">
      <CardContent className="pt-6 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2 text-foreground">
            No results found
          </h3>
          <p className="text-muted-foreground mb-4">
            No notes found for "{searchQuery}"
          </p>
          <Button
            variant="outline"
            onClick={onClearSearch}
            className="border-border text-foreground"
          >
            Clear Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyTableState({
  tableId,
  workspaceSlug,
  workspaceId,
}: EmptyTableStateProps): JSX.Element {
  return (
    <Card className="bg-card/30 border-border">
      <CardContent className="pt-6 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2 text-foreground">
            No notes yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Create your first note to get started
          </p>
          <CreateNoteBtn
            workingSpaceId={workspaceId}
            workingSpacesSlug={workspaceSlug}
            notesTableId={tableId}
          />
        </div>
      </CardContent>
    </Card>
  );
}