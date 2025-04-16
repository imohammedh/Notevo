"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { FileText, Plus } from "lucide-react";
import LoadingAnimation from "../ui/LoadingAnimation";

interface TablesNotFoundProps {
  workingSpaceId: Id<"workingSpaces">;
}

export default function TablesNotFound({
  workingSpaceId,
}: TablesNotFoundProps) {
  const createTable = useMutation(api.mutations.notesTables.createTable);
  const [loading, setLoading] = useState(false);

  const handleCreateTable = async () => {
    setLoading(true);
    try {
      await createTable({
        name: "New Table",
        workingSpaceId: workingSpaceId,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-brand_tertiary/5 flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-brand_tertiary/40" />
      </div>
      <h2 className="text-xl font-medium mb-2">No tables found</h2>
      <p className="text-brand_tertiary/70 max-w-md mb-6">
        Create your first table to start organizing your notes in this
        workspace.
      </p>
      <Button
        onClick={handleCreateTable}
        disabled={loading}
        variant="outline"
        className="flex items-center gap-2"
      >
        {loading ? <LoadingAnimation /> : <Plus className="h-4 w-4" />}
        Create First Table
      </Button>
    </div>
  );
}
