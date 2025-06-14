"use client";
import { Notebook, Plus, FolderX } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import LoadingAnimation from "../ui/LoadingAnimation";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

export default function WorkingSpaceNotFound() {
  const createWorkingSpace = useMutation(
    api.mutations.workingSpaces.createWorkingSpace,
  );
  const [loading, setLoading] = useState(false);

  const handleCreateWorkingSpace = async () => {
    setLoading(true);
    try {
      await createWorkingSpace({ name: "Untitled" });
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-brand_fourthary/30 border-brand_tertiary/20">
      <CardContent className="pt-6 text-center">
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FolderX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Workspace not found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The workspace you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
