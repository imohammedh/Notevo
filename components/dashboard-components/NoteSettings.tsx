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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NoteSettingsProps {
  noteId: string | any;
}
export default function NoteSettings({ noteId }: NoteSettingsProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const viwer = useQuery(api.users.viewer);

  const updateNote = useMutation(api.mutations.notes.updateNote);
  const deleteNote = useMutation(api.mutations.notes.deleteNote);
  const getNotes = useQuery(api.mutations.notes.getNoteByUserId, {
    userid: viwer?._id,
  });
  const getNote = getNotes?.find((note) => note._id === noteId);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key) {
      updateNote({
        _id: noteId,
        userid: viwer?._id,
        notesTableId: getNote?.notesTableId,
        title: inputValue,
        body: getNote?.body,
        workingSpacesSlug: getNote?.workingSpacesSlug,
        createdAt: getNote?.createdAt,
        order: getNote?.order,
      });
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteNote({ _id: noteId });
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
        side="right"
        align="start"
        className="w-48 p-1.5 space-y-4 text-brand_tertiary/50 bg-brand_fourthary border border-solid border-brand_tertiary/20 rounded-xl"
      >
        <DropdownMenuGroup className="relative">
          <Input
            type="text"
            placeholder="Change u'r note name"
            value={inputValue}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            className=" text-brand_tertiary border-brand_tertiary/20"
          />
        </DropdownMenuGroup>
        <Button
          variant="SidebarMenuButton"
          className="w-full h-9 text-sm"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaRegTrashCan size="14" /> Deleting...
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
