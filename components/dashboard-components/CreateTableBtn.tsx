"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useMutation, insertAtTop } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface CreateTableBtnProps {
  workingSpaceId: Id<"workingSpaces">;
  className?: string;
}

export default function CreateTableBtn({
  workingSpaceId,
  className,
}: CreateTableBtnProps) {
  const createTable = useMutation(
    api.notesTables.createTable,
  ).withOptimisticUpdate((local, args) => {
    const { workingSpaceId: wsId, name } = args;
    if (wsId !== workingSpaceId) return;

    const now = Date.now();
    const uuid = crypto.randomUUID();
    const tempId = `${uuid}-${now}` as Id<"notesTables">;

    // Update the getTables query
    const currentTables = local.getQuery(api.notesTables.getTables, {
      workingSpaceId: wsId,
    });
    if (currentTables !== undefined) {
      local.setQuery(api.notesTables.getTables, { workingSpaceId: wsId }, [
        {
          _id: tempId,
          _creationTime: now,
          name: name || "Untitled",
          workingSpaceId: wsId,
          slug: "untitled",
          createdAt: now,
          updatedAt: now,
        },
        ...currentTables,
      ]);
    }
  });

  const handleCreateTable = async () => {
    await createTable({ workingSpaceId: workingSpaceId, name: "Untitled" });
  };

  return (
    <Button
      className={cn("flex items-center justify-between gap-2 ", className)}
      variant="default"
      onClick={handleCreateTable}
    >
      <Plus size={20} />
      <p className="hidden sm:block ">Create Table</p>
    </Button>
  );
}
