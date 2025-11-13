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
import { FaEllipsisVertical, FaEllipsis, FaRegTrashCan } from "react-icons/fa6";
import { Pin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { useQuery } from "@/cache/useQuery";
import { api } from "@/convex/_generated/api";
import LoadingAnimation from "../ui/LoadingAnimation";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { generateSlug } from "@/lib/generateSlug";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NoteSettingsProps {
  noteId: Id<"notes">;
  noteTitle: string | any;
  IconVariant: "vertical_icon" | "horizontal_icon";
  BtnClassName?: string;
  DropdownMenuContentAlign: "end" | "start";
  TooltipContentAlign: "end" | "start";
}

export default function NoteSettings({
  noteId,
  noteTitle,
  IconVariant,
  BtnClassName,
  DropdownMenuContentAlign,
  TooltipContentAlign,
}: NoteSettingsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(noteTitle);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isFavoritePinLoading, setIsFavoritePinLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const updateNote = useMutation(api.mutations.notes.updateNote);
  const deleteNote = useMutation(api.mutations.notes.deleteNote);
  const getNote = useQuery(api.mutations.notes.getNoteById, { _id: noteId });
  const inputRef = useRef<HTMLInputElement>(null);

  const currentNoteId = searchParams.get("id");
  const isViewingThisNote = currentNoteId === noteId;

  useEffect(() => {
    setInputValue(noteTitle);
  }, [noteTitle]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 10);
    }
  }, [open]);

  if (!getNote) return null;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleBlur();
      setOpen(false);
    }
  };

  const handleBlur = async () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && trimmedValue !== noteTitle && getNote) {
      await updateNote({ _id: noteId, title: trimmedValue });

      if (isViewingThisNote) {
        const newSlug = generateSlug(trimmedValue);
        const pathSegments = pathname.split("/");
        pathSegments[pathSegments.length - 1] = newSlug;
        const newPath = pathSegments.join("/");
        router.replace(`${newPath}?id=${noteId}`);
      }
    }
  };

  const initiateDelete = () => {
    setOpen(false);
    setIsAlertOpen(true);
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!getNote) return;

    setIsDeleteLoading(true);
    try {
      await deleteNote({ _id: noteId });
      if (isViewingThisNote) {
        router.push(`/dashboard/${getNote.workingSpaceId}`);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setIsDeleteLoading(false);
      setIsAlertOpen(false);
    }
  };

  const handleFavoritePin = async () => {
    if (!getNote) return;

    setIsFavoritePinLoading(true);
    try {
      await updateNote({
        _id: noteId,
        favorite: !getNote.favorite,
      });
    } finally {
      setIsFavoritePinLoading(false);
    }
  };

  const handleTooltipMouseEnter = () => setIsTooltipOpen(true);
  const handleTooltipMouseLeave = () => setIsTooltipOpen(false);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip open={isTooltipOpen}>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant="Trigger"
                  className={cn("px-0.5 h-8 mt-0.5", BtnClassName)}
                  onMouseEnter={handleTooltipMouseEnter}
                  onMouseLeave={handleTooltipMouseLeave}
                >
                  {IconVariant === "vertical_icon" ? (
                    <FaEllipsisVertical size={18} />
                  ) : (
                    <FaEllipsis size={22} />
                  )}
                </Button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
            <TooltipContent side="bottom" align={TooltipContentAlign}>
              Rename, Pin, Delete
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent
          side="bottom"
          align={DropdownMenuContentAlign}
          alignOffset={1}
          className="w-48 p-1.5 space-y-4 text-muted-foreground bg-card border border-border rounded-xl"
        >
          <DropdownMenuGroup className="relative">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="text-foreground border-border"
              ref={inputRef}
            />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <Button
              variant="SidebarMenuButton"
              className="w-full h-8 px-2 text-sm"
              onClick={handleFavoritePin}
              disabled={isFavoritePinLoading}
            >
              {isFavoritePinLoading ? (
                <>
                  <LoadingAnimation className="h-3 w-3" />
                  {getNote?.favorite ? "Unpinning..." : "Pinning..."}
                </>
              ) : (
                <>
                  <Pin size={14} />
                  {getNote?.favorite ? "Unpin Note" : "Pin Note"}
                </>
              )}
            </Button>
            <Button
              variant="SidebarMenuButton_destructive"
              className="w-full h-8 px-2 text-sm"
              onClick={initiateDelete}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <>
                  <LoadingAnimation className="text-destructive/10 animate-spin fill-destructive h-3 w-3" />
                  Deleting...
                </>
              ) : (
                <>
                  <FaRegTrashCan size={14} />
                  Delete
                </>
              )}
            </Button>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-card border border-border text-card-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Note Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this note? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-border hover:bg-accent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-none"
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <>
                  <LoadingAnimation className="h-3 w-3 mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
