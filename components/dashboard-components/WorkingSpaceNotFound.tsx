"use client";
import { Notebook, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import LoadingAnimation from "../ui/LoadingAnimation";
import { Card, CardContent } from "../ui/card";

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
        <div className="flex flex-col items-center justify-center py-8">
          <Notebook className="h-10 w-10 text-brand_tertiary/40" />
          <h3 className="text-lg font-medium mb-2">No workspaces yet</h3>
          <p className="text-brand_tertiary/70 mb-4">
            Create your first workspace to start organizing your notes and
            ideas.
          </p>
          <Button
            onClick={handleCreateWorkingSpace}
            className="flex items-center gap-2"
            variant="outline"
            disabled={loading}
          >
            {loading ? <LoadingAnimation /> : <Plus className="h-4 w-4" />}
            {loading ? "Creating..." : "Create Workspace"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
