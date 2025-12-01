"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { FileText, Plus, Table } from "lucide-react";
import LoadingAnimation from "../ui/LoadingAnimation";

interface TablesNotFoundProps {
  workingSpaceId: Id<"workingSpaces">;
}

export default function TablesNotFound({
  workingSpaceId,
}: TablesNotFoundProps) {
  const createTable = useMutation(api.notesTables.createTable);
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
    <div className="flex my-10 flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Table className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No tables found
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first table to start organizing your data.
        </p>
        <Button
          className="mt-4 gap-1"
          onClick={handleCreateTable}
          disabled={loading}
        >
          {loading ? (
            <LoadingAnimation className=" w-4 h-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Create Table
        </Button>
      </div>
    </div>
  );
}
