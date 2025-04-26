"use client";
import {
  Notebook,
  Plus,
  Pin,
  CircleUserRound,
  CreditCard,
  LogOut,
  Settings,
  LayoutDashboard,
  Star,
  Clock,
  FileText,
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import WorkingSpaceSettings from "./WorkingSpaceSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import SearchDialog from "./SearchDialog";
import LoadingAnimation from "../ui/LoadingAnimation";
import SkeletonTextAnimation from "../ui/SkeletonTextAnimation";
import SkeletonSmImgAnimation from "../ui/SkeletonSmImgAnimation";
import SkeletonTextAndIconAnimation from "../ui/SkeletonTextAndIconAnimation";
import NoteSettings from "./NoteSettings";
import { redirect, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function AppSidebar() {
  const { open, isMobile, setOpenMobile } = useSidebar();

  const pathname = usePathname();
  const createWorkingSpace = useMutation(
    api.mutations.workingSpaces.createWorkingSpace,
  );
  const getWorkingSpaces = useQuery(
    api.mutations.workingSpaces.getWorkingSpaces,
  );
  const User = useQuery(api.users.viewer);
  const { signOut } = useAuthActions();
  const [hoveredWorkingSpaceId, setHoveredWorkingSpaceId] = useState<
    string | null
  >(null);
  const [HoveredNoteId, setHoveredNoteId] = useState<string | null>(null);

  // Query to fetch all notes by user ID
  const getNotesByUserId = useQuery(api.mutations.notes.getNoteByUserId);

  // Filter notes to get only the favorite ones
  const favoriteNotes = getNotesByUserId?.filter((note) => note.favorite);

  const handleCreateWorkingSpace = () => {
    createWorkingSpace({ name: "Untitled" });
  };
  const [loading, setLoading] = useState(false);
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      redirect("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Check if the current path is the dashboard
  const isDashboard = pathname === "/dashboard";

  // Function to close sidebar when navigating in mobile view
  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(true);
    }
  };

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
                  onClick={handleNavClick}
                >
                  <Link href="/dashboard" onClick={handleNavClick}>
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

        {favoriteNotes?.length !== 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-brand_tertiary/50 flex items-center justify-between">
              <span>Pinned Notes</span>
              {favoriteNotes && (
                <Badge
                  variant="secondary"
                  className="text-[0.6rem] h-5 text-brand_tertiary bg-brand_tertiary/5 border-brand_tertiary/20"
                >
                  {favoriteNotes.length}
                </Badge>
              )}
            </SidebarGroupLabel>
            {favoriteNotes ? (
              favoriteNotes.map((note) => (
                <SidebarGroupContent
                  className="relative w-full flex justify-between items-center"
                  key={note._id}
                  onMouseEnter={() => setHoveredNoteId(note._id)}
                  onMouseLeave={() => setHoveredNoteId(null)}
                >
                  <div className="flex w-full items-center relative">
                    <Button
                      variant="SidebarMenuButton"
                      className="px-2 h-8 group flex-1"
                      asChild
                      onClick={handleNavClick}
                    >
                      <Link
                        href={`/dashboard/${note.workingSpaceId}/${note.slug}?id=${note._id}`}
                      >
                        <Pin size="16" className="text-amber-400" />
                        {note.title
                          ? note.title.length > 20
                            ? `${note.title.substring(0, 20)}...`
                            : note.title
                          : "Untitled"}
                      </Link>
                    </Button>
                    <NoteSettings
                      noteId={note._id}
                      noteTitle={note.title}
                      IconVariant="horizontal_icon"
                      BtnClassName={`absolute right-2 transition-opacity duration-200 ${
                        HoveredNoteId === note._id ? "opacity-100" : "opacity-0"
                      }`}
                      Tooltip_placement="right"
                    />
                  </div>
                </SidebarGroupContent>
              ))
            ) : (
              <div>
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index}>
                    <SkeletonTextAndIconAnimation />
                  </div>
                ))}
              </div>
            )}
            <SidebarGroupContent />
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
          {getWorkingSpaces?.length !== 0 ? (
            getWorkingSpaces?.map((workingSpace) => (
              <SidebarGroupContent
                className="relative w-full flex justify-between items-center"
                key={workingSpace._id}
                onMouseEnter={() => setHoveredWorkingSpaceId(workingSpace._id)}
                onMouseLeave={() => setHoveredWorkingSpaceId(null)}
              >
                <div className="flex w-full items-center relative">
                  <Button
                    variant="SidebarMenuButton"
                    className="px-2 h-8 group flex-1"
                    asChild
                    onClick={handleNavClick}
                  >
                    <Link href={`/dashboard/${workingSpace._id}`}>
                      <Notebook size="16" />
                      {workingSpace.name.length > 20
                        ? `${workingSpace.name.substring(0, 20)}...`
                        : workingSpace.name}
                    </Link>
                  </Button>
                  <WorkingSpaceSettings
                    className={`absolute right-2 transition-opacity duration-200 ${
                      hoveredWorkingSpaceId === workingSpace._id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
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
          <SidebarGroupContent />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-brand_fourthary text-brand_tertiary/90">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="my-2">
                {loading === false ? (
                  <Button
                    variant="SidebarMenuButton"
                    className="border-none w-full h-15 flex items-center justify-between"
                    disabled={loading}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={User?.image || "/placeholder.svg"}
                        className="rounded-full"
                        alt={User ? User.name?.charAt(0) : `...`}
                      />
                      <AvatarFallback className="bg-brand_tertiary/10 text-brand_tertiary">
                        {User ? (
                          User.name?.charAt(0)
                        ) : (
                          <SkeletonSmImgAnimation />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-center">
                      <div className="font-medium">
                        {User?.name ? (
                          `${User.name.split(" ")[0].length > 10 ? `${User.name.split(" ")[0].substring(0, 10)}...` : User.name.split(" ")[0]}${User.name.split(" ")[1] ? ` ${User.name.split(" ")[1].charAt(0)}.` : "."}`
                        ) : (
                          <SkeletonTextAnimation className="w-28" />
                        )}
                      </div>
                      <div className="text-xs text-brand_tertiary/60">
                        {User?.email
                          ? User.email.replace(/(.{3}).*?(@.{3}).*/, "$1...$2")
                          : ""}
                      </div>
                    </div>
                    <TbSelector size={16} />
                  </Button>
                ) : (
                  <Button
                    variant="SidebarMenuButton"
                    className="border-none w-full flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <LoadingAnimation />
                    Signing out...
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
                    disabled={loading}
                    onClick={handleSignOut}
                  >
                    {loading ? (
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
