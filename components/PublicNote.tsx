"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  EyeClosed,
  Copy,
  CheckSquare,
  Globe2Icon,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { useQuery } from "@/cache/useQuery";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";
import { generateSlug } from "@/lib/generateSlug";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
interface PublicNoteProp {
  noteId: Id<"notes">;
  noteTitle: string | any;
  BtnClassName?: string;
}
export default function PublicNote({
  noteId,
  noteTitle,
  BtnClassName,
}: PublicNoteProp) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isMobile = useMediaQuery({ maxWidth: 640 });
  const [open, setOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const updateNote = useMutation(api.notes.updateNote).withOptimisticUpdate(
    (local, args) => {
      const { _id, title, body, published } = args;

      // Update single note query
      const note = local.getQuery(api.notes.getNoteById, { _id });
      if (note) {
        local.setQuery(
          api.notes.getNoteById,
          { _id },
          {
            ...note,
            title: title ?? note.title,
            body: body ?? note.body,
            published: published !== undefined ? published : note.published,
            updatedAt: Date.now(),
          },
        );
      }
    },
  );
  const getNote = useQuery(api.notes.getNoteById, { _id: noteId });
  if (!getNote) return null;
  const handlePublished = async () => {
    if (getNote === undefined || getNote === null) {
      return null;
    }

    await updateNote({
      _id: noteId,
      published: !getNote.published,
    });
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://notevo.me/public/document/${noteId}`,
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleTooltipMouseEnter = () => setIsTooltipOpen(true);
  const handleTooltipMouseLeave = () => setIsTooltipOpen(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip open={isTooltipOpen}>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn("h-8 px-2 text-sm mt-0.5 gap-1", BtnClassName)}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
              >
                {getNote?.published ? (
                  <>
                    <EyeClosed size={14} />
                    {!isMobile && "Unpublish"}
                  </>
                ) : (
                  <>
                    <Eye size={14} />
                    {!isMobile && " Publish"}
                  </>
                )}
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <TooltipContent side="bottom" alignOffset={1} align="end">
            Publish your note to the web
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        side="bottom"
        alignOffset={1}
        align="end"
        className="min-w-[20rem] pb-1.5 px-1.5 pt-2 space-y-4 text-muted-foreground z-[10000]"
      >
        <DropdownMenuGroup className="relative">
          {getNote?.published ? (
            <header className=" w-full text-start px-5 pb-2 pt-2 flex flex-col justify-center items-start gap-3">
              <span className=" space-y-2">
                <h1 className=" flex justify-start items-center gap-2 text-base text-primary font-bold">
                  <CheckSquare size={14} className=" text-primary" />
                  Published to the web
                </h1>
                <p className=" text-xs text-muted-foreground">
                  Copy the link and share your notes with the world
                </p>
              </span>
              <span className=" w-full ">
                <p className=" text-xs text-green-600 p-0.5">
                  <span className=" text-base animate-pulse">•</span> This page
                  is live check the link below
                </p>
                <span className="relative">
                  <Input
                    type="text"
                    value={`https://notevo.me/public/document/${noteId}`}
                    className="h-9 truncate flex-grow bg-gradient-to-r from-foreground from-50% via-transparent via-85% to-transparent to-80% text-transparent bg-clip-text"
                    disabled
                  />
                  <TooltipProvider delayDuration={200} disableHoverableContent>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onMouseDown={handleCopy}
                          className={`w-fit h-8 absolute top-1/2 -translate-y-1/2 right-0 ${isCopied && "text-primary hover:text-primary"}`}
                          variant="Trigger"
                        >
                          {isCopied ? (
                            " Copied!"
                          ) : (
                            <Copy size={14} className=" text-primary" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        className="text-xs px-1 py-1"
                        side="bottom"
                      >
                        Copy link
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </span>
              <span className=" w-full flex justify-between items-cente gap-2">
                <Button
                  onMouseDown={handlePublished}
                  className=" w-full h-8 gap-2"
                  variant="outline"
                >
                  <EyeClosed size={14} className=" text-primary" />
                  Unpublish
                </Button>
                <Button className=" w-full h-8 " variant="secondary">
                  <Link
                    target="_blank"
                    className=" flex justify-center items-center gap-2"
                    href={`https://notevo.me/public/document/${noteId}`}
                  >
                    <ExternalLink size={14} />
                    View site
                  </Link>
                </Button>
              </span>
            </header>
          ) : (
            <header className=" w-full text-start px-5 pb-2 pt-2 flex flex-col justify-center items-center gap-6">
              <span className=" space-y-2">
                <h1 className=" flex justify-start items-center gap-2 text-base text-primary font-bold">
                  <Globe2Icon size={14} className=" text-primary" />
                  Publish to the web
                </h1>
                <p className=" text-xs text-muted-foreground">
                  Publish a static webpage of this document, read only
                  <br />
                  and anyone with the link can view or duplicate it.
                </p>
              </span>
              <Button
                onMouseDown={handlePublished}
                className=" w-full h-8 gap-2"
              >
                <Eye size={14} />
                Publish
              </Button>
            </header>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
