import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import LoadingAnimation from "../ui/LoadingAnimation";
interface CreateNoteBtnProps {
  notesTableId: string | any;
  workingSpacesSlug: string | any;
  className?: string;
}

export default function CreateNoteBtn({
  notesTableId,
  workingSpacesSlug,
  className,
}: CreateNoteBtnProps) {
  const [loading, setLoading] = useState(false);
  const createNote = useMutation(api.mutations.notes.createNote);

  const handleCreateNote = async () => {
    setLoading(true);
    try {
      await createNote({
        notesTableId: notesTableId,
        workingSpacesSlug: workingSpacesSlug,
        title: "Untitled",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={cn(
        " flex items-center justify-between gap-2 h-9 px-2 ",
        className,
      )}
      variant="outline"
      onClick={handleCreateNote}
      disabled={loading}
    >
      {loading ? (
        <>
          <LoadingAnimation className=" h-3 w-3" />
          <p className=" hidden sm:block">New Note...</p>
        </>
      ) : (
        <>
          <Plus size="20" /> <p className=" hidden sm:block">New Note</p>
        </>
      )}
    </Button>
  );
}
