"use client";

import {
  Notebook,
  Plus,
  Pin,
  CircleUserRound,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { TbSelector } from "react-icons/tb";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import WorkingSpaceSettings from "./WorkingSpaceSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { useState, useCallback, memo } from "react";
import Link from "next/link";
import SearchDialog from "./SearchDialog";
import LoadingAnimation from "../ui/LoadingAnimation";
import SkeletonTextAnimation from "../ui/SkeletonTextAnimation";
import SkeletonSmImgAnimation from "../ui/SkeletonSmImgAnimation";
import SkeletonTextAndIconAnimation from "../ui/SkeletonTextAndIconAnimation";
import NoteSettings from "./NoteSettings";
import { redirect, usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"; // Import necessary parts of Tooltip
import type { Id } from "@hello-pangea/dnd";
import {
  formatWorkspaceName,
  formatUserName,
  formatUserEmail,
} from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";

// --- Skeleton Sidebar Component ---

const SkeletonSidebar = () => {
  return (
    <Sidebar variant="inset" className="border-brand_tertiary/20 group">
      <SidebarHeader className="bg-brand_fourthary text-brand_tertiary/90 border-b border-brand_tertiary/10">
        <div className=" w-full flex items-center justify-between p-1.5">
          <div className="flex items-center justify-start gap-2">
            <SkeletonTextAnimation className="w-20 h-4 mx-0" />
            <SkeletonTextAnimation className="w-8 h-3 mx-0" />
          </div>
          <SkeletonTextAnimation className="w-full mx-0 h-6" />
        </div>
        <div className="my-1">
          <SkeletonTextAnimation className="w-full mx-0 h-8" />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-brand_fourthary text-brand_tertiary/90 transition-all duration-200 ease-in-out scrollbar-thin scrollbar-thumb-brand_fourthary scrollbar-track-transparent group-hover:scrollbar-thumb-brand_tertiary">
        <SidebarGroup>
          <SidebarGroupLabel className="text-brand_tertiary/50">
            <SkeletonTextAnimation className="w-24 h-3" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SkeletonTextAndIconAnimation text_className="w-full h-5" />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SkeletonTextAndIconAnimation text_className="w-full h-5" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-brand_tertiary/50">
            <SkeletonTextAnimation className="w-24 h-3" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SkeletonTextAndIconAnimation text_className="w-full h-5" />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SkeletonTextAndIconAnimation text_className="w-full h-5" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-brand_fourthary text-brand_tertiary/90">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="my-2">
              <div className="border-none w-full h-15 flex items-center justify-between">
                <SkeletonSmImgAnimation className="h-8 w-8" />
                <div className="flex flex-col items-start justify-center">
                  <SkeletonTextAnimation className="w-28 h-4 mx-0" />
                  <SkeletonTextAnimation className="w-20 h-3 mt-1 mx-0" />
                </div>
                <SkeletonTextAndIconAnimation Icon_className="w-6 h-6" />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

// --- Helper Components (Memoized) ---

interface SidebarHeaderSectionProps {
  getWorkingSpaces: Doc<"workingSpaces">[] | undefined;
  handleCreateNote: (
    workingSpaceId: Id<"workingSpaces">,
    workingSpacesSlug: string,
  ) => Promise<void>;
  handleCreateWorkingSpace: () => Promise<void>;
  loading: boolean; // Loading state for the create note process
}

const SidebarHeaderSection = memo(function SidebarHeaderSection({
  getWorkingSpaces,
  handleCreateNote,
  handleCreateWorkingSpace,
  loading,
}: SidebarHeaderSectionProps) {
  return (
    <SidebarHeader className="bg-brand_fourthary text-brand_tertiary/90 border-b border-brand_tertiary/10">
      <div className="flex items-center justify-between p-1.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-brand_tertiary/90">Notevo</span>
          <Badge
            variant="secondary"
            className="text-[0.6rem] bg-brand_tertiary/5 border-brand_tertiary/20 text-brand_tertiary"
          >
            BETA
          </Badge>
        </div>
        <SidebarTrigger />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="my-1">
          <Button
            className="font-medium w-full h-9 flex justify-between items-center gap-1"
            disabled={loading}
          >
            {!loading ? (
              <>
                Create Note
                <TbSelector size={16} className="font-bold" />
              </>
            ) : (
              <>
                Redirecting...
                <LoadingAnimation className=" h-3 w-3 text-brand_fourthary" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          className="rounded-xl m-2 p-1.5 bg-brand_fourthary/90 backdrop-blur border border-solid border-brand_tertiary/20 w-[--radix-popper-anchor-width]"
        >
          <DropdownMenuLabel className="px-2 py-1 text-sm font-medium opacity-50">
            {getWorkingSpaces?.length
              ? "Select a workspace:"
              : "Create a workspace to add notes:"}
          </DropdownMenuLabel>
          <DropdownMenuGroup className="flex-col">
            {getWorkingSpaces?.length ? (
              getWorkingSpaces.map((workingSpace) => (
                <DropdownMenuItem
                  key={workingSpace._id}
                  className="relative flex-1 px-2 py-1.5 data-[highlighted]:bg-brand_tertiary/10 rounded-lg"
                  onSelect={() =>
                    handleCreateNote(
                      workingSpace._id as any,
                      workingSpace.slug as string,
                    )
                  }
                  disabled={loading}
                >
                  <Notebook size="16" className="mr-2" />
                  <span>{formatWorkspaceName(workingSpace.name)}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <Button
                variant="outline"
                onClick={handleCreateWorkingSpace}
                className="border-dashed h-9 my-2 w-full"
              >
                <p className="text-xs w-full flex justify-center items-center gap-2">
                  <Plus size={16} /> Create Workspace
                </p>
              </Button>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarHeader>
  );
});

interface SidebarNavigationProps {
  isDashboard: boolean;
  isMobile: boolean;
  open: boolean;
}

const SidebarNavigation = memo(function SidebarNavigation({
  isDashboard,
  isMobile,
  open,
}: SidebarNavigationProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-brand_tertiary/50">
        Navigation
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              asChild
              variant="SidebarMenuButton"
              className={`px-2 h-8 group ${isDashboard ? "bg-brand_tertiary/10" : ""}`}
            >
              <Link href="/dashboard">
                <LayoutDashboard size="16" />
                <span>Dashboard</span>
              </Link>
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SearchDialog
              showTitle={true}
              iconSize={16}
              sidbarMobile={isMobile}
              sidebaraOpen={open}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
});

interface PinnedNoteItemProps {
  note: Doc<"notes">;
}

const PinnedNoteItem = memo(function PinnedNoteItem({
  note,
}: PinnedNoteItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleContentMouseEnter = () => {
    setIsTooltipOpen(false);
  };
  return (
    <SidebarGroupContent
      className="relative w-full flex justify-between items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarGroupContent className="flex w-full items-center relative overflow-hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <TooltipProvider>
              <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <TooltipTrigger onMouseLeave={handleContentMouseEnter} asChild>
                  <Button
                    variant="SidebarMenuButton"
                    className="px-2 h-8 group flex-1"
                    asChild
                  >
                    <Link
                      href={`/dashboard/${note.workingSpaceId}/${note.slug}?id=${note._id}`}
                    >
                      <Pin size="16" className="text-purple-500" />
                      {note.title
                        ? formatWorkspaceName(note.title)
                        : "Untitled"}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="rounded-lg bg-brand_fourthary border border-solid border-brand_tertiary/20 text-brand_tertiary text-xs pointer-events-none select-none"
                >
                  {note.title || "Untitled"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
        <NoteSettings
          noteId={note._id}
          noteTitle={note.title}
          IconVariant="horizontal_icon"
          BtnClassName={`absolute right-2 invisible ${isHovered && "visible"}`}
        />
      </SidebarGroupContent>
    </SidebarGroupContent>
  );
});

interface PinnedNotesListProps {
  favoriteNotes: Doc<"notes">[];
}

const PinnedNotesList = memo(function PinnedNotesList({
  favoriteNotes,
}: PinnedNotesListProps) {
  if (favoriteNotes.length === 0) {
    return null; // Don't render the section if there are no pinned notes
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-brand_tertiary/50 flex items-center justify-between">
        <span>Pinned Notes</span>
      </SidebarGroupLabel>
      {favoriteNotes.map((note) => (
        <PinnedNoteItem key={note._id} note={note} />
      ))}
    </SidebarGroup>
  );
});

interface WorkspaceItemProps {
  workingSpace: Doc<"workingSpaces">;
}

const WorkspaceItem = memo(function WorkspaceItem({
  workingSpace,
}: WorkspaceItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleContentMouseEnter = () => {
    setIsTooltipOpen(false);
  };
  return (
    <SidebarGroupContent
      className="relative w-full flex justify-between items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarGroupContent className="flex w-full items-center relative overflow-hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <TooltipProvider>
              <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <TooltipTrigger onMouseLeave={handleContentMouseEnter} asChild>
                  <Button
                    variant="SidebarMenuButton"
                    className="px-2 h-8 group flex-1"
                    asChild
                  >
                    <Link href={`/dashboard/${workingSpace._id}`}>
                      <Notebook size="16" />
                      {formatWorkspaceName(workingSpace.name)}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="rounded-lg bg-brand_fourthary border border-solid border-brand_tertiary/20 text-brand_tertiary text-xs pointer-events-none select-none"
                >
                  {workingSpace.name || "Untitled"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
        <WorkingSpaceSettings
          workingSpaceId={workingSpace._id}
          workingspaceName={workingSpace.name}
          className={`absolute right-2 invisible ${isHovered && "visible"}`}
        />
      </SidebarGroupContent>
    </SidebarGroupContent>
  );
});

interface WorkspacesListProps {
  getWorkingSpaces: Doc<"workingSpaces">[] | undefined;
  handleCreateWorkingSpace: () => Promise<void>;
}

const WorkspacesList = memo(function WorkspacesList({
  getWorkingSpaces,
  handleCreateWorkingSpace,
}: WorkspacesListProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-brand_tertiary/50 flex items-center justify-between">
        <span>Workspaces</span>
      </SidebarGroupLabel>
      <SidebarGroupAction
        title="Add Workspace"
        onClick={handleCreateWorkingSpace}
      >
        <Plus /> <span className="sr-only">Add Workspace</span>
      </SidebarGroupAction>
      {getWorkingSpaces?.length ? (
        getWorkingSpaces.map((workingSpace) => (
          <WorkspaceItem key={workingSpace._id} workingSpace={workingSpace} />
        ))
      ) : (
        <Button
          variant="outline"
          onClick={handleCreateWorkingSpace}
          className="border-dashed h-9 my-2 w-full"
        >
          <p className="text-xs w-full flex justify-center items-center gap-2">
            <Plus size={16} /> Create Workspace
          </p>
        </Button>
      )}
    </SidebarGroup>
  );
});

interface UserAccountSectionProps {
  User: Doc<"users"> | undefined;
  handleSignOut: () => Promise<void>;
  isSigningOut: boolean;
}

const UserAccountSection = memo(function UserAccountSection({
  User,
  handleSignOut,
  isSigningOut,
}: UserAccountSectionProps) {
  return (
    <SidebarFooter className="bg-brand_fourthary text-brand_tertiary/90">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="my-2">
              {isSigningOut ? (
                <Button
                  variant="SidebarMenuButton"
                  className="border-none w-full flex items-center justify-center gap-2"
                  disabled={isSigningOut}
                >
                  <LoadingAnimation />
                  Signing out...
                </Button>
              ) : (
                <Button
                  variant="SidebarMenuButton"
                  className="border-none w-full h-15 flex items-center justify-between"
                  disabled={isSigningOut}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={User?.image || "/placeholder.svg"}
                      className="rounded-full"
                      alt={User ? User.name?.charAt(0) : "..."}
                    />
                    <AvatarFallback className="bg-brand_tertiary/10 text-brand_tertiary">
                      {User?.name ? (
                        User.name.charAt(0)
                      ) : (
                        <SkeletonSmImgAnimation />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-center">
                    <div className="font-medium">
                      {User?.name ? (
                        formatUserName(User.name)
                      ) : (
                        <SkeletonTextAnimation className="w-28 mx-0" />
                      )}
                    </div>
                    <div className="text-xs text-brand_tertiary/60">
                      {formatUserEmail(User?.email)}
                    </div>
                  </div>
                  <TbSelector size={16} />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="rounded-xl m-2 p-1.5 bg-brand_fourthary/90 backdrop-blur border border-solid border-brand_tertiary/20 w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem className="w-full">
                <Button
                  variant="SidebarMenuButton"
                  className="w-full"
                  disabled={true} // Assuming settings link is not yet implemented
                  asChild
                >
                  <Link href="/dashboard/settings/profile">
                    <CircleUserRound size="16" /> Account & Settings
                  </Link>
                </Button>
              </DropdownMenuItem>
              <SidebarSeparator className="opacity-30 my-2" />
              <DropdownMenuItem className="w-full">
                <Button
                  variant="SidebarMenuButton"
                  className="w-full"
                  disabled={isSigningOut}
                  onClick={handleSignOut}
                >
                  {isSigningOut ? (
                    "Signing out..."
                  ) : (
                    <>
                      <LogOut size="16" /> Sign out
                    </>
                  )}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
});

// --- Main Component ---

export default function AppSidebar() {
  const { open, isMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const createWorkingSpace = useMutation(
    api.mutations.workingSpaces.createWorkingSpace,
  );
  const createNote = useMutation(api.mutations.notes.createNote);

  // Query for working spaces and notes - Check if they are undefined for loading
  const getWorkingSpaces = useQuery(
    api.mutations.workingSpaces.getRecentWorkingSpaces,
  );
  const User = useQuery(api.users.viewer);
  const getNotesByUserId = useQuery(api.mutations.notes.getNoteByUserId);

  const { signOut } = useAuthActions();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for the create note process

  const favoriteNotes = getNotesByUserId?.filter((note) => note.favorite) ?? [];
  const isDashboard = pathname === "/dashboard";

  // Determine if the main sidebar content is loading
  const isSidebarLoading =
    getWorkingSpaces === undefined ||
    User === undefined ||
    getNotesByUserId === undefined;

  const handleCreateWorkingSpace = useCallback(async () => {
    try {
      await createWorkingSpace({ name: "Untitled" });
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  }, [createWorkingSpace]);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Changed redirect to router.push for client components
      redirect("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  }, [signOut, router]);

  const handleCreateNote = useCallback(
    async (workingSpaceId: any, workingSpacesSlug: string) => {
      setLoading(true);
      try {
        // Create the note and get its ID
        const newNoteId = await createNote({
          workingSpacesSlug: workingSpacesSlug,
          workingSpaceId: workingSpaceId,
          title: "New Quick Access Notes",
        });

        if (newNoteId) {
          const newNote = getNotesByUserId?.find(
            (note) => note._id === newNoteId,
          );

          if (newNote) {
            // Navigate to the specific note URL
            router.push(
              `/dashboard/${newNote.workingSpaceId}/${newNote.slug}?id=${newNote._id}`,
            );
          } else {
            console.warn(
              "Newly created note not immediately found in getNotesByUserId. Navigating to workspace.",
            );
            // Fallback navigation if the note is not immediately available in the query results
            router.push(`/dashboard/${workingSpaceId}`);
          }
        } else {
          console.error("Failed to get the ID of the newly created note.");
          router.push(`/dashboard/${workingSpaceId}`);
        }
      } catch (error) {
        console.error("Error creating note:", error);
        router.push(`/dashboard/${workingSpaceId}`);
      } finally {
        setLoading(false);
      }
    },
    [createNote, getNotesByUserId, router], // Added getNotesByUserId to dependencies
  );

  if (isSidebarLoading) {
    return <SkeletonSidebar />;
  }

  return (
    <Sidebar variant="inset" className="border-brand_tertiary/20 group">
      {/* Header Section */}
      <SidebarHeaderSection
        getWorkingSpaces={getWorkingSpaces}
        handleCreateNote={handleCreateNote}
        handleCreateWorkingSpace={handleCreateWorkingSpace}
        loading={loading}
      />

      <SidebarContent className="bg-brand_fourthary text-brand_tertiary/90 transition-all duration-200 ease-in-out scrollbar-thin scrollbar-thumb-brand_fourthary scrollbar-track-transparent group-hover:scrollbar-thumb-brand_tertiary">
        {/* Navigation Section */}
        <SidebarNavigation
          isDashboard={isDashboard}
          isMobile={isMobile}
          open={open}
        />

        {/* Pinned Notes Section */}
        <PinnedNotesList favoriteNotes={favoriteNotes} />

        {/* Workspaces Section */}
        <WorkspacesList
          getWorkingSpaces={getWorkingSpaces}
          handleCreateWorkingSpace={handleCreateWorkingSpace}
        />
      </SidebarContent>

      {/* User Account Section */}
      <UserAccountSection
        User={User}
        handleSignOut={handleSignOut}
        isSigningOut={isSigningOut}
      />
    </Sidebar>
  );
}
