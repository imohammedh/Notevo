"use client";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { Editor } from "novel";
import { useState, useEffect } from "react";
import { JSONContent } from '@tiptap/react';
export default function NotePage() {
    const searchParams = useSearchParams() 
    const noteid=searchParams.get("id")
    const updateNote = useMutation(api.mutations.notes.updateNote);
    const getNotes = useQuery(api.mutations.notes.getNotes);
    const getNote = getNotes?.find(note => note._id === noteid);
    console.log(getNote?.body)
    const initialContent: JSONContent = getNote?.body
    ? JSON.parse(getNote?.body) 
    : { type: 'doc', content: [{ type: 'paragraph' }] }; 

    const [content, setContent] = useState<JSONContent>(initialContent);
    console.log(content)

    useEffect(() => {
      if (getNote?.body) {
          setContent(JSON.parse(getNote.body));
      }
    }, [getNote]);

    const handleKeyUp = (editorInstance: any) => {
        const content = editorInstance.getJSON();
        updateNote({
          _id: noteid,
          notesTableId: getNote?.notesTableId,
          title: getNote?.title,
          body: JSON.stringify(content),
          createdAt: getNote?.createdAt
        });
        setContent(content);
    };
  return (
    <MaxWContainer>
      <Editor
          className="bg-none text-brand_tertiary"
          defaultValue={content}
          onUpdate={handleKeyUp}
          onDebouncedUpdate={handleKeyUp}
          disableLocalStorage={true}
      />
    </MaxWContainer>
  )
}
//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