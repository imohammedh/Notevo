"use client";

import React from "react";

import {
  Calendar,
  ArrowDownUp,
  Undo2,
  Clock,
  Code,
  FileText,
  Inbox,
  Search,
  Settings,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
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
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { useHotkeys } from "react-hotkeys-hook";

interface SearchDialogProps {
  variant?: "default" | "SidebarMenuButton";
  showTitle?: boolean;
  iconSize?: number;
  sidebaraOpen?: boolean;
  sidbarMobile?: boolean;
}

// Helper function to get icon based on note type or category
const getNoteIcon = (note: any) => {
  const typeMap: Record<string, any> = {
    document: FileText,
    code: Code,
    inbox: Inbox,
    starred: Star,
    settings: Settings,
  };

  return typeMap[note.type] || FileText;
};

// Helper to format relative time
const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};

// Group notes by time period
const groupNotesByTime = (notes: any[]) => {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setDate(lastMonth.getDate() - 30);

  return {
    today: notes.filter((note) => new Date(note.createdAt) >= today),
    yesterday: notes.filter(
      (note) =>
        new Date(note.createdAt) >= yesterday &&
        new Date(note.createdAt) < today,
    ),
    pastWeek: notes.filter(
      (note) =>
        new Date(note.createdAt) >= lastWeek &&
        new Date(note.createdAt) < yesterday,
    ),
    pastMonth: notes.filter(
      (note) =>
        new Date(note.createdAt) >= lastMonth &&
        new Date(note.createdAt) < lastWeek,
    ),
    older: notes.filter((note) => new Date(note.createdAt) < lastMonth),
  };
};

