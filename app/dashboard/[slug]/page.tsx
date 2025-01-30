"use client";
import { Calendar } from "lucide-react";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import CreateTableBtn from "../../../components/dashboard-components/CreateTableBtn";
import CreateNoteBtn from "@/components/dashboard-components/CreateNoteBtn";
import ADiv from "@/components/dashboard-components/ADiv";
import TableSettings from "@/components/dashboard-components/TableSettings";
import NoteSettings from "@/components/dashboard-components/NoteSettings";
export default function WorkingSpacePage() {
  const searchParams = useSearchParams()  
  const workingSpaceId = searchParams.get('id');
  const getNoteTable = useQuery(api.mutations.notesTables.getTables);
  const getNotes = useQuery(api.mutations.notes.getNotes);
  return (
      <MaxWContainer className=" relative">
      <ADiv>
        {
            (getNoteTable?.map((table) => (
              <div key={table._id}>
                {
                  (table.workingSpaceId === workingSpaceId ) &&
                  (
                    <div className="py-5">
                      <div className=" w-full flex items-center justify-between border-b border-solid border-brand_tertiary/20 py-5 mb-5">
                        <h1 className=" text-pretty text-xl font-medium flex justify-center items-center gap-1"><TableSettings notesTableId={table._id}/>{table.name}</h1>
                        <CreateNoteBtn notesTableId={table._id}/>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        { 
                          getNotes?.map((note) => (
                            note.notesTableId === table._id && 
                            <div key={note._id}>
                              {
                                (
                                    <button className=" relative group p-3.5 w-full h-40 flex flex-col flex-shrink-0 flex-grow-0 justify-start items-start border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300 hover:border-brand_tertiary/30 hover:scale-y-105" >
                                      <span className=" flex justify-center items-center gap-1">
                                        <NoteSettings noteId={note._id}/>
                                        <h1 className=" text-pretty text-lg font-medium">{note.title}</h1>
                                      </span>
                                      <span className=" absolute bottom-2 left-5 ">
                                        <span className=" flex justify-center items-center gap-1">
                                          <Calendar size="16" className="transition-all duration-200 ease-in-out opacity-10 group-hover:opacity-80"/>
                                          <p className=" font-normal text-sm transition-all duration-200 delay-150 ease-in-out opacity-0 group-hover:opacity-80">{new Date(note.createdAt).toLocaleDateString()}</p>
                                        </span>
                                      </span>
                                    </button>
                                )
                              }
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )
                }
              </div>
            )))
        }
      </ADiv>
      <CreateTableBtn 
        workingSpaceId={workingSpaceId}
        className=" fixed bottom-5 right-5"
      />
      </MaxWContainer>  
  );
}