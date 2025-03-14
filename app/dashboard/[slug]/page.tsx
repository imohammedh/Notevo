"use client";
import { Calendar, Plus } from "lucide-react";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSearchParams, useParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CreateTableBtn from "../../../components/dashboard-components/CreateTableBtn";
import CreateNoteBtn from "@/components/dashboard-components/CreateNoteBtn";
import ADiv from "@/components/dashboard-components/ADiv";
import TableSettings from "@/components/dashboard-components/TableSettings";
import NoteSettings from "@/components/dashboard-components/NoteSettings";
import TablesNotFound from "@/components/dashboard-components/TablesNotFound";
import { useState, useEffect } from "react";
import FloatingNavbar from "@/components/dashboard-components/FloatingNavbar";
import Link from "next/link";
import { Tooltip } from "@heroui/tooltip";
import { parseSlug } from "@/lib/parseSlug";

export default function WorkingSpacePage() {
  const searchParams = useSearchParams();
  const workingSpaceId = searchParams.get("id");
  const Params = useParams();
  const workingSpaceName = Params.slug;
  const workingspaceNameafterparseSlug = parseSlug(`${workingSpaceName}`);
  const getNoteTable = useQuery(api.mutations.notesTables.getTables, {
    workingSpaceId: workingSpaceId,
  });
  const viwer = useQuery(api.users.viewer);
  const getNotes = useQuery(api.mutations.notes.getNoteByUserId, {
    userid: viwer?._id,
  });
  const updateNoteOrder = useMutation(api.mutations.notes.updateNoteOrder);

  const [optimisticNotes, setOptimisticNotes] = useState(getNotes);

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

  return (
    <MaxWContainer className=" mb-20">
      <header className="py-10">
        <div className=" w-full flex justify-between items-center p-5 bg-gradient-to-r from-brand_fourthary via-transparent via-15% to-brand_fourthary rounded-xl">
          <h1 className="text-4xl font-bold">
            {workingspaceNameafterparseSlug}
          </h1>
          <CreateTableBtn workingSpaceId={workingSpaceId} />
        </div>
      </header>
      <DragDropContext onDragEnd={handleDragEnd}>
        {getNoteTable?.length !== 0 ? (
          getNoteTable ? (
            getNoteTable.map((table) => (
              <div key={table._id}>
                {
                  <div className="py-5">
                    <div className=" w-full flex items-center justify-between border-b border-solid border-brand_tertiary/10 py-5 mb-5">
                      <h1 className=" text-pretty text-xl font-medium flex justify-center items-center gap-1">
                        <TableSettings notesTableId={table._id} />
                        {table.name}
                      </h1>
                      <CreateNoteBtn
                        notesTableId={table._id}
                        workingSpacesSlug={Params.slug}
                      />
                    </div>
                    <Droppable droppableId={table._id} direction="horizontal">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="grid grid-cols-1 sm:grid-cols-2 md:grid-c ols-3 lg:grid-cols-4 gap-2"
                        >
                          {notesToRender ? (
                            notesToRender
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
                                      {...provided.dragHandleProps}
                                      className={`${snapshot.isDragging ? "opacity-80" : ""}`}
                                    >
                                      <div className="relative group p-3.5 w-full h-40 bg-brand_primary border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300 hover:border-brand_tertiary/30 hover:scale-y-105">
                                        <Tooltip
                                          className="bg-brand_fourthary text-sm rounded-xl"
                                          content="move or open"
                                          showArrow={true}
                                          placement="bottom-end"
                                        >
                                          <Link
                                            href={`/dashboard/${Params.slug}/${note.slug}?id=${note._id}`}
                                            className="w-full h-full flex flex-col flex-shrink-0 flex-grow-0 justify-start items-start gap-1"
                                          >
                                            <h1 className="text-lg font-medium text-nowrap">
                                              {note.title
                                                ? note.title.length > 20
                                                  ? `${note.title.substring(0, 20)}...`
                                                  : note.title
                                                : "Untitled"}
                                            </h1>
                                          </Link>
                                        </Tooltip>
                                        <span className="w-10 h-10 absolute top-3 right-0 transition-all duration-200 ease-in-out opacity-10 group-hover:opacity-80">
                                          <NoteSettings noteId={note._id} />
                                        </span>
                                        <span className="flex justify-center items-center gap-1 absolute bottom-5 left-5 transition-all duration-200 ease-in-out opacity-10 group-hover:opacity-80">
                                          <Calendar size="16" />
                                          <p className=" font-normal text-sm">
                                            {new Date(
                                              note.createdAt,
                                            ).toLocaleDateString()}
                                          </p>
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))
                          ) : (
                            <div>
                              {Array.from({ length: 1 }).map((_, index) => (
                                <div key={index}>
                                  <div className="relative group p-3.5 w-full h-40 border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300">
                                    <div className="skeleton w-32 h-6 bg-brand_tertiary/20 rounded mb-2"></div>
                                    <div className="skeleton w-28 h-4 bg-brand_tertiary/20 rounded mb-1"></div>
                                    <div className="skeleton w-10 h-8 absolute top-3 right-2 bg-brand_tertiary/20 rounded"></div>
                                    <div className="flex justify-center items-center gap-1 absolute bottom-5 left-5">
                                      <div className="skeleton w-10 h-4 bg-brand_tertiary/20 rounded"></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                }
              </div>
            ))
          ) : (
            <div className="animate-pulse relative mb-20">
              <div className="py-5">
                <div className=" w-full flex items-center justify-between border-b border-solid border-brand_tertiary/10 py-5 mb-5">
                  <div className="skeleton w-1/2 h-6 bg-brand_tertiary/20 rounded"></div>
                  <div className="skeleton w-14 h-9 bg-brand_tertiary/20 rounded"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index}>
                      <div className="relative group p-3.5 w-full h-40 border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300">
                        <div className="skeleton w-32 h-6 bg-brand_tertiary/20 rounded mb-2"></div>
                        <div className="skeleton w-28 h-4 bg-brand_tertiary/20 rounded mb-1"></div>
                        <div className="skeleton w-10 h-8 absolute top-3 right-2 bg-brand_tertiary/20 rounded"></div>
                        <div className="flex justify-center items-center gap-1 absolute bottom-5 left-5">
                          <div className="skeleton w-10 h-4 bg-brand_tertiary/20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <TablesNotFound workingSpaceId={workingSpaceId} />
        )}
      </DragDropContext>
      <FloatingNavbar />
    </MaxWContainer>
  );
}
