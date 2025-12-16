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
  ChevronDown,
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
import { useQuery } from "@/cache/useQuery";
import { api } from "@/convex/_generated/api";
import { useHotkeys } from "react-hotkeys-hook";
import { usePaginatedQuery } from "convex/react";
import LoadingAnimation from "@/components/ui/LoadingAnimation";
import { extractTextFromTiptap as parseTiptapContentExtractText } from "@/lib/parse-tiptap-content";

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

// Helper to extract and search note body text
const searchInNoteBody = (body: any, query: string): boolean => {
  if (!body) return false;
  try {
    const plainText = parseTiptapContentExtractText(body);
    return plainText?.toLowerCase().includes(query.toLowerCase()) || false;
  } catch (error) {
    return false;
  }
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
  const { results, status, loadMore } = usePaginatedQuery(
    api.notes.getNoteByUserId,
    {},
    { initialNumItems: 15 },
  );

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
    setQuery("");
    router.push(href);
  };

  // Filter notes based on search query (search in title, workspace slug, and body)
  const filteredNotes = results?.filter((note) => {
    const lowerQuery = query.toLowerCase();
    const titleMatch = note.title?.toLowerCase().includes(lowerQuery);
    const workspaceMatch = note.workingSpacesSlug
      ?.toLowerCase()
      .includes(lowerQuery);
    const bodyMatch = searchInNoteBody(note.body, lowerQuery);

    return titleMatch || workspaceMatch || bodyMatch;
  });

  // Group filtered notes by time
  const groupedNotes = filteredNotes ? groupNotesByTime(filteredNotes) : null;
  const hasResultsLoadMore =
    groupedNotes &&
    (groupedNotes.today.length > 15 ||
      groupedNotes.yesterday.length > 15 ||
      groupedNotes.pastWeek.length > 15 ||
      groupedNotes.pastMonth.length > 15 ||
      groupedNotes.older.length > 15);
  const hasResults =
    groupedNotes &&
    (groupedNotes.today.length > 0 ||
      groupedNotes.yesterday.length > 0 ||
      groupedNotes.pastWeek.length > 0 ||
      groupedNotes.pastMonth.length > 0 ||
      groupedNotes.older.length > 0);

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
            className={`flex items-center border-b ${hasResults ? `border-border` : `border-none`} w-full px-3`}
          >
            <CommandInput
              placeholder="Search for notes by title or content..."
              className="h-11 border-none focus:ring-0 focus-visible:ring-0 placeholder:text-muted-foreground"
              value={query}
              onValueChange={setQuery}
            />
          </div>
          <CommandList className="max-h-[60vh] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent overflow-auto p-1">
            {status === "LoadingFirstPage" ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center py-2 px-2">
                    <div className="h-8 w-8 bg-muted rounded-lg mr-2 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                    </div>
                    <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                  {results && results.length === 0 ? (
                    <>
                      <FileText className="mx-auto h-8 w-8 opacity-50 mb-2" />
                      <p>No notes found</p>
                      <p className="text-xs">
                        Create your first note to get started
                      </p>
                    </>
                  ) : (
                    "No results found."
                  )}
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
                                    {new Date(
                                      note.createdAt,
                                    ).toLocaleDateString()}
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
                                    {new Date(
                                      note.createdAt,
                                    ).toLocaleDateString()}
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

                {/* Load More Button */}
                {hasResultsLoadMore && status === "CanLoadMore" && (
                  <div className="px-2 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadMore(5)}
                      className="w-full h-9 text-xs hover:bg-foreground/10"
                    >
                      <ChevronDown size="16" className="mr-2" />
                      Load More Notes
                    </Button>
                  </div>
                )}

                {/* Loading More Indicator */}
                {hasResultsLoadMore && status === "LoadingMore" && (
                  <div className="px-2 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="w-full h-9 text-xs"
                    >
                      <LoadingAnimation className="h-4 w-4 mr-2" />
                      Loading...
                    </Button>
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
        <DialogFooter>
          <span className="inline-flex gap-1">
            <kbd className="pointer-events-none ml-auto inline-flex h-7 select-none items-center gap-1 rounded-md border border-border bg-background px-1.5 font-mono text-xs font-medium text-muted-foreground">
              <ArrowDownUp size={16} /> Select
            </kbd>
            <kbd className="pointer-events-none ml-auto inline-flex h-7 select-none items-center gap-1 rounded-md border border-border bg-background px-1.5 font-mono text-xs font-medium text-muted-foreground">
              <Undo2 size={16} /> open
            </kbd>
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
