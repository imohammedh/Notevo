"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface CreateTableBtnProps {
  workingSpaceId: string | any;
  className?: string;
}

export default function CreateTableBtn({ workingSpaceId, className }: CreateTableBtnProps) {
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
      className={cn("flex items-center justify-between gap-2", className)}
      onClick={handleCreateTable}
      disabled={loading}
    >
      {loading ? "Create Table..." : <><Plus size="20" /> <p className="hidden sm:block">Create Table</p></>}
    </Button>
  );
}
