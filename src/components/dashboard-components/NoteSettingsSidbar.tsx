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
} from "@/src/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "@/src/cache/useQuery";
import LoadingAnimation from "../ui/LoadingAnimation";
import { Button } from "@/src/components/ui/button";

import { SquarePen, X, Pin, PinOff } from "lucide-react";
import { cn } from "@/src/lib/utils";

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
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const updateNote = useMutation(api.notes.updateNote);
  const deleteNote = useMutation(api.notes.deleteNote);
  const getNote = useQuery(api.notes.getNoteById, { _id: noteId });

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
      setIsAlertOpen(false);
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
      <TooltipProvider delayDuration={200} skipDelayDuration={0}>
        <div
          className={cn(
            "flex justify-end items-center px-1",
            ContainerClassName,
          )}
        >
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button
                onClick={handleFavoritePin}
                variant="SidebarMenuButton"
                className="px-2 h-7"
                disabled={ishandleFavoritePinLoading}
              >
                {ishandleFavoritePinLoading ? (
                  <LoadingAnimation className="h-4 w-4 text-purple-500" />
                ) : getNote?.favorite ? (
                  <PinOff size={16} className="text-purple-500" />
                ) : (
                  <Pin size={16} className="text-purple-500" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium" sideOffset={5}>
              {getNote?.favorite ? "Unpin note" : "Pin note"}
            </TooltipContent>
          </Tooltip>

          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button
                onMouseDown={initiateDelete}
                variant="SidebarMenuButton_destructive"
                className="px-2 h-7"
              >
                <X size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium" sideOffset={5}>
              Delete note
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

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
