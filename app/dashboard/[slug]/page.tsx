"use client";
import { Calendar, Plus } from "lucide-react";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSearchParams, useParams } from "next/navigation";
import CreateTableBtn from "../../../components/dashboard-components/CreateTableBtn";
import CreateNoteBtn from "@/components/dashboard-components/CreateNoteBtn";
import ADiv from "@/components/dashboard-components/ADiv";
import TableSettings from "@/components/dashboard-components/TableSettings";
import NoteSettings from "@/components/dashboard-components/NoteSettings";
import TablesNotFound from "@/components/dashboard-components/TablesNotFound";
import { useState } from "react";
import FloatingNavbar from "@/components/dashboard-components/FloatingNavbar";
import Link from "next/link";
export default function WorkingSpacePage() {
  const searchParams = useSearchParams();
  const workingSpaceId = searchParams.get("id");
  const Params = useParams();
  const getNoteTable = useQuery(api.mutations.notesTables.getTables, {
    workingSpaceId: workingSpaceId,
  });
  const viwer = useQuery(api.users.viewer);
  const getNotes = useQuery(api.mutations.notes.getNoteByUserId, {
    userid: viwer?._id,
  });
  const createNote = useMutation(api.mutations.notes.createNote);
  return (
    <MaxWContainer className=" relative mb-20">
      <ADiv>
        {getNoteTable?.length !== 0 ? (
          getNoteTable?.map((table) => (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-c ols-3 lg:grid-cols-4 gap-2">
                    {getNotes?.map(
                      (note) =>
                        note.notesTableId === table._id && (
                          <div key={note._id}>
                            <div className=" relative group p-3.5 w-full h-40 border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300 hover:border-brand_tertiary/30 hover:scale-y-105">
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
                        ),
                    )}
                  </div>
                </div>
              }
            </div>
          ))
        ) : (
          <TablesNotFound workingSpaceId={workingSpaceId} />
        )}
      </ADiv>
      <CreateTableBtn
        workingSpaceId={workingSpaceId}
        className=" fixed bottom-5 right-5"
      />
      <FloatingNavbar />
    </MaxWContainer>
  );
}
