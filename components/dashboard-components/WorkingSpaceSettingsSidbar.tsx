import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "@/cache/useQuery";
import { useMutation } from "convex/react";
import { useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LoadingAnimation from "../ui/LoadingAnimation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Settings, Users, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface WorkingSpaceSettingsSidbarProps {
  workingSpaceId: Id<"workingSpaces">;
  ContainerClassName?: string;
  workingspaceName: string | any;
}

export default function WorkingSpaceSettingsSidbar({
  workingSpaceId,
  ContainerClassName,
  workingspaceName,
}: WorkingSpaceSettingsSidbarProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const router = useRouter();
  const workspaceHref = `/dashboard/${workingSpaceId}`;
  const PathName = usePathname()
  const tables = useQuery(api.mutations.notesTables.getTables, {
    workingSpaceId,
  });

  const notes = useQuery(api.mutations.notes.getNotesByWorkspaceId, {
    workingSpaceId: workingSpaceId,
  });
  const DeleteWorkingSpace = useMutation(
    api.mutations.workingSpaces.deleteWorkingSpace,
  );

  const initiateDelete = () => {
    setIsAlertOpen(true);
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDeleting(true);
    try {
      if (PathName === workspaceHref) {
        router.push(`/dashboard`);
        await new Promise((resolve) => setTimeout(resolve, 400));
        await DeleteWorkingSpace({ _id: workingSpaceId });
      } else {
        await DeleteWorkingSpace({ _id: workingSpaceId });
      }
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
                onMouseDown={initiateDelete}
                variant="SidebarMenuButton_destructive"
                className="px-2 h-7"
              >
                <X size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium" sideOffset={5}>
              Delete workspace
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

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