import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
interface CreateNoteBtnProps {
  notesTableId: string | any;
  className?: string;
}

export default function CreateNoteBtn({
  notesTableId,
  className,
}: CreateNoteBtnProps) {
  const [loading, setLoading] = useState(false);
  const createNote = useMutation(api.mutations.notes.createNote);

  const handleCreateNote = async () => {
    setLoading(true);
    try {
      await createNote({ notesTableId: notesTableId, title: "Untitled" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={cn(
        " flex items-center justify-between gap-2 h-8 px-2 ",
        className,
      )}
      variant="ghost"
      onClick={handleCreateNote}
      disabled={loading}
    >
      {loading ? (
        "New Note..."
      ) : (
        <>
          <Plus size="20" /> <p className=" hidden sm:block">New Note</p>
        </>
      )}
    </Button>
  );
}
