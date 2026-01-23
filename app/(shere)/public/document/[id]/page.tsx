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
import { OctagonX, Moon, Sun, Monitor, Slash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { parseSlug } from "@/lib/parseSlug";
import { formatUserNoteTitle } from "@/lib/utils";
export default function PublicNotePage() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [IconImage, setIconImage] = useState<string>("/notevo-logo.svg");

  useEffect(() => {
    if (resolvedTheme !== "dark") {
      setIconImage(NotevoLogo);
    } else {
      setIconImage(DarkNotevoLogo);
    }
  }, [resolvedTheme]);

  const cycleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else if (resolvedTheme === "dark") {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (resolvedTheme === "light") {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    } else if (resolvedTheme == "dark") {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

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

    const originalTitle = document.title;
    document.title = `${getNote.title} - Notevo`;

    let metaDescription = document.querySelector('meta[name="description"]');
    const originalContent = metaDescription?.getAttribute("content");

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
  const PublicNoteTitle = formatUserNoteTitle(
    `${parseSlug(`${getNote.title}`)}`,
  );
  const parsedContent = getNote.body ? JSON.parse(getNote.body) : content;

  return (
    <div className="relative  w-full flex flex-col h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      <header className="fixed top-0 left-0 w-full z-[900] bg-gradient-to-b from-background from-35% via-background/80 via-65% to-transparent to-90%">
        <div className="container mx-auto p-3 flex justify-between items-center w-full">
          <div className="flex justify-start items-center gap-1 w-full ">
            <Button variant="ghost" className=" text-sm px-1.5 py-1.5 h-8">
              <Link
                href="https://notevo.me/"
                target="_blank"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="flex justify-between items-center gap-2 group"
              >
                <Image
                  src={IconImage}
                  alt="Notevo Logo"
                  priority
                  width={18}
                  height={18}
                />
                Get Notevo
              </Link>
            </Button>
            <Button
              disabled
              variant="ghost"
              className=" text-sm px-1.5 py-1.5 h-8"
            >
              <Slash size={16} className=" -ml-2 mr-1 mt-0.5" />
              {PublicNoteTitle}
            </Button>
          </div>
          <div className="flex justify-center items-center gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="gap-1 px-1.5 py-1.5 h-8" variant="Trigger">
                    <OctagonX size={14} />
                    <p className="text-sm">Read only</p>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-sm w-[300px]" side="bottom">
                  You're editing a life copy of the original note, Your changes
                  won't affect the original but you can download your edited
                  copy anytime.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center justify-between">
              <TooltipProvider delayDuration={0} disableHoverableContent>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className=" w-8 h-8 mt-0.5"
                      size="icon"
                      onClick={cycleTheme}
                    >
                      {getThemeIcon()}
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs px-1 py-1" side="bottom">
                    Toggle theme
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </header>
      <MaxWContainer className=" Desktop:container Desktop:mx-auto py-0 Desktop:py-16 tabletAir:py-16 tabletPro:py-16 sm:py-16 flex-1">
        <TailwindAdvancedEditor
          initialContent={parsedContent}
          onUpdate={(editor) => {
            const updatedContent = editor.getJSON();
            setContent(updatedContent);
          }}
        />
      </MaxWContainer>
    </div>
  );
}
