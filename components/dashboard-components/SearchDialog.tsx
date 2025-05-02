"use client";

import React from "react";

import {
  Calendar,
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
          variant={variant}
          size="sm"
          className="px-2 h-8 group outline-none border-none"
        >
          <Search size={iconSize} className="text-brand_tertiary" />
          {showTitle && (
            <div className="w-full flex items-center justify-between gap-1">
              <span className="text-brand_tertiary">Search</span>
              <CommandShortcut className="text-xs opacity-70">
                {sidebaraOpen && sidbarMobile ? "" : "⌘ + K"}
              </CommandShortcut>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden border border-brand_tertiary/20 bg-brand_fourthary shadow-xl shadow-brand_primary md:min-w-[700px]">
        <DialogTitle className="sr-only">Search Notes</DialogTitle>
        <Command className="bg-brand_fourthary">
          <div
            className={`flex items-center border-b ${groupedNotes && groupedNotes.today.length > 0 ? `border-brand_tertiary/20` : `border-none`} w-full px-3`}
          >
            <CommandInput
              placeholder="Search for notes or content..."
              className="h-11 border-none focus:ring-0 focus-visible:ring-0 placeholder:text-brand_tertiary/50"
              value={query}
              onValueChange={setQuery}
            />
          </div>
          <CommandList className="max-h-[80vh] scrollbar-thin scrollbar-thumb-brand_tertiary scrollbar-track-transparent overflow-auto p-1">
            <CommandEmpty className="py-6 text-center text-sm text-brand_tertiary">
              {notes && notes.length === 0 ? null : "No results found."}
            </CommandEmpty>

            {groupedNotes && (
              <>
                {groupedNotes.today.length > 0 && (
                  <CommandGroup heading="Today">
                    {groupedNotes.today.map((note) => (
                      <CommandItem
                        key={note._id}
                        className="flex items-center py-2 px-2"
                        onSelect={() =>
                          handleItemClick(
                            `/dashboard/${note.workingSpaceId}/${note.slug}?id=${note._id}`,
                          )
                        }
                      >
                        <div className="flex w-full items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand_tertiary/20 mr-2">
                            {React.createElement(getNoteIcon(note), {
                              size: 16,
                            })}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-medium truncate">
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
                          className="flex items-center py-2 px-2"
                          onSelect={() =>
                            handleItemClick(
                              `/dashboard/${note.workingSpacesSlug}/${note.slug}?id=${note._id}`,
                            )
                          }
                        >
                          <div className="flex w-full items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand_tertiary/20 mr-2">
                              {React.createElement(getNoteIcon(note), {
                                size: 16,
                              })}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-medium truncate">
                                {note.title || "Untitled"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {note.workingSpacesSlug || "Personal"}
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>Yesterday</span>
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
                          className="flex items-center py-2 px-2"
                          onSelect={() =>
                            handleItemClick(
                              `/dashboard/${note.workingSpacesSlug}/${note.slug}?id=${note._id}`,
                            )
                          }
                        >
                          <div className="flex w-full items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand_tertiary/20 mr-2">
                              {React.createElement(getNoteIcon(note), {
                                size: 16,
                              })}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-medium truncate">
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
                          className="flex items-center py-2 px-2"
                          onSelect={() =>
                            handleItemClick(
                              `/dashboard/${note.workingSpacesSlug}/${note.slug}?id=${note._id}`,
                            )
                          }
                        >
                          <div className="flex w-full items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand_tertiary/20 mr-2">
                              {React.createElement(getNoteIcon(note), {
                                size: 16,
                              })}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-medium truncate">
                                {note.title || "Untitled"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {note.workingSpacesSlug || "Personal"}
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
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
                          className="flex items-center py-2 px-2"
                          onSelect={() =>
                            handleItemClick(
                              `/dashboard/${note.workingSpacesSlug}/${note.slug}?id=${note._id}`,
                            )
                          }
                        >
                          <div className="flex w-full items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand_tertiary/20 mr-2">
                              {React.createElement(getNoteIcon(note), {
                                size: 16,
                              })}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-medium truncate">
                                {note.title || "Untitled"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {note.workingSpacesSlug || "Personal"}
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
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
      </DialogContent>
    </Dialog>
  );
}
