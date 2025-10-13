"use client";
import {
  Calendar,
  FileText,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
} from "@hello-pangea/dnd";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// Utils
import { getContentPreview } from "@/lib/getContentPreview";
import { JSX } from "react/jsx-runtime";
import { TbSelector } from "react-icons/tb";
import { useHotkeys } from "react-hotkeys-hook";
import { cn } from "@/lib/utils";

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
  provided?: DraggableProvided;
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

  const workspace = useQuery(api.mutations.workingSpaces.getWorkingSpaceById, {
    _id: workingSpaceId,
  });
  const workingSpacesSlug: string | undefined =
    workspace && (workspace.slug as string);

  const tables = useQuery(api.mutations.notesTables.getTables, {
    workingSpaceId,
  });

  const allNotes = useQuery(api.mutations.notes.getNoteByUserId);

  const updateNoteOrder = useMutation(api.mutations.notes.updateNoteOrder);

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
  
    // Store original title to restore later
    const originalTitle = document.title;
    
    // Update document title
    document.title = `${workspace.name} - Notevo Workspace`;
  
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionContent = `${workspace.name} workspace with ${
      tables?.length || 0
    } tables and ${
      filteredNotes?.length || 0
    } notes. Organize your thoughts with Notevo.`;
  
    let createdMeta = false;
  
    if (metaDescription) {
      const originalContent = metaDescription.getAttribute('content');
      metaDescription.setAttribute("content", descriptionContent);
      
      // Cleanup function
      return () => {
        document.title = originalTitle;
        if (originalContent) {
          metaDescription?.setAttribute('content', originalContent);
        }
      };
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = descriptionContent;
      document.head.appendChild(newMeta);
      createdMeta = true;
  
      // Cleanup function
      return () => {
        document.title = originalTitle;
        if (createdMeta) {
          newMeta.remove();
        }
      };
    }
  }, [workspace?.name, tables?.length, filteredNotes?.length]);
  const isLoading = !workspace;
  const filterNoteByworkingspaceId = filteredNotes?.filter((note) => note.workingSpaceId === workingSpaceId);

  return (
    <MaxWContainer className="mb-20">
      {/* Workspace Header */}
      <header className="py-4 md:py-6">
        <div className="w-full p-4 md:p-6 bg-gradient-to-l from-accent via-transparent via-15% to-accent rounded-xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-semibold text-foreground truncate">
                    {isLoading ? <SkeletonTextAnimation /> : workspace.name}
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  {tables?.length || 0} tables • {filterNoteByworkingspaceId?.length || 0} notes
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <CreateTableBtn workingSpaceId={workingSpaceId} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tables and Notes Content */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {tables?.length ? (
          <Tabs defaultValue={tables[0]._id} className="mt-4">
            <div className="overflow-x-auto py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              <TabsList className="text-card-foreground justify-start w-fit min-w-full sm:min-w-fit flex-wrap h-fit gap-2 sm:gap-3">
                {tables.map((table) => (
                  <TabsTrigger
                    key={table._id}
                    value={table._id}
                    className="flex items-center gap-2 whitespace-nowrap text-sm"
                  >
                    <span className="truncate max-w-[120px] sm:max-w-none">
                      {table.name}
                    </span>
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
}: NotesDroppableContainerProps): JSX.Element {
  return (
    <div className="py-2">
      <div className="w-full border-b border-border py-3 mb-5">
        <div className="flex flex-col gap-4">
          {/* Top row - Notes count and Create button */}
          <div className="flex items-center justify-between">
            <div className="hidden sm:block flex items-center gap-2">
              <div className="text-foreground font-medium">
                {tables?.find(t => t._id === tableId)?.name}
              </div>
            </div>
          <div className="flex flex-row items-center justify-center gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 text-foreground border-border"
              />
            </div>
            <div className="flex items-center justify-center border border-border rounded-lg overflow-hidden ">
              <Button
                variant="Trigger"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-md",
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
                  "h-8 w-8 rounded-md",
                  viewMode === "list" && "bg-muted"
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <CreateNoteBtn
                workingSpaceId={workspaceId}
                workingSpacesSlug={workspaceSlug}
                notesTableId={tableId}
              />
              <TableSettings notesTableId={tableId} tableName={tables?.find(t => t._id === tableId)?.name} />
            </div>
          </div>
          </div>
          
          {/* Bottom row - Search and View controls */}
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
        <Droppable droppableId={tableId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
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

function GridNoteCard({
  note,
  provided,
  workspaceId,
}: NoteCardProps): JSX.Element {
  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="group bg-card/30 border-border hover:border-border/40 transition-all duration-300 hover:shadow-md hover:scale-[1.02] h-fit"
    >
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-sm sm:text-base lg:text-lg text-foreground leading-tight">
          {note.title
            ? note.title.length > 20
              ? `${note.title.substring(0, 20)}...`
              : note.title
            : "Untitled"}
        </CardTitle>
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-50 group-hover:opacity-100 transition-opacity">
          <NoteSettings noteId={note._id} noteTitle={note.title} IconVariant="vertical_icon" DropdownMenuContentAlign="start" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {getContentPreview(note.body)}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-xs text-muted-foreground">
        <div className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          {typeof window !== "undefined" ? (
            <span className="text-xs">{`${new Date(note.updatedAt).toLocaleDateString()}`}</span>
          ) : (
            <SkeletonTextAnimation className="w-16 sm:w-20" />
          )}
        </div>
        <Button variant="ghost" size="sm" asChild className="h-6 sm:h-7 px-2 text-xs self-start sm:self-auto">
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
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="group bg-card/30 border-border hover:border-border/40 transition-all duration-300 hover:shadow-md"
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base text-foreground font-medium truncate">
                {note.title || "Untitled"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                {getContentPreview(note.body)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {typeof window !== "undefined" ? (
                <span className="text-xs">{`${new Date(note.updatedAt).toLocaleDateString()}`}</span>
              ) : (
                <SkeletonTextAnimation className="w-16 sm:w-20" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <NoteSettings noteId={note._id} noteTitle={note.title} IconVariant="vertical_icon" DropdownMenuContentAlign="start" />
              <Button variant="ghost" size="sm" asChild className="h-6 sm:h-7 px-2 text-xs">
                <Link
                  href={`/dashboard/${workspaceId}/${note.slug}?id=${note._id}`}
                >
                  Open
                </Link>
              </Button>
            </div>
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

function TablesSkeleton(): JSX.Element {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="bg-card/30 border-border">
          <CardHeader className="pb-2">
            <div className="h-6 w-3/4 bg-primary/20 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-16 flex items-center justify-center">
              <div className="h-10 w-10 bg-primary/20 rounded-full animate-pulse" />
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="h-4 w-24 bg-primary/20 rounded animate-pulse" />
          </CardFooter>
        </Card> 
      ))}
    </div>
  );
}