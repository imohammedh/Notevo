"use client";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

interface SearchDialogProps {
  Variant: "SidebarMenuButton" | "Trigger";
  WithTheTitle: boolean;
  IconSize: "16" | "24";
}

export default function SearchDialog({
  Variant,
  WithTheTitle,
  IconSize,
}: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const viwer = useQuery(api.users.viewer);
  const getNotes = useQuery(api.mutations.notes.getNoteByUserId, {
    userid: viwer?._id,
  });

  const handleItemClick = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={Variant} className=" px-2 h-8 group">
          <Search size={IconSize} />
          {WithTheTitle && <span>Search</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className=" p-2 bg-brand_fourthary rounded-xl border-brand_tertiary/10 md:min-w-[450px]">
        <DialogTitle className="sr-only">Search Notes</DialogTitle>
        <Command className=" bg-brand_fourthary">
          <CommandInput placeholder="Search for your note..." />
          <CommandList className="scrollbar-thin scrollbar-thumb-brand_tertiary pr-1 scrollbar-track-brand_fourthary">
            <CommandEmpty className="text-brand_tertiary p-2">
              {getNotes && getNotes?.length !== 0 ? "No results found." : ""}
            </CommandEmpty>
            {getNotes && getNotes?.length !== 0 ? (
              <CommandGroup heading="Suggestions">
                {getNotes.map((note) => (
                  <CommandItem
                    key={note._id}
                    className=" group hover:bg-brand_tertiary/5 aria-selected:bg-brand_tertiary/5"
                  >
                    <Link
                      href={`/dashboard/${note.workingSpacesSlug}/${note.slug}?id=${note._id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleItemClick(
                          `/dashboard/${note.workingSpacesSlug}/${note.slug}?id=${note._id}`,
                        );
                      }}
                      className="w-full h-full flex flex-shrink-0 flex-grow-0 justify-between items-start gap-1"
                    >
                      <h1 className="text-lg font-medium text-nowrap">
                        {note.title
                          ? note.title.length > 20
                            ? `${note.title.substring(0, 20)}...`
                            : note.title
                          : "Untitled"}
                      </h1>
                      <span className="flex justify-center items-center gap-1 transition-all duration-200 ease-in-out opacity-10 group-hover:opacity-80">
                        <Calendar size="16" />
                        <p className=" font-normal text-sm">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </span>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <p className="text-brand_tertiary">{`it looks like you don't have any note's`}</p>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
