"use client";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { SidebarSeparator } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { useMutation, useQuery } from "convex/react";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  CircleUser,
  Home,
  Plus,
  Search,
  CircleUserRound,
  CreditCard,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import SearchDialog from "./SearchDialog";
import LoadingAnimation from "../ui/LoadingAnimation";
import type { Id } from "@/convex/_generated/dataModel";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function FloatingNavbar() {
  const User = useQuery(api.users.viewer);
  const searchParams = useSearchParams().get("id") as Id<"workingSpaces">;
  const [,] = useState(false);
  const [handleCreateTableloading, sethandleCreateTableloading] =
    useState(false);
  const [Signoutloading, setSignoutloading] = useState(false);
  const createTable = useMutation(api.notesTables.createTable);
  const createWorkingSpace = useMutation(
    api.workingSpaces.createWorkingSpace,
  );

  const handleCreateWorkingSpace = () => {
    createWorkingSpace({ name: "Untitled" });
  };
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
      redirect("/");
    } catch (error) {
      console.error(error);
    } finally {
      setSignoutloading(false);
    }
  };

  return (
    <div className="fixed w-full bottom-0 right-0 h-16 bg-background/70 backdrop-blur border border-solid border-border block sm:hidden ">
      <div className=" w-full h-full flex justify-center items-center gap-5">
        <div className=" flex flex-col justify-center items-center text-muted-foreground text-xs hover:text-foreground">
          <Button
            variant="Trigger"
            className="justify-center text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard">
              <Home size="24" />
            </Link>
          </Button>
          Home
        </div>
        <div className=" flex flex-col justify-center items-center text-muted-foreground text-xs hover:text-foreground">
          <span className="h-10 px-4 py-2">
            {/* <SearchDialog
              Variant="Trigger"
              WithTheTitle={false}
              IconSize="24"
            /> */}
          </span>
          Search
        </div>
        <div className=" flex flex-col justify-center items-center text-muted-foreground text-xs hover:text-foreground">
          <Button
            variant="Trigger"
            className="justify-center text-muted-foreground hover:text-foreground"
            onClick={
              searchParams === null
                ? handleCreateWorkingSpace
                : handleCreateTable
            }
            disabled={handleCreateTableloading}
          >
            <Plus size="24" />
          </Button>
          Create
        </div>
        <div className=" flex flex-col justify-center items-center text-muted-foreground text-xs hover:text-foreground">
          <div className=" text-muted-foreground text-xs hover:text-foreground">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {Signoutloading === false ? (
                  <Button
                    variant="Trigger"
                    className=" justify-center text-muted-foreground hover:text-foreground"
                  >
                    <Avatar className="max-w-8 max-h-8 flex items-center justify-center">
                      <AvatarImage
                        src={User?.image}
                        className=" rounded-lg"
                        alt={User ? User.name?.charAt(0) : ""}
                      />
                      <AvatarFallback>
                        {User ? User.name?.charAt(0) : <LoadingAnimation />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <Button
                    variant="Trigger"
                    className=" justify-center text-muted-foreground hover:text-foreground"
                    disabled={Signoutloading}
                  >
                    <LoadingAnimation />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className=" rounded-lg m-2 p-2 bg-background backdrop-blur border border-solid border-border w-fit"
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
                    disabled={Signoutloading}
                    onClick={handleSignOut}
                  >
                    {Signoutloading ? (
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
          </div>
          You
        </div>
      </div>
    </div>
  );
}
