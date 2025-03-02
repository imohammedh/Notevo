"use client";
import { Notebook, Plus } from "lucide-react";
import { Button } from "../ui/button";
import MaxWContainer from "../ui/MaxWContainer";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function WorkingSpaceNotFound() {
  const createWorkingSpace = useMutation(
    api.mutations.workingSpaces.createWorkingSpace,
  );
  const [loading, setLoading] = useState(false);

  const handleCreateWorkingSpace = async () => {
    setLoading(true);
    await createWorkingSpace({ name: "Untitled" });
    setLoading(false);
  };
  return (
    <MaxWContainer>
      <div className="w-full text-center py-14">
        <div className="flex flex-col items-center justify-center gap-3">
          <Notebook size="50" />
          <h1 className=" text-3xl font-bold text-center">{`You don't have any working Space `}</h1>
        </div>
        <div className="w-full flex items-center justify-center mt-5">
          <Button
            onClick={handleCreateWorkingSpace}
            className=" flex justify-center items-center gap-1"
          >
            <Plus />
            {loading ? "Creating..." : "Create Working Space"}
          </Button>
        </div>
      </div>
    </MaxWContainer>
  );
}
