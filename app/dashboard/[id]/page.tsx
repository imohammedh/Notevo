"use client";
import { Calendar, FileText, LayoutGrid, List, Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMutation } from "convex/react";
import { useQuery } from "@/cache/useQuery";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
} from "@hello-pangea/dnd";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getContentPreview } from "@/lib/getContentPreview";
import { cn } from "@/lib/utils";

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
  provided: DraggableProvided;
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

  const workspace = useQuery(api.workingSpaces.getWorkingSpaceById, {
    _id: workingSpaceId,
  });
  const workingSpacesSlug: string | undefined =
    workspace && (workspace.slug as string);

  const tables = useQuery(api.notesTables.getTables, {
    workingSpaceId,
  });

  const allNotes = useQuery(api.notes.getNotesByWorkspaceId, {
    workingSpaceId,
  });

  const updateNoteOrder = useMutation(api.notes.updateNoteOrder);

  const [optimisticNotes, setOptimisticNotes] = useState<
    Note[] | null | undefined
  >(allNotes);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (allNotes) {
      setOptimisticNotes(allNotes);
    }
  }, [allNotes]);

  const handleDragEnd = (result: DropResult): void => {
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

    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalContent = metaDescription?.getAttribute("content");

    document.title = `${workspace.name} - Notevo Workspace`;

    const descriptionContent = `${workspace.name} workspace with ${tables?.length || 0} tables and ${filteredNotes?.length || 0} notes. `;

    if (metaDescription) {
      metaDescription.setAttribute("content", descriptionContent);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = descriptionContent;
      document.head.appendChild(newMeta);
    }

    return () => {
      document.title = originalTitle;
      if (metaDescription && originalContent) {
        metaDescription.setAttribute("content", originalContent);
      } else if (!metaDescription) {
        document.querySelector('meta[name="description"]')?.remove();
      }
    };
  }, [workspace?.name, tables?.length, filteredNotes?.length]);

  return (
    <MaxWContainer className="mb-20">
      {/* Modern Gradient Header */}
      <header className=" pb-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent from-20% via-transparent via-70% to-accent p-8">
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold  mb-2">
                  {workspace?.name}
                </h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm">
                    <LayoutGrid className="h-4 w-4" />
                    {tables?.length || 0} tables
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm">
                    <FileText className="h-4 w-4" />
                    {filteredNotes?.length || 0} notes
                  </span>
                </div>
              </div>
              <CreateTableBtn workingSpaceId={workingSpaceId} />
            </div>
          </div>
        </div>
      </header>

      {/* Tables and Notes Content */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {tables?.length ? (
          <Tabs defaultValue={tables[0]._id} className="mt-6">
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
              <TabsList className=" inline-flex items-center justify-start flex-warp w-fit min-w-full sm:min-w-fit flex-wrap gap-2 sm:gap-3 h-fit p-1 bg-card/90 backdrop-blur-sm rounded-xl border border-border">
                {tables.map((table) => (
                  <TabsTrigger
                    key={table._id}
                    value={table._id}
                    className="px-4 py-2.5 rounded-lg "
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
                    (note) => note.notesTableId === table._id,
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
        ) : tables ? (
          <TablesNotFound workingSpaceId={workingSpaceId} />
        ) : (
          <TablesSkeleton />
        )}
      </DragDropContext>
    </MaxWContainer>
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
}: NotesDroppableContainerProps) {
  return (
    <div className="space-y-6">
      {/* Enhanced Control Bar */}
      <div className="flex flex-row gap-4 items-start sm:items-center justify-between p-4 bg-card/90 backdrop-blur-sm rounded-xl border border-border/50">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center border border-border/50 rounded-lg overflow-hidden bg-background/50">
            <Button
              variant="SidebarMenuButton"
              size="sm"
              className={cn(
                "rounded-none",
                viewMode === "grid" && "bg-foreground/10",
              )}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid
                className={`h-4 w-4 ${viewMode === "grid" && "text-purple-600"}`}
              />
            </Button>
            <Button
              variant="SidebarMenuButton"
              size="sm"
              className={cn(
                "rounded-none",
                viewMode === "list" && "bg-foreground/10",
              )}
              onClick={() => setViewMode("list")}
            >
              <List
                className={`h-4 w-4 ${viewMode === "list" && "text-purple-600"}`}
              />
            </Button>
          </div>
          <CreateNoteBtn
            workingSpaceId={workspaceId}
            workingSpacesSlug={workspaceSlug}
            notesTableId={tableId}
          />
          <TableSettings
            notesTableId={tableId}
            tableName={tables?.find((t) => t._id === tableId)?.name}
          />
        </div>
      </div>

      {/* Notes Grid/List */}
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
        <Droppable droppableId={tableId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  : "flex flex-col gap-3"
              }
            >
              {notes.map((note, index) => (
                <Draggable key={note._id} draggableId={note._id} index={index}>
                  {(provided) =>
                    viewMode === "grid" ? (
                      <GridNoteCard
                        note={note}
                        provided={provided}
                        workspaceId={workspaceId}
                      />
                    ) : (
                      <ListNoteCard
                        note={note}
                        provided={provided}
                        workspaceId={workspaceId}
                      />
                    )
                  }
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
}

function GridNoteCard({ note, provided, workspaceId }: NoteCardProps) {
  const isEmpty = !note.body || note.body.trim() === "";

  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={cn(
        "group relative overflow-hidden bg-card/90 backdrop-blur-sm border transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
        isEmpty
          ? "border-dashed border-border/50"
          : "border-border/50 hover:border-purple-500/50",
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold text-foreground line-clamp-2 flex-1">
            {note.title || "Untitled"}
          </CardTitle>
          <NoteSettings
            noteId={note._id}
            noteTitle={note.title}
            IconVariant="vertical_icon"
            DropdownMenuContentAlign="start"
            TooltipContentAlign="start"
          />
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {isEmpty ? (
          <p className="text-sm text-muted-foreground italic">
            No content yet. Click to start writing...
          </p>
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {getContentPreview(note.body)}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-3 flex items-center justify-between border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {typeof window !== "undefined" ? (
            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
          ) : (
            <SkeletonTextAnimation className="w-20" />
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-7 text-xs hover:bg-purple-600/10 hover:text-purple-600"
        >
          <Link href={`/dashboard/${workspaceId}/${note.slug}?id=${note._id}`}>
            Open
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ListNoteCard({ note, provided, workspaceId }: NoteCardProps) {
  const isEmpty = !note.body || note.body.trim() === "";

  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={cn(
        "group relative overflow-hidden bg-card/90 backdrop-blur-sm border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
        isEmpty
          ? "border-dashed border-border/50"
          : "border-border/50 hover:border-purple-500/50",
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-indigo-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>

      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground mb-1 truncate">
              {note.title || "Untitled"}
            </h3>
            {isEmpty ? (
              <p className="text-sm text-muted-foreground italic">
                No content yet. Click to start writing...
              </p>
            ) : (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {getContentPreview(note.body)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {typeof window !== "undefined" ? (
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              ) : (
                <SkeletonTextAnimation className="w-20" />
              )}
            </div>
            <NoteSettings
              noteId={note._id}
              noteTitle={note.title}
              IconVariant="vertical_icon"
              DropdownMenuContentAlign="start"
              TooltipContentAlign="start"
            />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-7 text-xs hover:bg-purple-600/10 hover:text-purple-600"
            >
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
}: EmptySearchResultsProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="pt-12 pb-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            No results found
          </h3>
          <p className="text-muted-foreground mb-6">
            No notes found for "{searchQuery}"
          </p>
          <Button
            variant="outline"
            onClick={onClearSearch}
            className="border-border/50 hover:bg-purple-600/10 hover:text-purple-600 hover:border-purple-600/50"
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
}: EmptyTableStateProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="pt-12 pb-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            No notes yet
          </h3>
          <p className="text-muted-foreground mb-6">
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

function TablesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card
          key={index}
          className="bg-card/50 backdrop-blur-sm border-border/50"
        >
          <CardHeader className="pb-3">
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
          <CardFooter className="pt-3 border-t border-border/50">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
