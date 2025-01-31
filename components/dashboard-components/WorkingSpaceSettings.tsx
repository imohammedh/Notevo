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
import { cn } from "@/lib/utils";
interface WorkingSpaceSettings {
    workingSpaceId: string | any;
    className?:string
}
export default function WorkingSpaceSettings({ className,workingSpaceId }: WorkingSpaceSettings) {
    const [inputValue, setInputValue] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const updateWorkingSpace = useMutation(api.mutations.workingSpaces.updateWorkingSpace);
    const DeleteWorkingSpace = useMutation(api.mutations.workingSpaces.deleteWorkingSpace);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };
    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if (event.key) {
            updateWorkingSpace({ _id: workingSpaceId, name: inputValue });
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        await DeleteWorkingSpace({ _id: workingSpaceId });
        setIsDeleting(false);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="Trigger" className={cn("px-1.5 h-8 opacity-80",className)}>
                    <FaEllipsis size="16" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 space-y-4 text-brand_tertiary/50 bg-brand_fourthary border border-solid border-brand_tertiary/20 rounded-lg">
                <DropdownMenuGroup className="relative">
                    <Input
                        type="text"
                        placeholder="Untitled"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyUp={handleKeyUp}
                    />
                </DropdownMenuGroup>
                <Button
                    variant="SidebarMenuButton"
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