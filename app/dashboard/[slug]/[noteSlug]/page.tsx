"use client";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { JSONContent } from "@tiptap/react";
import TailwindAdvancedEditor from "@/components/advanced-editor";
import { useDebouncedCallback } from "use-debounce";

export default function NotePage() {
  const searchParams = useSearchParams();
  const noteid = searchParams.get("id");

  const updateNote = useMutation(api.mutations.notes.updateNote);
  const getNotes = useQuery(api.mutations.notes.getNotes);
  const getNote = getNotes?.find(note => note._id === noteid);

  const initialContent: JSONContent = getNote?.body
    ? JSON.parse(getNote.body)
    : { type: "doc", content: [{ type: 'paragraph' }] };

  const [content, setContent] = useState<JSONContent>(initialContent);
  
  useEffect(() => {
    if (getNote?.body) {
      setContent(JSON.parse(getNote.body));
    }
  }, [getNote]);
  const viwer = useQuery(api.users.viewer);

  const debouncedUpdateNote = useDebouncedCallback((updatedContent: JSONContent) => {
    updateNote({
      _id: noteid,
      userid:viwer?._id,
      notesTableId: getNote?.notesTableId,
      title: getNote?.title,
      body: JSON.stringify(updatedContent),
      workingSpacesSlug:getNote?.workingSpacesSlug,
      createdAt: getNote?.createdAt,
    });
  }, 500);

  return (
    <MaxWContainer>
      <TailwindAdvancedEditor 
        initialContent={content} 
        onUpdate={(editor) => {
          const updatedContent = editor.getJSON();
          setContent(updatedContent);
          debouncedUpdateNote(updatedContent);
        }}
      />
    </MaxWContainer>
  );
}
