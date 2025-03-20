"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEllipsisVertical, FaEllipsis, FaRegTrashCan } from "react-icons/fa6";
import { Pin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoadingAnimation from "../ui/LoadingAnimation";
import { cn } from "@/lib/utils";
interface NoteSettingsProps {
  noteId: string | any;
  noteTitle: string | any;
  IconVariant: "vertical_icon" | "horizontal_icon";
  BtnClassName?: string | any;
}
export default function NoteSettings({
  noteId,
  noteTitle,
  IconVariant,
  BtnClassName,
}: NoteSettingsProps) {
  const [inputValue, setInputValue] = useState(noteTitle);
  const [ishandleDeleteLoading, setIshandleDeleteLoading] = useState(false);
  const [ishandleFavoritePinLoading, setIshandleFavoritePinLoading] =
    useState(false);
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
        favorite: getNote?.favorite,
      });
    }
  };

  const handleDelete = async () => {
    setIshandleDeleteLoading(true);
    await deleteNote({ _id: noteId });
    setIshandleDeleteLoading(false);
  };
  const handleFavoritePin = async () => {
    setIshandleFavoritePinLoading(true);
    await updateNote({
      _id: noteId,
      userid: viwer?._id,
      notesTableId: getNote?.notesTableId,
      title: inputValue,
      body: getNote?.body,
      workingSpacesSlug: getNote?.workingSpacesSlug,
      createdAt: getNote?.createdAt,
      order: getNote?.order,
      favorite: !getNote?.favorite,
    });
    setIshandleFavoritePinLoading(false);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="Trigger"
          className={cn("px-0.5 h-8 mt-0.5 opacity-80", BtnClassName)}
        >
          {IconVariant === "vertical_icon" ? (
            <FaEllipsisVertical size="18" />
          ) : (
            <FaEllipsis size="16" />
          )}
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
        <DropdownMenuGroup>
          <Button
            variant="SidebarMenuButton"
            className="w-full h-8 px-2 text-sm"
            onClick={handleFavoritePin}
            disabled={ishandleFavoritePinLoading}
          >
            {ishandleFavoritePinLoading ? (
              <>
                <LoadingAnimation className=" h-3 w-3" />{" "}
                {getNote?.favorite ? "Unpinning..." : "Pinning..."}
              </>
            ) : (
              <>
                <Pin size="14" />
                {getNote?.favorite ? "Unpin Note" : "Pin Note"}
              </>
            )}
          </Button>
          <Button
            variant="SidebarMenuButton"
            className="w-full h-8 px-2 text-sm"
            onClick={handleDelete}
            disabled={ishandleDeleteLoading}
          >
            {ishandleDeleteLoading ? (
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