export default function SearchDialog({
  variant = "SidebarMenuButton",
  showTitle = false,
  iconSize = 16,
  sidebaraOpen,
  sidbarMobile,
}: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const notes = useQuery(api.mutations.notes.getNoteByUserId);

  useHotkeys(
    "ctrl+k",
    (e: KeyboardEvent) => {
      e.preventDefault();
      setOpen(true);
    },
    [open],
  );

  const handleItemClick = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  // Filter notes based on search query
  const filteredNotes = notes?.filter(
    (note) =>
      note.title?.toLowerCase().includes(query.toLowerCase()) ||
      note.workingSpacesSlug?.toLowerCase().includes(query.toLowerCase()),
  );

  // Group filtered notes by time
  const groupedNotes = filteredNotes ? groupNotesByTime(filteredNotes) : null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="SidebarMenuButton"
          size="sm"
          className="px-2 h-8 group outline-none border-none"
        >
          <Search size={iconSize} />
          {showTitle && (
            <div className="w-full flex items-center justify-between gap-1">
              Search
              <span className="inline-flex gap-1">
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">Ctrl</span>
              </kbd>
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">K</span>
              </kbd>
              </span>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-2 overflow-hidden border border-border bg-accent shadow-xl shadow-border/10 md:min-w-[800px]">
        <DialogTitle className="sr-only">Search Notes</DialogTitle>
        <Command className="bg-background">
          <div
            className={`flex items-center border-b ${groupedNotes && groupedNotes.today.length > 0 ? `border-border` : `border-none`} w-full px-3`}
          >
            <CommandInput
              placeholder="Search for notes or content..."
              className="h-11 border-none focus:ring-0 focus-visible:ring-0 placeholder:text-muted-foreground"
              value={query}
              onValueChange={setQuery}
            />
          </div>
          <CommandList className="max-h-[80vh] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent overflow-auto p-1">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              {notes && notes.length === 0 ? null : "No results found."}
            </CommandEmpty>

            {groupedNotes && (
              <>
                {groupedNotes.today.length > 0 && (
                  <CommandGroup heading="Today">
                    {groupedNotes.today.map((note) => (
                      <CommandItem
                        key={note._id}
                        className="flex items-center py-2 px-2 group"
                        onSelect={() =>
                          handleItemClick(
                            `/dashboard/${note.workingSpaceId}/${note.slug}?id=${note._id}`,
                          )
                        }
                      >
                        <div className="flex w-full items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border mr-2">
                            {React.createElement(getNoteIcon(note), {
                              size: 16,
                            })}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-medium truncate text-foreground">
                              {note.title || "Untitled"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {note.workingSpacesSlug || "Personal"}
                            </p>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>
                              {getRelativeTime(new Date(note.createdAt))}
                            </span>
                            <Undo2 className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {groupedNotes.yesterday.length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Yesterday">
                      {groupedNotes.yesterday.map((note) => (
                        <CommandItem
                          key={note._id}
                          className="flex items-center py-2 px-2 group"
                          onSelect={() =>
                            handleItemClick(
                              `/dashboard/${note.workingSpaceId}/${note.slug}?id=${note._id}`,
                            )
                          }
                        >
                          <div className="flex w-full items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border mr-2">
                              {React.createElement(getNoteIcon(note), {
                                size: 16,
                              })}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-medium truncate text-foreground">
                                {note.title || "Untitled"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {note.workingSpacesSlug || "Personal"}
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>Yesterday</span>
                              <Undo2 className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}

                {groupedNotes.pastWeek.length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Past Week">
                      {groupedNotes.pastWeek.map((note) => (
                        <CommandItem
                          key={note._id}
                          className="flex items-center py-2 px-2 group"
                          onSelect={() =>
                            handleItemClick(
                              `/dashboard/${note.workingSpaceId}/${note.slug}?id=${note._id}`,
                            )
                          }
                        >
                          <div className="flex w-full items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border mr-2">
                              {React.createElement(getNoteIcon(note), {
                                size: 16,
                              })}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-medium truncate text-foreground">
                                {note.title || "Untitled"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {note.workingSpacesSlug || "Personal"}
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>
                                {getRelativeTime(new Date(note.createdAt))}
                              </span>
                              <Undo2 className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}

                {groupedNotes.pastMonth.length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Past 30 Days">
                      {groupedNotes.pastMonth.map((note) => (
                        <CommandItem
                          key={note._id}
                          className="flex items-center py-2 px-2 group"
                          onSelect={() =>
                            handleItemClick(
                              `/dashboard/${note.workingSpaceId}/${note.slug}?id=${note._id}`,
                            )
                          }
                        >
                          <div className="flex w-full items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border mr-2">
                              {React.createElement(getNoteIcon(note), {
                                size: 16,
                              })}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-medium truncate text-foreground">
                                {note.title || "Untitled"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {note.workingSpacesSlug || "Personal"}
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                              <Undo2 className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}

                {groupedNotes.older.length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Older">
                      {groupedNotes.older.map((note) => (
                        <CommandItem
                          key={note._id}
                          className="flex items-center py-2 px-2 group"
                          onSelect={() =>
                            handleItemClick(
                              `/dashboard/${note.workingSpaceId}/${note.slug}?id=${note._id}`,
                            )
                          }
                        >
                          <div className="flex w-full items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border mr-2">
                              {React.createElement(getNoteIcon(note), {
                                size: 16,
                              })}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-medium truncate text-foreground">
                                {note.title || "Untitled"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {note.workingSpacesSlug || "Personal"}
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                              <Undo2 className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </>
            )}

            {!notes || notes.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <FileText className="mx-auto h-8 w-8 opacity-50 mb-2" />
                <p>No notes found</p>
                <p className="text-xs">Create your first note to get started</p>
              </div>
            ) : null}
          </CommandList>
        </Command>
        <DialogFooter >
        <span className="inline-flex gap-1">
          <kbd className="pointer-events-none ml-auto inline-flex h-7 select-none items-center gap-1 rounded-md border border-border bg-background px-1.5 font-mono text-xs font-medium text-muted-foreground">
            <ArrowDownUp size={16}/> Select
          </kbd>
          <kbd className="pointer-events-none ml-auto inline-flex h-7 select-none items-center gap-1 rounded-md border border-border bg-background px-1.5 font-mono text-xs font-medium text-muted-foreground">
            <Undo2 size={16}/>  open
          </kbd>
        </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
