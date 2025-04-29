"use client";
import { useState, useRef, useEffect } from "react";
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
import { Tooltip } from "@heroui/tooltip";
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

interface NoteSettingsProps {
  noteId: Id<"notes"> | any; // Strongly typed Id
  noteTitle: string | any;
  IconVariant: "vertical_icon" | "horizontal_icon";
  BtnClassName?: string | any;
  Tooltip_className?: string;
  Tooltip_content?: string;
  Tooltip_placement?:
    | "top"
    | "bottom"
    | "right"
    | "left"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
}
export default function NoteSettings({
  noteId,
  noteTitle,
  IconVariant,
  BtnClassName,
  Tooltip_className,
  Tooltip_content,
  Tooltip_placement,
}: NoteSettingsProps) {
  const [inputValue, setInputValue] = useState(noteTitle);
  const [ishandleDeleteLoading, setIshandleDeleteLoading] = useState(false);
  const [ishandleFavoritePinLoading, setIshandleFavoritePinLoading] =
    useState(false);
  const [open, setOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert dialog state

  const updateNote = useMutation(api.mutations.notes.updateNote);
  const deleteNote = useMutation(api.mutations.notes.deleteNote);
  const getNotes = useQuery(api.mutations.notes.getNoteByUserId);
  const getNote = getNotes?.find((note) => note._id === noteId);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // slight delay to ensure the dropdown is rendered
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select(); // Select all text
      }, 10);
    }
  }, [open]);

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

  const handleBlur = () => {
    updateNote({
      _id: noteId,
      title: inputValue,
      body: getNote?.body,
      order: getNote?.order,
      favorite: getNote?.favorite,
    });
  };

  const initiateDelete = () => {
    setOpen(false); // Close the dropdown
    setIsAlertOpen(true); // Open the alert dialog
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIshandleDeleteLoading(true);
    try {
      await deleteNote({ _id: noteId });
    } finally {
      setIshandleDeleteLoading(false);
      setIsAlertOpen(false); // Close the alert dialog after deletion
    }
  };

  const handleFavoritePin = async () => {
    setIshandleFavoritePinLoading(true);
    await updateNote({
      _id: noteId,
      title: inputValue,
      body: getNote?.body,
      order: getNote?.order,
      favorite: !getNote?.favorite,
    });
    setIshandleFavoritePinLoading(false);
  };
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Tooltip
          delay={1000}
          closeDelay={0}
          className={cn(
            " rounded-lg bg-brand_fourthary border border-solid border-brand_tertiary/20 text-brand_tertiary text-xs",
            Tooltip_className,
          )}
          content={!Tooltip_content ? "Delete ,rename ,unpin" : Tooltip_content}
          placement={!Tooltip_placement ? "left" : Tooltip_placement}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="Trigger"
              className={cn("px-0.5 h-8 mt-0.5 opacity-80", BtnClassName)}
            >
              {IconVariant === "vertical_icon" ? (
                <FaEllipsisVertical size="18" />
              ) : (
                <FaEllipsis size="16" />
              )}
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent
          side="bottom"
          align="start"
          className="w-48 p-1.5 space-y-4 text-brand_tertiary/50 bg-brand_fourthary border border-solid border-brand_tertiary/20 rounded-xl"
        >
          <DropdownMenuGroup className="relative">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className=" text-brand_tertiary border-brand_tertiary/20"
              ref={inputRef} // Attach the ref to the Input
            />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <Button
              variant="SidebarMenuButton"
              className="w-full h-8 px-2 text-sm"
              onClick={handleFavoritePin}
              disabled={ishandleFavoritePinLoading}
            >
              {ishandleFavoritePinLoading ? (
                <>
                  <LoadingAnimation className=" h-3 w-3" />{" "}
                  {getNote?.favorite ? "Unpinning..." : "Pinning..."}
                </>
              ) : (
                <>
                  <Pin size="14" />
                  {getNote?.favorite ? "Unpin Note" : "Pin Note"}
                </>
              )}
            </Button>
            <Button
              variant="SidebarMenuButton_destructive"
              className="w-full h-8 px-2 text-sm"
              onClick={initiateDelete}
              disabled={ishandleDeleteLoading}
            >
              {ishandleDeleteLoading ? (
                <>
                  <LoadingAnimation className="text-red-600/10 animate-spin fill-red-600 h-3 w-3" />{" "}
                  Deleting...
                </>
              ) : (
                <>
                  <FaRegTrashCan size="14" />
                  Delete
                </>
              )}
            </Button>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-brand_fourthary border border-solid border-brand_tertiary/20 text-brand_tertiary">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Note Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-brand_tertiary/70">
              {`Are you sure you want to delete this note? This action cannot be
              undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-solid border-brand_tertiary/20 hover:bg-brand_tertiary/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-900 hover:bg-red-600 border-none text-brand_tertiary"
              disabled={ishandleDeleteLoading}
            >
              {ishandleDeleteLoading ? (
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
