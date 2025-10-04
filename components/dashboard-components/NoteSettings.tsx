"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
import { useQuery } from "convex-helpers/react/cache";
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
import {generateSlug} from "@/lib/generateSlug"
interface NoteSettingsProps {
  noteId: Id<"notes">;
  noteTitle: string | any;
  IconVariant: "vertical_icon" | "horizontal_icon";
  BtnClassName?: string;
}

export default function NoteSettings({
  noteId,
  noteTitle,
  IconVariant,
  BtnClassName,
}: NoteSettingsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState(noteTitle);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isFavoritePinLoading, setIsFavoritePinLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const updateNote = useMutation(api.mutations.notes.updateNote);
  const deleteNote = useMutation(api.mutations.notes.deleteNote);
  const getNotes = useQuery(api.mutations.notes.getNoteByUserId);
  const getNote = getNotes?.find((note) => note._id === noteId);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update inputValue when noteTitle changes (when navigating to different notes)
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

  if (!getNotes) {
    return null;
  }

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
    
    if (trimmedValue && trimmedValue !== noteTitle) {
      await updateNote({
        _id: noteId,
        title: trimmedValue,
      });
      
      // Update URL slug
      const newSlug = generateSlug(trimmedValue);
      const pathSegments = pathname.split("/");
      pathSegments[pathSegments.length - 1] = newSlug;
      const newPath = pathSegments.join("/");
      router.push(`${newPath}?id=${noteId}`);
    }
  };

  const initiateDelete = () => {
    setOpen(false);
    setIsAlertOpen(true);
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDeleteLoading(true);
    try {
      await deleteNote({ _id: noteId });
      // Navigate to dashboard after successful deletion
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setIsDeleteLoading(false);
      setIsAlertOpen(false);
    }
  };

  const handleFavoritePin = async () => {
    setIsFavoritePinLoading(true);
    try {
      await updateNote({
        _id: noteId,
        order: getNote?.order,
        favorite: !getNote?.favorite,
      });
    } finally {
      setIsFavoritePinLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="Trigger"
            className={cn("px-0.5 h-8 mt-0.5", BtnClassName)}
          >
            {IconVariant === "vertical_icon" ? (
              <FaEllipsisVertical size={18} />
            ) : (
              <FaEllipsis size={22} />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="start"
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
              Are you sure you want to delete this note? This action cannot be undone.
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