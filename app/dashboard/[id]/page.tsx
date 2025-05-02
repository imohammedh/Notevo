"use client";
import {
  Calendar,
  Clock,
  FileText,
  LayoutGrid,
  List,
  Plus,
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
  DraggableStateSnapshot,
  DroppableProvided,
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
  CardDescription,
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
}

interface NotesDroppableContainerProps {
  tableId: Id<"notesTables">;
  viewMode: ViewMode;
  notes: Note[];
  workspaceSlug?: string;
  workspaceId?: Id<"workingSpaces">;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  const isLoading = !workspace;
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

  return (
    <MaxWContainer className="mb-20">
      {/* Workspace Header */}
      <header className="py-6">
        <div className="w-full p-6 bg-gradient-to-r from-brand_fourthary via-transparent via-15% to-brand_fourthary rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {isLoading ? <SkeletonTextAnimation /> : workspace.name}
                </h1>
              </div>
              <p className="text-brand_tertiary/70 text-sm">
                {tables?.length || 0} tables • {filteredNotes?.length || 0}{" "}
                notes
              </p>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              {/* Search Input */}
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-brand_tertiary/50" />
                <Input
                  placeholder="[⌘+S] Search notes..."
                  className="pl-9 h-9 bg-brand_fourthary/30 border-brand_tertiary/20 text-brand_tertiary w-full md:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={inputRef}
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-brand_tertiary/20 rounded-lg overflow-hidden">
                <Button
                  variant="Trigger"
                  size="icon"
                  className={`h-9 w-9 rounded-none ${
                    viewMode === "grid"
                      ? "bg-brand_tertiary/10"
                      : "bg-transparent"
                  }`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant="Trigger"
                  size="icon"
                  className={`h-9 w-9 rounded-none ${
                    viewMode === "list"
                      ? "bg-brand_tertiary/10"
                      : "bg-transparent"
                  }`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild className="my-1">
                  <Button
                    variant="outline"
                    className="font-medium flex justify-between items-center gap-1"
                  >
                    Create
                    <TbSelector size={14} className="font-bold" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="start"
                  className="rounded-xl m-2 p-1.5 bg-brand_fourthary/90 backdrop-blur border border-solid border-brand_tertiary/20 w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuGroup className="flex-col gap-2">
                    <Button
                      variant="SidebarMenuButton"
                      className=" w-full h-9 px-2"
                      onClick={() => handleCreateTable()}
                      disabled={CreateTableLoading}
                    >
                      {!CreateTableLoading ? (
                        <>
                          <Plus size={16} />
                          Table
                        </>
                      ) : (
                        <>
                          <LoadingAnimation className=" h-3 w-3" />
                          Creating...
                        </>
                      )}
                    </Button>
                    <Button
                      variant="SidebarMenuButton"
                      className=" w-full h-9 px-2"
                      onClick={() =>
                        handleCreateQuickAccessNote(
                          workingSpaceId,
                          workingSpacesSlug,
                        )
                      }
                      disabled={CreateQuickAccessNoteLoading}
                    >
                      {!CreateQuickAccessNoteLoading ? (
                        <>
                          <Plus size={16} />
                          Note
                        </>
                      ) : (
                        <>
                          <LoadingAnimation className=" h-3 w-3" />
                          Creating...
                        </>
                      )}
                    </Button>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <CreateTableBtn workingSpaceId={workingSpaceId} /> */}
            </div>
          </div>
        </div>
      </header>

      {/* Quick Access Notes Section */}
      {quickAccessNotes.length > 0 && (
        <section aria-labelledby="quick-access-title">
          <header className="w-full py-2 px-1">
            <h2
              id="quick-access-title"
              className="text-base text-brand_tertiary font-bold"
            >
              Quick Access Notes
            </h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {quickAccessNotes.map((note) => (
              <QuickAccessNoteCard
                key={note._id}
                note={note}
                workspaceName={workspace?.slug}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tables and Notes Content */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {tables?.length ? (
          <Tabs defaultValue={tables[0]?._id} className="mt-6">
            {/* Table Tabs */}
            <TabsList className="justify-start w-fit flex-wrap h-fit gap-3">
              {tables.map((table) => (
                <TabsTrigger
                  key={table._id}
                  value={table._id}
                  className="flex items-center gap-1.5"
                >
                  <span>{table.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Table Content */}
            {tables.map((table) => (
              <TabsContent key={table._id} value={table._id}>
                <div className="py-2">
                  {/* Table Header */}
                  <div className="w-full flex items-center justify-between border-b border-solid border-brand_tertiary/10 py-3 mb-5">
                    <div className="flex items-center gap-2">
                      <TableSettings
                        notesTableId={table._id}
                        tableName={table.name || ""}
                      />
                      <h2 className="text-xl font-medium">{table.name}</h2>
                    </div>
                    <CreateNoteBtn
                      notesTableId={table._id}
                      workingSpacesSlug={workspace?.slug}
                      workingSpaceId={workingSpaceId}
                    />
                  </div>

                  {/* Notes List */}
                  <NotesDroppableContainer
                    tableId={table._id}
                    viewMode={viewMode}
                    notes={filteredNotes.filter(
                      (note) => note.notesTableId === table._id,
                    )}
                    workspaceSlug={workspace?.slug}
                    workspaceId={workspace?._id}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>
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

function QuickAccessNoteCard({
  note,
  workspaceName,
}: QuickAccessNoteCardProps): JSX.Element {
  return (
    <Card className="group relative bg-brand_fourthary/30 border-brand_tertiary/20 hover:border-brand_tertiary/40 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg w-full flex justify-between items-center">
          {note.title
            ? note.title.length > 20
              ? `${note.title.substring(0, 20)}...`
              : note.title
            : "Untitled"}
          <NoteSettings
            noteId={note._id}
            noteTitle={note.title || ""}
            IconVariant="vertical_icon"
            BtnClassName="opacity-50 group-hover:opacity-100 transition-opacity"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-brand_tertiary/70 line-clamp-2">
          {getContentPreview(note.body || "")}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center text-xs text-brand_tertiary/50">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {typeof window !== "undefined" ? (
            <time dateTime={new Date(note.updatedAt).toISOString()}>
              {new Date(note.updatedAt).toLocaleDateString()}
            </time>
          ) : (
            <SkeletonTextAnimation className="w-20" />
          )}
        </div>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link
            href={`/dashboard/${note.workingSpaceId}/${note.slug}?id=${note._id}`}
          >
            Open
          </Link>
        </Button>
      </CardFooter>
    </Card>
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
}: NotesDroppableContainerProps): JSX.Element {
  return (
    <Droppable
      droppableId={tableId}
      direction={viewMode === "grid" ? "horizontal" : "vertical"}
    >
      {(provided: DroppableProvided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {notes.map((note, index) => (
            <Draggable key={note._id} draggableId={note._id} index={index}>
              {(
                provided: DraggableProvided,
                snapshot: DraggableStateSnapshot,
              ) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className={snapshot.isDragging ? "opacity-80" : ""}
                >
                  {viewMode === "grid" ? (
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
                  )}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}

          {/* Empty state */}
          {notes.length === 0 && (
            <div className="col-span-full py-8">
              {searchQuery ? (
                <EmptySearchResults
                  searchQuery={searchQuery}
                  onClearSearch={() => setSearchQuery("")}
                />
              ) : (
                <EmptyTableState
                  tableId={tableId}
                  workspaceSlug={workspaceSlug}
                  workspaceId={workspaceId}
                />
              )}
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
}

function GridNoteCard({
  note,
  provided,
  workspaceId,
}: NoteCardProps): JSX.Element {
  return (
    <Card
      className="group bg-brand_fourthary/30 border-brand_tertiary/20 hover:border-brand_tertiary/40 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
      {...provided.dragHandleProps}
    >
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-lg pr-8">
          {note.title
            ? note.title.length > 20
              ? `${note.title.substring(0, 20)}...`
              : note.title
            : "Untitled"}
        </CardTitle>
        <div className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity">
          <NoteSettings
            noteId={note._id}
            noteTitle={note.title || ""}
            IconVariant="vertical_icon"
          />
        </div>
      </CardHeader>
      <CardContent className="pb-2 h-16">
        <p className="text-sm text-brand_tertiary/70 line-clamp-2">
          {getContentPreview(note.body || "", "grid")}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center text-xs text-brand_tertiary/50">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {typeof window !== "undefined" ? (
            <time dateTime={new Date(note.createdAt).toISOString()}>
              {new Date(note.createdAt).toLocaleDateString()}
            </time>
          ) : (
            <SkeletonTextAnimation className="w-20" />
          )}
        </div>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href={`/dashboard/${workspaceId}/${note.slug}?id=${note._id}`}>
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
    <div
      className="flex items-center gap-3 p-3 bg-brand_fourthary/30 border border-brand_tertiary/20 hover:border-brand_tertiary/40 rounded-lg transition-all duration-300 hover:shadow-md group"
      {...provided.dragHandleProps}
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand_tertiary/5 text-brand_tertiary/70 flex-shrink-0">
        <FileText className="h-5 w-5" />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-medium truncate">
          {note.title ? note.title : "Untitled"}
        </h3>
        <p className="text-sm text-brand_tertiary/70 truncate">
          {getContentPreview(note.body || "", "list")}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-xs text-brand_tertiary/50 flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {typeof window !== "undefined" ? (
            <time dateTime={new Date(note.createdAt).toISOString()}>
              {new Date(note.createdAt).toLocaleDateString()}
            </time>
          ) : (
            <SkeletonTextAnimation className="w-20" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-7 px-2 text-xs"
          >
            <Link
              href={`/dashboard/${workspaceId}/${note.slug}?id=${note._id}`}
            >
              Open
            </Link>
          </Button>
          <NoteSettings
            noteId={note._id}
            noteTitle={note.title || ""}
            IconVariant="vertical_icon"
            BtnClassName="opacity-50 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
}

function EmptySearchResults({
  searchQuery,
  onClearSearch,
}: EmptySearchResultsProps): JSX.Element {
  return (
    <div className="text-center">
      <Search className="h-10 w-10 mx-auto mb-3 text-brand_tertiary/30" />
      <h3 className="text-lg font-medium mb-1">No notes found</h3>
      <p className="text-brand_tertiary/70 mb-4">
        No notes matching "{searchQuery}" in this table
      </p>
      <Button
        variant="outline"
        className="border-brand_tertiary/30 text-brand_tertiary"
        onClick={onClearSearch}
      >
        Clear search
      </Button>
    </div>
  );
}

function EmptyTableState({
  tableId,
  workspaceSlug,
  workspaceId,
}: EmptyTableStateProps): JSX.Element {
  return (
    <div className="text-center">
      <FileText className="h-10 w-10 mx-auto mb-3 text-brand_tertiary/30" />
      <h3 className="text-lg font-medium mb-1">No notes yet</h3>
      <p className="text-brand_tertiary/70 mb-4">
        Create your first note in this table
      </p>
      <span className="w-full flex justify-center items-center">
        <CreateNoteBtn
          notesTableId={tableId}
          workingSpacesSlug={workspaceSlug}
          workingSpaceId={workspaceId}
        />
      </span>
    </div>
  );
}

function TablesSkeleton(): JSX.Element {
  return (
    <div className="animate-pulse relative mb-20 mt-6">
      <div className="py-5">
        <div className="w-full flex items-center justify-between border-b border-solid border-brand_tertiary/10 py-5 mb-5">
          <div className="skeleton w-1/2 h-6 bg-brand_tertiary/20 rounded"></div>
          <div className="skeleton w-14 h-9 bg-brand_tertiary/20 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="bg-brand_fourthary/30 border-brand_tertiary/20"
            >
              <CardHeader className="pb-2">
                <div className="skeleton w-3/4 h-6 bg-brand_tertiary/20 rounded"></div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="skeleton w-full h-4 bg-brand_tertiary/20 rounded mb-2"></div>
                <div className="skeleton w-2/3 h-4 bg-brand_tertiary/20 rounded"></div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="skeleton w-24 h-4 bg-brand_tertiary/20 rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
