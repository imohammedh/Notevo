"use client";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  SidebarSeparator
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { useMutation, useQuery } from "convex/react";
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { CircleUser, Home, Plus, Search , CircleUserRound,CreditCard, LogOut } from 'lucide-react';
import Link from "next/link";
import { truncate } from "fs";
export default function FloatingNavbar() {
  const User = useQuery(api.users.viewer);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams().get('id');
  console.log(searchParams)
  const [, ] = useState(false);
  const [handleCreateTableloading, sethandleCreateTableloading] = useState(false);
  const [Signoutloading, setSignoutloading] = useState(false);
  const createTable = useMutation(api.mutations.notesTables.createTable);
  const createWorkingSpace = useMutation(api.mutations.workingSpaces.createWorkingSpace);

  const handleCreateWorkingSpace =() => {
    createWorkingSpace({ name: "Untitled" });
  }
  const handleCreateTable = async () => {
    sethandleCreateTableloading(true);
    try {
      await createTable({ workingSpaceId: searchParams, name: "Untitled" });
    } finally {
      sethandleCreateTableloading(false);
    }
  };
  const { signOut } = useAuthActions();
  const handleSignOut = async () => {
    setSignoutloading(true);
    try {
      await signOut();
      redirect("/")
    } catch (error) {
      console.error(error);
    } finally {
      setSignoutloading(false);
    }
  }

  return (
    <div className="fixed w-full bottom-0 right-0 h-14 bg-brand_fourthary/70 backdrop-blur border border-solid border-brand_tertiary/5 rounded-t-2xl block sm:hidden ">
      <div className=" w-full h-full flex justify-center items-center gap-5">
        <Button 
          variant="Trigger" 
          className=" justify-center text-brand_tertiary/50 hover:text-brand_tertiary">
            <Link href="/dashboard">
              <Home />
            </Link>
        </Button>
        <Button 
          variant="Trigger" 
          className=" justify-center text-brand_tertiary/50 hover:text-brand_tertiary"
          disabled={true}
        >
          <Search />
        </Button>
        <Button 
          variant="Trigger" 
          className=" justify-center text-brand_tertiary/50 hover:text-brand_tertiary"
          onClick={
            searchParams===null?handleCreateWorkingSpace:handleCreateTable
          }
          disabled={handleCreateTableloading}
          >
            <Plus />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="Trigger" className=" justify-center text-brand_tertiary/50 hover:text-brand_tertiary">
                <Avatar className="rounded-lg max-w-8 max-h-8 flex items-center justify-center border border-solid border-brand_tertiary/20">
                  <AvatarImage src={User?.image} alt={User?User.name?.charAt(0):"user not found".charAt(0)} />
                  <AvatarFallback>{User?User.name?.charAt(0):"user not found".charAt(0)}</AvatarFallback>
                </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
              side="top"
              className=" rounded-lg m-2 p-2 bg-brand_fourthary backdrop-blur border border-solid border-brand_tertiary/10 w-fit"
              >
            <DropdownMenuItem className=" w-full">
              <Button variant="SidebarMenuButton" className=" w-full" disabled={true}>
                <CircleUserRound size="16"/> Account
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className=" w-full">
              <Button variant="SidebarMenuButton" className=" w-full" disabled={true}>
                <CreditCard size="16"/> Billing
              </Button>
            </DropdownMenuItem>
            <SidebarSeparator className=" opacity-30 my-2"/>
            <DropdownMenuItem className=" w-full">
              <Button variant="SidebarMenuButton" className=" w-full" disabled={Signoutloading} onClick={handleSignOut}>
                {Signoutloading ? "Signing out..." : <><LogOut size="16"/> Sign out</>}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
