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
import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex-helpers/react/cache";
import LoadingAnimation from "../ui/LoadingAnimation";
import { Button } from "@/components/ui/button";

import { SquarePen, X, Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
interface NoteSettingsSidbarProps {
  noteId: Id<"notes"> | any;
  noteTitle: string | any;
  ContainerClassName?: string | any;
}
export default function NoteSettingsSidbar({
  noteId,
  noteTitle,
  ContainerClassName,
}: NoteSettingsSidbarProps) {
  const [ishandleDeleteLoading, setIshandleDeleteLoading] = useState(false);
  const [ishandleFavoritePinLoading, setIshandleFavoritePinLoading] =
    useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert dialog state
  const updateNote = useMutation(api.mutations.notes.updateNote);
  const deleteNote = useMutation(api.mutations.notes.deleteNote);
  const getNotes = useQuery(api.mutations.notes.getNoteByUserId);
  const getNote = getNotes?.find((note) => note._id === noteId);

  const initiateDelete = () => {
    setIsAlertOpen(true);
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
      favorite: !getNote?.favorite,
    });
    setIshandleFavoritePinLoading(false);
  };

  return (
    <>
      <div
        className={cn(
          "flex justify-end items-center px-1",
          ContainerClassName,
        )}
      >
        <Button
          onClick={handleFavoritePin}
          variant="SidebarMenuButton"
          className=" px-2 h-7"
        >
          <PinOff size={16} className="text-purple-500"/>
        </Button>
        <Button
          onMouseDown={initiateDelete}
          variant="SidebarMenuButton_destructive"
          className=" px-2 h-7"
        >
          <X size={16} />
        </Button>
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-card border border-border text-card-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Note Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {`Are you sure you want to delete this note? This action cannot be
              undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-border hover:bg-accent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-none"
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
