"use client";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { JSONContent } from "@tiptap/react";
import TailwindAdvancedEditor from "@/components/advanced-editor";
import { useDebouncedCallback } from "use-debounce";
import type { Id } from "@/convex/_generated/dataModel";
import NoteLoadingSkeletonUI from "@/components/ui/NoteLoadingSkeletonUI";
import { useNoteWidth } from "@/hooks/useNoteWidth";
export default function NotePage() {
  const searchParams = useSearchParams();
  const noteid = searchParams.get("id") as Id<"notes">;
  const { noteWidth } = useNoteWidth();

  const updateNote = useMutation(api.notes.updateNote).withOptimisticUpdate(
    (local, args) => {
      const { _id, body } = args;

      // Update single note query (for the current note being edited)
      const note = local.getQuery(api.notes.getNoteById, { _id });
      if (note) {
        local.setQuery(
          api.notes.getNoteById,
          { _id },
          {
            ...note,
            body: body ?? note.body,
            updatedAt: Date.now(),
          },
        );
      }
    },
  );
  const getNote = useQuery(
    api.notes.getNoteById,
    noteid ? { _id: noteid } : "skip",
  );
  const [content, setContent] = useState<JSONContent>();

  const debouncedUpdateNote = useDebouncedCallback(
    (updatedContent: JSONContent) => {
      updateNote({
        _id: noteid,
        body: JSON.stringify(updatedContent),
      });
    },
    500,
  );

  useEffect(() => {
    if (getNote?.body) {
      setContent(JSON.parse(getNote.body));
    }
  }, [getNote]);

  useEffect(() => {
    if (!getNote?.title) return;

    // Store original values
    const originalTitle = document.title;

    // Update document title
    document.title = `${getNote.title} - Notevo`;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    const originalContent = metaDescription?.getAttribute("content");

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
        metaDescription.setAttribute("content", originalContent);
      }
    };
  }, [getNote?.title, getNote?.body]);

  if (getNote === undefined) {
    return <NoteLoadingSkeletonUI />;
  }

  if (getNote === null) {
    return <p>Note not found!</p>;
  }

  const parsedContent = getNote.body ? JSON.parse(getNote.body) : content;
  return (
    <div className={noteWidth === "false" ? "container" : "px-4"}>
      <TailwindAdvancedEditor
        initialContent={parsedContent}
        onUpdate={(editor) => {
          const updatedContent = editor.getJSON();
          setContent(updatedContent);
          debouncedUpdateNote(updatedContent);
        }}
      />
    </div>
  );
}
