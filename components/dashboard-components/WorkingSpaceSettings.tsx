"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FaEllipsis, FaRegTrashCan } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Tooltip } from "@heroui/tooltip";
import LoadingAnimation from "../ui/LoadingAnimation";
interface WorkingSpaceSettings {
  workingSpaceId: string | any;
  className?: string;
  workingspaceName: string | any;
}
export default function WorkingSpaceSettings({
  className,
  workingSpaceId,
  workingspaceName,
}: WorkingSpaceSettings) {
  const [inputValue, setInputValue] = useState(workingspaceName);
  const [isDeleting, setIsDeleting] = useState(false);
  const updateWorkingSpace = useMutation(
    api.mutations.workingSpaces.updateWorkingSpace,
  );
  const DeleteWorkingSpace = useMutation(
    api.mutations.workingSpaces.deleteWorkingSpace,
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key) {
      updateWorkingSpace({ _id: workingSpaceId, name: inputValue });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await DeleteWorkingSpace({ _id: workingSpaceId });
    setIsDeleting(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="Trigger"
          className={cn("px-1.5 h-8 opacity-80", className)}
        >
          <FaEllipsis size="16" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-48 p-1.5 space-y-4 text-brand_tertiary/50 bg-brand_fourthary border border-solid border-brand_tertiary/20 rounded-xl"
      >
        <DropdownMenuGroup className="relative">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            className=" text-brand_tertiary border-brand_tertiary/20"
          />
        </DropdownMenuGroup>
        <Button
          variant="SidebarMenuButton"
          className="w-full h-8 px-2 text-sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <LoadingAnimation className=" h-3 w-3" /> Deleting...
            </>
          ) : (
            <>
              <FaRegTrashCan size="14" /> Delete
            </>
          )}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
