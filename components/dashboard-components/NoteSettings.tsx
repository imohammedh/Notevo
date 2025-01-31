"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NoteSettingsProps{
    noteId:string|any
}
export default function NoteSettings({noteId}:NoteSettingsProps) {
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const updateNote = useMutation(api.mutations.notes.updateNote);
    const deleteNote = useMutation(api.mutations.notes.deleteNote);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key) {
            updateNote({ _id: noteId, title: inputValue });
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
            <DropdownMenuContent className="w-56 p-2 space-y-4 text-brand_tertiary/50 bg-brand_fourthary border border-solid border-brand_tertiary/20 rounded-lg">
                <DropdownMenuGroup className="relative">
                    <Input
                        type="text"
                        placeholder="Change u'r note name"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyUp={handleKeyUp}
                    />
                </DropdownMenuGroup>
                <Button
                    variant="SidebarMenuButton"
                    className="w-full"
                    onClick={handleDelete}
                    disabled={isLoading}
                >
                    {isLoading ? "Deleting..." : "Delete Note"}
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
