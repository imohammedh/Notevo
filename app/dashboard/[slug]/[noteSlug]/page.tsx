"use client";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { JSONContent } from "@tiptap/react";
import TailwindAdvancedEditor from "@/components/advanced-editor";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export default function NotePage() {
  const [step, setStep] = useState<"writeingNote" | "contrbute">();
  const searchParams = useSearchParams();
  const noteid = searchParams.get("id");
  const viwer = useQuery(api.users.viewer);

  const updateNote = useMutation(api.mutations.notes.updateNote);
  const getNotes = useQuery(api.mutations.notes.getNoteByUserId, {
    userid: viwer?._id,
  });
  const getNote = getNotes?.find((note) => note._id === noteid);

  const initialContent: JSONContent = getNote?.body
    ? JSON.parse(getNote.body)
    : "Start with Pressing '/' for commands ✨";

  const [content, setContent] = useState<JSONContent>(initialContent);

  useEffect(() => {
    if (getNote?.body) {
      setContent(JSON.parse(getNote.body));
    }
  }, [getNote]);

  const debouncedUpdateNote = useDebouncedCallback(
    (updatedContent: JSONContent) => {
      updateNote({
        _id: noteid,
        userid: viwer?._id,
        notesTableId: getNote?.notesTableId,
        title: getNote?.title,
        body: JSON.stringify(updatedContent),
        workingSpacesSlug: getNote?.workingSpacesSlug,
        createdAt: getNote?.createdAt,
      });
    },
    500,
  );

  return (
    <MaxWContainer>
      {step !== undefined ||
        (!getNote?.body && (
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-5 py-16">
            <button
              onClick={() => setStep("writeingNote")}
              className="p-5 w-full sm:w-1/4 h-32 text-start border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300 hover:border-brand_tertiary/30 hover:scale-y-105"
            >
              <span className=" flex flex-col justify-center items-start">
                <h1 className=" text-brand_tertiary text-lg py-2">
                  Start Writing & Unlock AI Power ✨
                </h1>
                <p className=" text-brand_tertiary/50 text-sm">
                  Enjoy a rich-text editing experience and leverage AI to
                  improve productivity.
                </p>
              </span>
            </button>
            <button
              onClick={() => setStep("contrbute")}
              disabled={true}
              className=" relative opacity-70 p-4 w-1/4 h-32 text-start border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300 hover:border-brand_tertiary/30 hover:scale-y-105"
            >
              <span className=" flex flex-col justify-center items-start">
                <h1 className=" text-brand_tertiary text-lg py-2">
                  Contributing 🙋🏼‍♂️
                </h1>
                <p className=" text-brand_tertiary/50 text-sm">
                  Start working with your colleague in real-time and leverage AI
                  to improve productivity.
                </p>
              </span>
              <Badge
                variant="default"
                className=" bg-blue-900 text-brand_tertiary absolute -top-2 right-0"
              >
                📌 Comming Soon
              </Badge>
            </button>
          </div>
        ))}
      {step === "writeingNote" ? (
        <TailwindAdvancedEditor
          initialContent={content}
          onUpdate={(editor) => {
            const updatedContent = editor.getJSON();
            setContent(updatedContent);
            debouncedUpdateNote(updatedContent);
          }}
        />
      ) : (
        getNote?.body && (
          <TailwindAdvancedEditor
            initialContent={content}
            onUpdate={(editor) => {
              const updatedContent = editor.getJSON();
              setContent(updatedContent);
              debouncedUpdateNote(updatedContent);
            }}
          />
        )
      )}
    </MaxWContainer>
  );
}
