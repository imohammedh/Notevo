"use client";
import { Notebook, Home, Plus, Search } from "lucide-react"
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
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect, useRouter } from "next/navigation";
import WorkingSpaceSettings from "./WorkingSpaceSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
]

export default function AppSidebar() {
  const createWorkingSpace = useMutation(api.mutations.workingSpaces.createWorkingSpace);
  const getWorkingSpaces = useQuery(api.mutations.workingSpaces.getWorkingSpaces);
  const User = useQuery(api.users.viewer);
  const router = useRouter();
  const { signOut } = useAuthActions();
  const [hoveredWorkingSpaceId, setHoveredWorkingSpaceId] = useState<string | null>(null);

  const handleCreateWorkingSpace =() => {
    createWorkingSpace({ name: "Untitled" });
  }
  const handlePush = (slug: string,workingSpaceid:any) => {
    router.push(`/dashboard/${slug}?id=${workingSpaceid}`);
  }
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      redirect("/")
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sidebar className=" border-brand_tertiary/20">
      <SidebarContent className=" bg-brand_fourthary text-brand_tertiary/90">
        <SidebarGroup>
          <SidebarGroupLabel className=" text-brand_tertiary/50">Notevo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Button asChild
                    variant="SidebarMenuButton"
                    className=" px-2 h-8 group" 
                  >
                    <a href={item.url}>
                      <item.icon size="16" />
                      <span>{item.title}</span>
                    </a>
                  </Button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className=" text-brand_tertiary/50">Your WorkingSpacs</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project" onClick={handleCreateWorkingSpace}>
          <Plus /> <span className="sr-only">Add WorkingSpacs</span>
          </SidebarGroupAction>
          {
            getWorkingSpaces?.map((workingSpace) => (
              <SidebarGroupContent 
                className="relative w-full flex justify-between items-center" 
                key={workingSpace._id}
                onMouseEnter={() => setHoveredWorkingSpaceId(workingSpace._id)}
                onMouseLeave={() => setHoveredWorkingSpaceId(null)}
              >
                  <Button 
                    variant="SidebarMenuButton"
                    className=" px-2 h-8 group" 
                    onClick={() => workingSpace.slug && handlePush(workingSpace.slug, workingSpace._id)}
                  >
                    <Notebook size="16"/>{workingSpace.name}
                    <WorkingSpaceSettings 
                      className={`absolute top-0 right-0 transition-opacity duration-200 ${hoveredWorkingSpaceId === workingSpace._id ? 'opacity-100' : 'opacity-0'}`}
                      workingSpaceId={workingSpace._id} 
                    />
                  </Button>
              </SidebarGroupContent>
            ))
          }
          <SidebarGroupContent />
        </SidebarGroup>
      </SidebarContent>
        <SidebarFooter className=" bg-brand_fourthary text-brand_tertiary/90">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className=" py-8">
                  <Button variant="SidebarMenuButton" className=" border-none w-full flex items-center justify-between">
                      <Avatar className="rounded-lg max-w-10 max-h-10 flex items-center justify-center border border-solid border-brand_tertiary/20">
                        <AvatarImage src={User?.image} alt={User?User.name?.charAt(0):"user not found".charAt(0)} />
                        <AvatarFallback>{User?User.name?.charAt(0):"user not found".charAt(0)}</AvatarFallback>
                      </Avatar>
                      <p className=" flex flex-col items-start justify-center">
                        <span>{User?User.name:"user not found"}</span>
                        <span>{User?User.email?.replace(/(.{3}).*(@.{3}).*/, "$1...$2"):"user not found"}</span>
                      </p>
                    <TbSelector className=" text-xl" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="left"
                  className=" rounded-lg m-2 p-2 bg-brand_fourthary/70 backdrop-blur border border-solid border-brand_tertiary/20 w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem className=" w-full">
                    <Button variant="Trigger" className=" w-full" disabled={true}>Account</Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className=" w-full">
                    <Button variant="Trigger" className=" w-full" disabled={true}>Billing</Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className=" w-full">
                    <Button variant="Trigger" className=" w-full" disabled={loading} onClick={handleSignOut}>
                      {loading ? "Signing out..." : "Sign out"}
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
