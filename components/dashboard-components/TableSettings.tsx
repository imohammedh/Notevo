"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEllipsisVertical, FaRegTrashCan } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoadingAnimation from "../ui/LoadingAnimation";

interface TableSettingsProps {
  notesTableId: string | any;
  tableName: string | any;
}

export default function TableSettings({
  notesTableId,
  tableName,
}: TableSettingsProps) {
  const [inputValue, setInputValue] = useState(tableName);
  const [isLoading, setIsLoading] = useState(false);
  const updateTable = useMutation(api.mutations.notesTables.updateTable);
  const deleteTable = useMutation(api.mutations.notesTables.deleteTable);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key) {
      updateTable({ _id: notesTableId, name: inputValue });
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteTable({ _id: notesTableId });
    setIsLoading(false);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="Trigger" className="px-0.5 h-8 mt-0.5 opacity-80">
          <FaEllipsisVertical size="18" />
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
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingAnimation className=" h-3 w-3" /> Deleting...
            </>
          ) : (
            <>
              <FaRegTrashCan size="14" />
              Delete
            </>
          )}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
