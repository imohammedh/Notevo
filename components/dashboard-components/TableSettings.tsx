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

interface TableSettingsProps {
    notesTableId: string | any;
}

export default function TableSettings({ notesTableId }: TableSettingsProps) {
    const [inputValue, setInputValue] = useState("");
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
            <DropdownMenuContent className="w-56 p-2 space-y-4 text-brand_tertiary/50 bg-brand_fourthary border border-solid border-brand_tertiary/20 rounded-lg">
                <DropdownMenuGroup className="relative">
                    <Input
                        type="text"
                        placeholder="Change u'r table name"
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
                    {isLoading ? "Deleting..." : "Delete Table"}
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
