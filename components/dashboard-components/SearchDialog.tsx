"use client";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"
 
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Search } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { useRouter } from "next/navigation"
interface SearchDialogProps{
    Variant:"SidebarMenuButton" | "Trigger",
    WithTheTitle:boolean,
    IconSize:"16"|"24"
}
export default function SearchDialog({Variant,WithTheTitle,IconSize}:SearchDialogProps) {
  const viwer = useQuery(api.users.viewer);
  const getNotes = useQuery(api.mutations.notes.getNoteByUserId,{userid:viwer?._id});
  const router = useRouter()
  const handleRouting = (noteId: any,noteSlug: any,workingSpacesSlug:any)=>{
    router.push(`/dashboard/${workingSpacesSlug}/${noteSlug}?id=${noteId}`);
  }
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button 
                variant={Variant}
                className=" px-2 h-8 group"
            >
            <Search size={IconSize} />
            {
               WithTheTitle&&<span>Search</span>
            }
          </Button>
        </DialogTrigger>
        <DialogContent className=" p-2 bg-brand_fourthary rounded-lg border-brand_tertiary/10 md:min-w-[450px]">
            <Command className=" bg-brand_fourthary">
                <CommandInput placeholder="Search for your note..." />
                <CommandList className="scrollbar-thin scrollbar-thumb-brand_tertiary scrollbar-track-brand_fourthary">
                    <CommandEmpty className="text-brand_tertiary p-2">{(getNotes&&getNotes?.length!==0)?"No results found.":"it looks like you don't have any note's."}</CommandEmpty>
                        { 
                            (getNotes&&getNotes?.length!==0)?
                            getNotes.map((note) => (
                                <CommandGroup key={note._id} heading="Suggestions">
                                    <CommandItem className=" group hover:bg-brand_tertiary/5 aria-selected:bg-brand_tertiary/5">
                                        <button onClick={() => note.slug && handleRouting(note._id, note.slug,note.workingSpacesSlug)} className="w-full h-full flex flex-shrink-0 flex-grow-0 justify-between items-start gap-1">
                                            <h1 className="text-lg font-medium text-nowrap">
                                            {note.title ? (note.title.length > 20 ? `${note.title.substring(0, 20)}...` : note.title) : 'Untitled'}
                                            </h1>
                                            <span className="flex justify-center items-center gap-1 transition-all duration-200 ease-in-out opacity-10 group-hover:opacity-80">
                                                <Calendar size="16"/>
                                                <p className=" font-normal text-sm">{new Date(note.createdAt).toLocaleDateString()}</p>
                                            </span>
                                        </button>
                                    </CommandItem>
                                </CommandGroup>
                            )):<p className="text-brand_tertiary">{`it looks like you don't have any note's`}</p>
                        }
                </CommandList>
            </Command>
        </DialogContent>
    </Dialog>

  )
}
