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
    const createTable = useMutation(api.mutations.notesTables.updateTable);
    const deleteTable = useMutation(api.mutations.notesTables.deleteTable);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleChangeClick = async () => {
        setIsLoading(true);
        await createTable({ _id: notesTableId, name: inputValue });
        setIsLoading(false);
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
                        placeholder="Untitled"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <Button
                        variant="Trigger"
                        className="opacity-50 absolute top-1 right-1 h-7 px-1"
                        onClick={handleChangeClick}
                        disabled={isLoading}
                    >
                        {isLoading ? "Changing..." : "Change"}
                    </Button>
                </DropdownMenuGroup>
                <Button
                    variant="Trigger"
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
