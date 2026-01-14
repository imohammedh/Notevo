"use client";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { JSONContent } from "@tiptap/react";
import TailwindAdvancedEditor from "@/components/advanced-editor";
import { useDebouncedCallback } from "use-debounce";
import type { Id } from "@/convex/_generated/dataModel";
import NoteLoadingSkeletonUI from "@/components/ui/NoteLoadingSkeletonUI";
import { Button } from "@/components/ui/button";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTheme } from "next-themes";
import DarkNotevoLogo from "@/public/DarkNotevo-logo.svg";
import NotevoLogo from "@/public/Notevo-logo.svg";
import Image from "next/image";
import Link from "next/link";
import { MessageCircleWarning } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function PublicNotePage() {
  const { resolvedTheme } = useTheme();
  const [IconImage, setIconImage] = useState<string>("/notevo-logo.svg");
  useEffect(() => {
    if (resolvedTheme === "dark") {
      setIconImage(NotevoLogo);
    } else {
      setIconImage(DarkNotevoLogo);
    }
  }, [resolvedTheme]);
  const searchParams = useSearchParams();
  const params = useParams();
  const noteid = params.id as Id<"notes">;
  const getNote = useQuery(api.notes.getNoteById, {
    _id: noteid,
    isPublish: true,
  });
  const noteBody = getNote?.body && JSON.parse(getNote.body);
  const [content, setContent] = useState<JSONContent>(noteBody);

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
    <div className="relative w-full flex flex-col h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      <header className="fixed top-0 left-0 w-full z-[900]  bg-gradient-to-b from-background/95 from-50% via-background/80 via-70% to-transparent">
        <div className=" container mx-auto p-2 flex justify-between items-center w-full">
          <div className="flex justify-start items-center gap-3">
            <Button variant="ghost" className=" gap-2">
              <Link
                href="/"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="flex items-center gap-2 group"
              >
                <Image
                  src={IconImage}
                  alt="Notevo Logo"
                  priority
                  width={25}
                  height={25}
                />
              </Link>
              Notevo
            </Button>
          </div>
          <div className="flex justify-center items-center gap-3">
            <Button className=" gap-2" variant="Trigger">
              <MessageCircleWarning size={14} />
              <p className=" text-sm">Read only</p>
            </Button>

            <div className=" flex items-center justify-between">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <div className=" container mx-auto py-10 flex-1 ">
        <TailwindAdvancedEditor
          initialContent={parsedContent}
          onUpdate={(editor) => {
            const updatedContent = editor.getJSON();
            setContent(updatedContent);
          }}
        />
      </div>
    </div>
  );
}
