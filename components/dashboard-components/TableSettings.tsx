"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEllipsisVertical, FaRegTrashCan } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
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
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TableSettingsProps {
  notesTableId: Id<"notesTables"> | any; // Strongly typed Id
  tableName: string | any;
}

export default function TableSettings({
  notesTableId,
  tableName,
}: TableSettingsProps) {
  const [inputValue, setInputValue] = useState(tableName);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert Dialog State
  const inputRef = useRef<HTMLInputElement>(null);
  const updateTable = useMutation(api.mutations.notesTables.updateTable);
  const deleteTable = useMutation(api.mutations.notesTables.deleteTable);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
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
    }
  };

  const handleBlur = () => {
    updateTable({ _id: notesTableId, name: inputValue });
    setOpen(false);
  };

  const initiateDelete = () => {
    setOpen(false); // Close the dropdown
    setIsAlertOpen(true); // Open the alert dialog
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await deleteTable({ _id: notesTableId });
    } finally {
      setIsLoading(false);
      setIsAlertOpen(false); // Close Alert after deletion
    }
  };
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleTooltipMouseEnter = () => {
    setIsTooltipOpen(true);
  };

  const handleTooltipMouseLeave = () => {
    setIsTooltipOpen(false);
  };
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip open={isTooltipOpen}>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant="Trigger"
                  className="px-0.5 h-8 mt-0.5 opacity-80"
                  onMouseEnter={handleTooltipMouseEnter}
                  onMouseLeave={handleTooltipMouseLeave}
                >
                  <FaEllipsisVertical size="18" />
                </Button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
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
                  ref={inputRef}
                />
              </DropdownMenuGroup>
              <Button
                variant="SidebarMenuButton_destructive"
                className="w-full h-8 px-2 text-sm"
                onClick={initiateDelete}
                disabled={isLoading}
              >
                {isLoading ? (
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
            </DropdownMenuContent>
            <TooltipContent
              side="bottom"
              className="rounded-lg bg-brand_fourthary border border-solid border-brand_tertiary/20 text-brand_tertiary text-xs pointer-events-none select-none"
            >
              Rename , Delete
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-brand_fourthary border border-solid border-brand_tertiary/20 text-brand_tertiary">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Table Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-brand_tertiary/70">
              "Are you sure you want to delete this table? This action cannot be
              undone."
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-solid border-brand_tertiary/20 hover:bg-brand_tertiary/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-900 hover:bg-red-600 border-none text-brand_tertiary"
              disabled={isLoading}
            >
              {isLoading ? (
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
