"use client";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { JSONContent } from "@tiptap/react";
import TailwindAdvancedEditor from "@/components/advanced-editor";
import { useDebouncedCallback } from "use-debounce";
import type { Id } from "@/convex/_generated/dataModel";

export default function NotePage() {
  const searchParams = useSearchParams();
  const noteid: Id<"notes"> = searchParams.get("id") as Id<"notes">;

  const updateNote = useMutation(api.mutations.notes.updateNote);
  const getNotes = useQuery(api.mutations.notes.getNoteByUserId);
  const getNote = getNotes?.find((note) => note._id === noteid);
  if (!getNote) {
    throw new Error("! The Note with this _id can't be found");
  }
  const initialContent: JSONContent = getNote?.body
    ? JSON.parse(getNote.body)
    : {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "! Hi 👋 " }],
          },
          {
            type: "codeBlock",
            attrs: { language: "typescriptreact" },
            content: [
              {
                type: "text",
                text: "Write something or Press '/' for commands",
              },
            ],
          },
          { type: "paragraph" },
        ],
      };
      const [content, setContent] = useState<JSONContent>(initialContent);

      useEffect(() => {
        if (!getNote?.title) return;
      
        // Store original values
        const originalTitle = document.title;
        
        // Update document title
        document.title = `${getNote.title} - Notevo`;
      
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        const originalContent = metaDescription?.getAttribute('content');
        
        // Create better description from note content or title
        const descriptionText = getNote.body 
          ? `${getNote.title}: ${getNote.body.substring(0, 150)}...` 
          : `View and edit "${getNote.title}" on Notevo`;
      
        let createdMeta = false;
      
        if (metaDescription) {
          metaDescription.setAttribute("content", descriptionText);
        } else {
          const newMeta = document.createElement("meta");
          newMeta.name = "description";
          newMeta.content = descriptionText;
          document.head.appendChild(newMeta);
          createdMeta = true;
          metaDescription = newMeta;
        }
      
        // Cleanup function
        return () => {
          document.title = originalTitle;
          if (createdMeta && metaDescription) {
            metaDescription.remove();
          } else if (originalContent && metaDescription) {
            metaDescription.setAttribute('content', originalContent);
          }
        };
      }, [getNote?.title, getNote?.body]);
  useEffect(() => {
    if (getNote?.body) {
      setContent(JSON.parse(getNote.body));
    }
  }, [getNote]);

  const debouncedUpdateNote = useDebouncedCallback(
    (updatedContent: JSONContent) => {
      updateNote({
        _id: noteid,
        body: JSON.stringify(updatedContent),
      });
    },
    500,
  );

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