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
import { useState, useCallback } from "react";
import Link from "next/link";
import SearchDialog from "./SearchDialog";
import LoadingAnimation from "../ui/LoadingAnimation";
import SkeletonTextAnimation from "../ui/SkeletonTextAnimation";
import SkeletonSmImgAnimation from "../ui/SkeletonSmImgAnimation";
import SkeletonTextAndIconAnimation from "../ui/SkeletonTextAndIconAnimation";
import NoteSettings from "./NoteSettings";
import { redirect, usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@heroui/tooltip";
import type { Id } from "@hello-pangea/dnd";
import {
  formatWorkspaceName,
  formatUserName,
  formatUserEmail,
} from "@/lib/utils";
export default function AppSidebar() {
  const { open, isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const createWorkingSpace = useMutation(
    api.mutations.workingSpaces.createWorkingSpace,
  );
  const createNote = useMutation(api.mutations.notes.createNote);
  const getWorkingSpaces = useQuery(
    api.mutations.workingSpaces.getRecentWorkingSpaces,
  );
  const User = useQuery(api.users.viewer);
  const getNotesByUserId = useQuery(api.mutations.notes.getNoteByUserId);
  // Auth Actions
  const { signOut } = useAuthActions();

  // State Management
  const [hoveredWorkingSpaceId, setHoveredWorkingSpaceId] = useState<
    string | null
  >(null);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [loading, setLoading] = useState(false);
  // Memoized Values
  const favoriteNotes = getNotesByUserId?.filter((note) => note.favorite) ?? [];
  const isDashboard = pathname === "/dashboard";

  // Handlers
  const handleCreateWorkingSpace = useCallback(async () => {
    try {
      await createWorkingSpace({ name: "Untitled" });
    } catch (error) {
      console.error("Error creating workspace:", error); // Log errors
    }
  }, [createWorkingSpace]);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      redirect("/");
    } catch (error) {
      console.error("Error signing out:", error); // Log errors
    } finally {
      setIsSigningOut(false);
    }
  }, [signOut]);

  const handleCreateNote = useCallback(
    async (workingSpaceId: any, workingSpacesSlug: any) => {
      setLoading(true);
      try {
        await createNote({
          workingSpacesSlug: workingSpacesSlug,
          workingSpaceId: workingSpaceId,
          title: "New Quick Access Notes",
        });
      } finally {
        router.push(`/dashboard/${workingSpaceId}`);
        setLoading(false);
      }
    },
    [],
  );

  return (
    <Sidebar variant="inset" className="border-brand_tertiary/20 group">
      <SidebarHeader className="bg-brand_fourthary text-brand_tertiary/90 border-b border-brand_tertiary/10">
        <div className="flex items-center justify-between p-1.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-brand_tertiary/90">Notevo</span>
            <Badge
              variant="secondary"
              className="text-[0.6rem]  bg-brand_tertiary/5 border-brand_tertiary/20 text-brand_tertiary"
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
                      handleCreateNote(workingSpace._id, workingSpace.slug)
                    }
                    disabled={loading}
                  >
                    <Notebook size="16" className="mr-2" />
                    <span>{formatWorkspaceName(workingSpace.name)}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCreateWorkingSpace}
                    className="border-dashed h-9 my-2 w-full"
                  >
                    <p className="text-xs w-full flex justify-center items-center gap-2">
                      <Plus size={16} /> Create Workspace
                    </p>
                  </Button>
                </>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent className="bg-brand_fourthary text-brand_tertiary/90 transition-all duration-200 ease-in-out scrollbar-thin scrollbar-thumb-brand_fourthary scrollbar-track-transparent group-hover:scrollbar-thumb-brand_tertiary">
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
        {favoriteNotes.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-brand_tertiary/50 flex items-center justify-between">
              <span>Pinned Notes</span>
            </SidebarGroupLabel>
            {favoriteNotes.map((note) => (
              <SidebarGroupContent
                className="relative w-full flex justify-between items-center"
                key={note._id}
                onMouseEnter={() => setHoveredNoteId(note._id)}
                onMouseLeave={() => setHoveredNoteId(null)}
              >
                <div className="flex w-full items-center relative">
                  <Tooltip
                    delay={1000}
                    closeDelay={0}
                    placement="bottom"
                    className="rounded-lg bg-brand_fourthary border border-solid border-brand_tertiary/20 text-brand_tertiary text-xs pointer-events-none select-none"
                    content={note.title || "Untitled"}
                  >
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
                  </Tooltip>
                  <NoteSettings
                    noteId={note._id}
                    noteTitle={note.title}
                    IconVariant="horizontal_icon"
                    BtnClassName={`absolute right-2 transition-opacity duration-200 ${hoveredNoteId === note._id ? "opacity-100" : "opacity-0"}`}
                    Tooltip_placement="right"
                  />
                </div>
              </SidebarGroupContent>
            ))}
          </SidebarGroup>
        )}
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
              <SidebarGroupContent
                className="relative w-full flex justify-between items-center"
                key={workingSpace._id}
                onMouseEnter={() => setHoveredWorkingSpaceId(workingSpace._id)}
                onMouseLeave={() => setHoveredWorkingSpaceId(null)}
              >
                <div className="flex w-full items-center relative">
                  <Tooltip
                    delay={1000}
                    closeDelay={0}
                    placement="bottom"
                    className="rounded-lg bg-brand_fourthary border border-solid border-brand_tertiary/20 text-brand_tertiary text-xs pointer-events-none select-none"
                    content={workingSpace.name || "Untitled"}
                  >
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
                  </Tooltip>
                  <WorkingSpaceSettings
                    className={`absolute right-2 transition-opacity duration-200 ${hoveredWorkingSpaceId === workingSpace._id ? "opacity-100" : "opacity-0"}`}
                    workingSpaceId={workingSpace._id}
                    workingspaceName={workingSpace.name}
                    Tooltip_placement="right"
                  />
                </div>
              </SidebarGroupContent>
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
      </SidebarContent>
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
                          <SkeletonTextAnimation className="w-28" />
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
                    disabled={true}
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
    </Sidebar>
  );
}
