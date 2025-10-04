"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoadingAnimation from "../ui/LoadingAnimation";
import type { Id } from "@/convex/_generated/dataModel";

interface CreateTableBtnProps {
  workingSpaceId: Id<"workingSpaces">;
  className?: string;
}

export default function CreateTableBtn({
  workingSpaceId,
  className,
}: CreateTableBtnProps) {
  const [loading, setLoading] = useState(false);
  const createTable = useMutation(api.mutations.notesTables.createTable);

  const handleCreateTable = async () => {
    setLoading(true);
    try {
      await createTable({ workingSpaceId: workingSpaceId, name: "Untitled" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={cn(
        "flex items-center justify-between gap-2 border-border text-foreground",
        className,
      )}
      variant="outline"
      onClick={handleCreateTable}
      disabled={loading}
    >
      {loading ? (
        <>
          <LoadingAnimation className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Creating Table...</span>
        </>
      ) : (
        <>
          <Plus size={20} className=" text-muted-foreground" />
          <p className="  text-muted-foreground">Create Table</p>
        </>
      )}
    </Button>
  );
}
