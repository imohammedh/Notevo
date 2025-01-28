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
import { FaEllipsis } from "react-icons/fa6";
interface WorkingSpaceSettings {
    workingSpaceId: string | any;
}
export default function WorkingSpaceSettings({ workingSpaceId }: WorkingSpaceSettings) {
    const [inputValue, setInputValue] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const UpdateWorkingSpace = useMutation(api.mutations.workingSpaces.updateWorkingSpace);
    const DeleteWorkingSpace = useMutation(api.mutations.workingSpaces.deleteWorkingSpace);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleChangeClick = async () => {
        setIsUpdating(true);
        await UpdateWorkingSpace({ _id: workingSpaceId, name: inputValue });
        setIsUpdating(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        await DeleteWorkingSpace({ _id: workingSpaceId });
        setIsDeleting(false);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="Trigger" className="px-1.5 h-8 mt-0.5 opacity-80">
                    <FaEllipsis size="18" />
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
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Updating..." : "Change"}
                    </Button>
                </DropdownMenuGroup>
                <Button
                    variant="Trigger"
                    className="w-full"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete Working Space"}
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}