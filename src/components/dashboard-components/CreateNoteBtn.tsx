import { api } from "@/convex/_generated/api";
import { cn } from "@/src/lib/utils";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import LoadingAnimation from "../ui/LoadingAnimation";
import type { Id } from "@/convex/_generated/dataModel";

interface CreateNoteBtnProps {
  notesTableId?: Id<"notesTables"> | undefined;
  workingSpacesSlug: string | any;
  workingSpaceId: Id<"workingSpaces"> | any;
  className?: string;
}

export default function CreateNoteBtn({
  notesTableId,
  workingSpacesSlug,
  workingSpaceId,
  className,
}: CreateNoteBtnProps) {
  const [loading, setLoading] = useState(false);
  const createNote = useMutation(api.notes.createNote);

  const handleCreateNote = async () => {
    setLoading(true);
    try {
      await createNote({
        notesTableId: notesTableId as Id<"notesTables"> | undefined,
        workingSpacesSlug: workingSpacesSlug,
        workingSpaceId: workingSpaceId,
        title: "Untitled",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={cn(
        "flex items-center justify-between gap-2 h-9 px-2",
        className,
      )}
      variant="outline"
      onClick={handleCreateNote}
      disabled={loading}
    >
      {loading ? (
        <>
          <LoadingAnimation className="h-3 w-3" />
          <p>New Note...</p>
        </>
      ) : (
        <>
          <Plus size="20" />
          <p>New Note</p>
        </>
      )}
    </Button>
  );
}
