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
    if (getNote?.title) {
      // Update document title
      document.title = `${getNote.title} - Notevo`;

      // Update meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", `${getNote.title}'s Notevo`);
      } else {
        // Create meta description if it doesn't exist
        const newMeta = document.createElement("meta");
        newMeta.name = "description";
        newMeta.content = `${getNote.title}'s Notevo`;
        document.head.appendChild(newMeta);
      }
    }
  }, [getNote?.title]);
  useEffect(() => {
    if (getNote?.body) {
      setContent(JSON.parse(getNote.body));
    }
  }, [getNote]);

  const debouncedUpdateNote = useDebouncedCallback(
    (updatedContent: JSONContent) => {
      updateNote({
        _id: noteid,
        title: getNote?.title,
        body: JSON.stringify(updatedContent),
        order: getNote?.order,
        favorite: getNote?.favorite,
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
