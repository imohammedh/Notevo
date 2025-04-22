"use client";
import { Calendar, FileText, LayoutGrid, List, Search } from "lucide-react";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSearchParams, useParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CreateTableBtn from "@/components/dashboard-components/CreateTableBtn";
import CreateNoteBtn from "@/components/dashboard-components/CreateNoteBtn";
import TableSettings from "@/components/dashboard-components/TableSettings";
import NoteSettings from "@/components/dashboard-components/NoteSettings";
import TablesNotFound from "@/components/dashboard-components/TablesNotFound";
import { useState, useEffect } from "react";
import Link from "next/link";
import { parseSlug } from "@/lib/parseSlug";
import {
  extractTextFromTiptap as parseTiptapContentExtractText,
  truncateText as parseTiptapContentTruncateText,
} from "@/lib/parse-tiptap-content";
import type { Id } from "@/convex/_generated/dataModel";
import SkeletonTextAnimation from "@/components/ui/SkeletonTextAnimation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function WorkingSpacePage() {
  const searchParams = useSearchParams();
  const workingSpaceId: Id<"workingSpaces"> = searchParams.get(
    "id",
  ) as Id<"workingSpaces">;
  const params = useParams();
  const workingSpaceName = params.slug;
  const workingspaceNameafterparseSlug = parseSlug(`${workingSpaceName}`);
  const getNoteTable = useQuery(api.mutations.notesTables.getTables, {
    workingSpaceId: workingSpaceId,
  });
  const getNotes = useQuery(api.mutations.notes.getNoteByUserId);
  const updateNoteOrder = useMutation(api.mutations.notes.updateNoteOrder);

  const [optimisticNotes, setOptimisticNotes] = useState(getNotes);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setOptimisticNotes(getNotes);
  }, [getNotes]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    )
      return;

    const sourceTableId = result.source.droppableId;
    const destTableId = result.destination.droppableId;

    if (sourceTableId === destTableId && optimisticNotes) {
      const updatedNotes = [...optimisticNotes];

      const sourceTableNotes = updatedNotes.filter(
        (note) => note.notesTableId === sourceTableId,
      );

      const [movedNote] = sourceTableNotes.splice(result.source.index, 1);
      sourceTableNotes.splice(result.destination.index, 0, movedNote);

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

  const notesToRender = optimisticNotes || getNotes;

  // Filter notes based on search query
  const filteredNotes = notesToRender
    ? notesToRender.filter((note) => {
        if (!searchQuery) return true;
        return note.title?.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : [];
  // Function to get content preview
  const getContentPreview = (content: any) => {
    if (!content) return "No content yet. Click to start writing...";

    try {
      const plainText = parseTiptapContentExtractText(content);
      return plainText
        ? parseTiptapContentTruncateText(
            plainText,
            viewMode === "grid" ? 80 : 120,
          )
        : "No content yet. Click to start writing...";
    } catch (error) {
      console.error("Error parsing content:", error);
      return "Unable to display content preview";
    }
  };
  return (
    <MaxWContainer className="mb-20">
      <header className="py-6">
        <div className="w-full p-6 bg-gradient-to-r from-brand_fourthary via-transparent via-15% to-brand_fourthary rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {workingspaceNameafterparseSlug}
                </h1>
              </div>
              <p className="text-brand_tertiary/70 text-sm">
                {getNoteTable?.length || 0} tables •{" "}
                {notesToRender?.length || 0} notes
              </p>
            </div>
            <div className="flex items-center gap-2 self-end md:self-auto">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-brand_tertiary/50" />
                <Input
                  placeholder="Search notes..."
                  className="pl-9 h-9 bg-brand_fourthary/30 border-brand_tertiary/20 text-brand_tertiary w-full md:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center border border-brand_tertiary/20 rounded-lg overflow-hidden">
                <Button
                  variant="Trigger"
                  size="icon"
                  className={`h-9 w-9 rounded-none ${viewMode === "grid" ? "bg-brand_tertiary/10" : "bg-transparent"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant="Trigger"
                  size="icon"
                  className={`h-9 w-9 rounded-none ${viewMode === "list" ? "bg-brand_tertiary/10" : "bg-transparent"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>
              <CreateTableBtn workingSpaceId={workingSpaceId} />
            </div>
          </div>
        </div>
      </header>

      <DragDropContext onDragEnd={handleDragEnd}>
        {getNoteTable?.length !== 0 ? (
          getNoteTable ? (
            <Tabs defaultValue={getNoteTable[0]?._id} className="mt-4">
              <TabsList className="mb-6 justify-start w-fit flex-wrap h-fit gap-3">
                {getNoteTable.map((table) => (
                  <TabsTrigger
                    key={table._id}
                    value={table._id}
                    className="flex items-center gap-1.5"
                  >
                    <span>{table.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {getNoteTable.map((table) => (
                <TabsContent key={table._id} value={table._id}>
                  <div className="py-2">
                    <div className="w-full flex items-center justify-between border-b border-solid border-brand_tertiary/10 py-3 mb-5">
                      <div className="flex items-center gap-2">
                        <TableSettings
                          notesTableId={table._id}
                          tableName={table.name}
                        />
                        <h2 className="text-xl font-medium">{table.name}</h2>
                      </div>
                      <CreateNoteBtn
                        notesTableId={table._id}
                        workingSpacesSlug={params.slug}
                      />
                    </div>

                    <Droppable
                      droppableId={table._id}
                      direction={
                        viewMode === "grid" ? "horizontal" : "vertical"
                      }
                    >
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={
                            viewMode === "grid"
                              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                              : "flex flex-col gap-3"
                          }
                        >
                          {filteredNotes
                            .filter((note) => note.notesTableId === table._id)
                            .map((note, index) => (
                              <Draggable
                                key={note._id}
                                draggableId={note._id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`${snapshot.isDragging ? "opacity-80" : ""}`}
                                  >
                                    {viewMode === "grid" ? (
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
                                              noteTitle={note.title}
                                              IconVariant="vertical_icon"
                                              Tooltip_placement="left"
                                            />
                                          </div>
                                        </CardHeader>
                                        <CardContent className="pb-2 h-16">
                                          <p className="text-sm text-brand_tertiary/70 line-clamp-2">
                                            {getContentPreview(note.body)}
                                          </p>
                                        </CardContent>
                                        <CardFooter className="pt-2 flex justify-between items-center text-xs text-brand_tertiary/50">
                                          <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {typeof window !== "undefined" ? (
                                              <span>{`${new Date(note.createdAt).toLocaleDateString()}`}</span>
                                            ) : (
                                              <SkeletonTextAnimation className="w-20" />
                                            )}
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                            className="h-7 px-2 text-xs"
                                          >
                                            <Link
                                              href={`/dashboard/${params.slug}/${note.slug}?id=${note._id}`}
                                            >
                                              Open
                                            </Link>
                                          </Button>
                                        </CardFooter>
                                      </Card>
                                    ) : (
                                      <div
                                        className="flex items-center gap-3 p-3 bg-brand_fourthary/30 border border-brand_tertiary/20 hover:border-brand_tertiary/40 rounded-lg transition-all duration-300 hover:shadow-md group"
                                        {...provided.dragHandleProps}
                                      >
                                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand_tertiary/5 text-brand_tertiary/70 flex-shrink-0">
                                          <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                          <h3 className="font-medium truncate">
                                            {note.title
                                              ? note.title
                                              : "Untitled"}
                                          </h3>
                                          <p className="text-sm text-brand_tertiary/70 truncate">
                                            {getContentPreview(note.body)}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                          <div className="text-xs text-brand_tertiary/50 flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {typeof window !== "undefined" ? (
                                              <span>{`${new Date(note.createdAt).toLocaleDateString()}`}</span>
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
                                                href={`/dashboard/${params.slug}/${note.slug}?id=${note._id}`}
                                              >
                                                Open
                                              </Link>
                                            </Button>
                                            <NoteSettings
                                              noteId={note._id}
                                              noteTitle={note.title}
                                              IconVariant="vertical_icon"
                                              Tooltip_placement="left"
                                              BtnClassName="opacity-50 group-hover:opacity-100 transition-opacity"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                          {filteredNotes.filter(
                            (note) => note.notesTableId === table._id,
                          ).length === 0 && (
                            <div className="col-span-full py-8">
                              {searchQuery ? (
                                <div className="text-center">
                                  <Search className="h-10 w-10 mx-auto mb-3 text-brand_tertiary/30" />
                                  <h3 className="text-lg font-medium mb-1">
                                    No notes found
                                  </h3>
                                  <p className="text-brand_tertiary/70 mb-4">
                                    No notes matching "{searchQuery}" in this
                                    table
                                  </p>
                                  <Button
                                    variant="outline"
                                    className="border-brand_tertiary/30 text-brand_tertiary"
                                    onClick={() => setSearchQuery("")}
                                  >
                                    Clear search
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <FileText className="h-10 w-10 mx-auto mb-3 text-brand_tertiary/30" />
                                  <h3 className="text-lg font-medium mb-1">
                                    No notes yet
                                  </h3>
                                  <p className="text-brand_tertiary/70 mb-4">
                                    Create your first note in this table
                                  </p>
                                  <span className=" w-full flex justify-center items-center">
                                    <CreateNoteBtn
                                      notesTableId={table._id}
                                      workingSpacesSlug={params.slug}
                                    />
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
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
          )
        ) : (
          <TablesNotFound workingSpaceId={workingSpaceId} />
        )}
      </DragDropContext>
    </MaxWContainer>
  );
}
