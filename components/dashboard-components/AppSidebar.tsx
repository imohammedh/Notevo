"use client";
import {
  Notebook,
  Home,
  Plus,
  Search,
  CircleUserRound,
  CreditCard,
  LogOut,
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
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect, useRouter } from "next/navigation";
import WorkingSpaceSettings from "./WorkingSpaceSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import SearchDialog from "./SearchDialog";
import LoadingAnimation from "../ui/LoadingAnimation";
export default function AppSidebar() {
  const createWorkingSpace = useMutation(
    api.mutations.workingSpaces.createWorkingSpace,
  );
  const getWorkingSpaces = useQuery(
    api.mutations.workingSpaces.getWorkingSpaces,
  );
  const User = useQuery(api.users.viewer);
  const router = useRouter();
  const { signOut } = useAuthActions();
  const [hoveredWorkingSpaceId, setHoveredWorkingSpaceId] = useState<
    string | null
  >(null);

  const handleCreateWorkingSpace = () => {
    createWorkingSpace({ name: "Untitled" });
  };
  const handlePush = (slug: string, workingSpaceid: any) => {
    router.push(`/dashboard/${slug}?id=${workingSpaceid}`);
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

  return (
    <Sidebar className=" border-brand_tertiary/20">
      <SidebarContent className="bg-brand_fourthary text-brand_tertiary/90 transition-all duration-200 ease-in-out scrollbar-thin scrollbar-thumb-brand_fourthary scrollbar-track-brand_fourthary hover:scrollbar-thumb-brand_tertiary/20">
        <SidebarGroup>
          <SidebarGroupLabel className=" text-brand_tertiary/50">
            Notevo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  asChild
                  variant="SidebarMenuButton"
                  className=" px-2 h-8 group"
                >
                  <Link href="/dashboard">
                    <Home size="16" />
                    <span>Home</span>
                  </Link>
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SearchDialog
                  Variant="SidebarMenuButton"
                  WithTheTitle={true}
                  IconSize="16"
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className=" text-brand_tertiary/50">
            Your WorkingSpacs
          </SidebarGroupLabel>
          <SidebarGroupAction
            title="Add Project"
            onClick={handleCreateWorkingSpace}
          >
            <Plus /> <span className="sr-only">Add WorkingSpacs</span>
          </SidebarGroupAction>
          {getWorkingSpaces?.map((workingSpace) => (
            <SidebarGroupContent
              className="relative w-full flex justify-between items-center"
              key={workingSpace._id}
              onMouseEnter={() => setHoveredWorkingSpaceId(workingSpace._id)}
              onMouseLeave={() => setHoveredWorkingSpaceId(null)}
            >
              <Button
                variant="SidebarMenuButton"
                className=" px-2 h-8 group"
                onClick={() =>
                  workingSpace.slug &&
                  handlePush(workingSpace.slug, workingSpace._id)
                }
              >
                <Notebook size="16" />
                {workingSpace.name.length > 20
                  ? `${workingSpace.name.substring(0, 20)}...`
                  : workingSpace.name}
                <WorkingSpaceSettings
                  className={`absolute top-0 right-0 transition-opacity duration-200 ${hoveredWorkingSpaceId === workingSpace._id ? "opacity-100" : "opacity-0"}`}
                  workingSpaceId={workingSpace._id}
                />
              </Button>
            </SidebarGroupContent>
          ))}
          <SidebarGroupContent />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className=" bg-brand_fourthary text-brand_tertiary/90">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className=" py-8">
                {loading === false ? (
                  <Button
                    variant="SidebarMenuButton"
                    className=" border-none w-full flex items-center justify-between"
                    disabled={loading}
                  >
                    <Avatar className="max-w-10 max-h-10 flex items-center justify-center">
                      <AvatarImage
                        src={User?.image}
                        alt={User ? User.name?.charAt(0) : `...`}
                      />
                      <AvatarFallback>
                        {User ? User.name?.charAt(0) : <LoadingAnimation />}
                      </AvatarFallback>
                    </Avatar>
                    <p className=" flex flex-col items-start justify-center">
                      <span>
                        {User?.name
                          ? `${User.name.split(" ")[0].length > 10 ? `${User.name.split(" ")[0].substring(0, 10)}...` : User.name.split(" ")[0]}${User.name.split(" ")[1] ? ` ${User.name.split(" ")[1].charAt(0)}.` : "."}`
                          : "..."}
                      </span>
                      <span>
                        {User?.email && User.email.length > 6
                          ? User.email.replace(/(.{3})(.*)(@.{3})/, "$1...$3")
                          : "..."}
                      </span>
                    </p>
                    <TbSelector className=" text-xl" />
                  </Button>
                ) : (
                  <Button
                    variant="SidebarMenuButton"
                    className=" border-none w-full flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <LoadingAnimation />
                    Signing out...
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className=" rounded-lg m-2 p-2 bg-brand_fourthary/70 backdrop-blur border border-solid border-brand_tertiary/20 w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className=" w-full">
                  <Button
                    variant="SidebarMenuButton"
                    className=" w-full"
                    disabled={true}
                  >
                    <CircleUserRound size="16" /> Account
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem className=" w-full">
                  <Button
                    variant="SidebarMenuButton"
                    className=" w-full"
                    disabled={true}
                  >
                    <CreditCard size="16" /> Billing
                  </Button>
                </DropdownMenuItem>
                <SidebarSeparator className=" opacity-30 my-2" />
                <DropdownMenuItem className=" w-full">
                  <Button
                    variant="SidebarMenuButton"
                    className=" w-full"
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
