"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import type { Id } from "@/convex/_generated/dataModel";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { FaEllipsis, FaRegTrashCan } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import LoadingAnimation from "../ui/LoadingAnimation";
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

interface WorkingSpaceSettings {
  workingSpaceId: Id<"workingSpaces">;
  className?: string;
  workingspaceName: string | any;
}

export default function WorkingSpaceSettings({
  className,
  workingSpaceId,
  workingspaceName,
}: WorkingSpaceSettings) {
  const [inputValue, setInputValue] = useState(workingspaceName);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input

  useEffect(() => {
    setInputValue(workingspaceName);
  }, [workingspaceName]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 10);
    }
  }, [open]);

  const tables = useQuery(api.mutations.notesTables.getTables, {
    workingSpaceId,
  });

  const notes = useQuery(api.mutations.notes.getNotesByWorkspaceId, {
    workingSpaceId: workingSpaceId,
  });

  const updateWorkingSpace = useMutation(
    api.mutations.workingSpaces.updateWorkingSpace,
  );
  const DeleteWorkingSpace = useMutation(
    api.mutations.workingSpaces.deleteWorkingSpace,
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleBlur();
    }
  };

  const handleBlur = async () => {
    if (inputValue !== workingspaceName) {
      try {
        updateWorkingSpace({ _id: workingSpaceId, name: inputValue });
      } catch (error) {
        console.error("Failed to update workspace name:", error);
        setInputValue(workingspaceName);
      }
    }
    setOpen(false);
  };

  const initiateDelete = () => {
    setOpen(false);
    setIsAlertOpen(true);
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDeleting(true);
    try {
      await DeleteWorkingSpace({ _id: workingSpaceId });
    } catch (error) {
      console.error("Failed to delete workspace:", error);
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(false);
    }
  };

  const tableCount = tables?.length || 0;
  const noteCount = notes?.length || 0;
  const hasContent = tableCount > 0 || noteCount > 0;
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="Trigger" className={cn("px-1.5 h-8", className)}>
            <FaEllipsis size="16" />
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
          <Button
            variant="SidebarMenuButton_destructive"
            className="w-full h-8 px-2 text-sm"
            onClick={initiateDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <LoadingAnimation className="text-destructive/10 animate-spin fill-destructive h-3 w-3" />{" "}
                Deleting...
              </>
            ) : (
              <>
                <FaRegTrashCan size="14" /> Delete
              </>
            )}
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-card border border-border text-card-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Workspace Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {hasContent ? (
                <>
                  This workspace contains:
                  <div className="mt-2 space-y-1">
                    {tableCount > 0 && (
                      <span>
                        <span className="font-medium text-foreground">
                          {tableCount}
                        </span>{" "}
                        table{tableCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    {noteCount > 0 && (
                      <span>
                        <span className="font-medium text-foreground">
                          {noteCount}
                        </span>{" "}
                        note{noteCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    Deleting this workspace will permanently remove all tables,
                    notes, and their data.
                  </div>
                </>
              ) : (
                "Are you sure you want to delete this workspace? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-border hover:bg-accent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-none"
              disabled={isDeleting}
            >
              {isDeleting ? (
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
