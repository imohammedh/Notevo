import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import {generateSlug} from "../../lib/generateSlug";

export const createNote = mutation({
    args:{
        title: v.string(),
        notesTableId: v.id("notesTables"),
        workingSpacesSlug:v.string()
    },
    handler: async (ctx, args:any)=>{{{
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { title,notesTableId,workingSpacesSlug } = args;
         // Get the current highest order for this table
        const existingNotes = await ctx.db.query("notes")
            .withIndex("by_notesTableId", (q) => q.eq("notesTableId", notesTableId))
            .collect();
        
        const highestOrder = existingNotes.reduce((max, note) => {
            return Math.max(max, note.order ?? -1);
        }, -1);

        const generateSlugName = generateSlug(title);
        // Check if the slug already exists and add incremental number if it does
        let slug = generateSlugName;
        let existingWorkingSpace = await ctx.db.query("notes").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
        let counter = 1;
        while (existingWorkingSpace) {
            slug = `${generateSlugName}-${counter}`;
            existingWorkingSpace = await ctx.db.query("notes").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
            counter++;
        }
        const note = {
            userId:userId,
            title,
            notesTableId,
            workingSpacesSlug:workingSpacesSlug,
            slug: slug,
            order: highestOrder + 1, // Add to the end of the list
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const newNote = await ctx.db.insert("notes", note);
        return newNote;
    }}}
})

export const updateNote = mutation({
    args:{
        _id: v.any(),
        userid: v.any(),
        notesTableId: v.any(),
        title: v.optional(v.string()),
        body: v.optional(v.string()),
        workingSpacesSlug: v.any(),
        createdAt: v.any(),
        order: v.optional(v.number()), // Add this if you want to explicitly pass it
        favorite: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const userId = getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { _id, userid, notesTableId, title, body, workingSpacesSlug, createdAt, order,favorite } = args;
        const note = await ctx.db.get(_id);
        if (!note) {
            throw new Error("Note not found");
        }
        const generateSlugName = generateSlug(title ?? "Untitled");
        // Check if the slug already exists and add incremental number if it does
        let slug = generateSlugName;
        let existingWorkingSpace = await ctx.db.query("notes").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
        let counter = 1;
        while (existingWorkingSpace && existingWorkingSpace._id !== _id) {
            slug = `${generateSlugName}-${counter}`;
            existingWorkingSpace = await ctx.db.query("notes").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
            counter++;
        }
        const update = {
            userId: userid,
            title: title,
            body: body,
            notesTableId: notesTableId,
            slug: slug,
            workingSpacesSlug: workingSpacesSlug,
            createdAt: createdAt,
            updatedAt: Date.now(),
            order: order ,
            favorite:favorite
        };
        const updatedNote = await ctx.db.replace(_id, update);
        return updatedNote;
    }
})

export const updateNoteOrder = mutation({
  args: {
    tableId: v.id("notesTables"),
    noteIds: v.array(v.id("notes"))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const { tableId, noteIds } = args;
    
    const updates = await Promise.all(
      noteIds.map(async (noteId, index) => {
        const note = await ctx.db.get(noteId);
        if (!note) {
          throw new Error(`Note ${noteId} not found`);
        }
        
        if (note.notesTableId !== tableId) {
          throw new Error(`Note ${noteId} does not belong to table ${tableId}`);
        }
        
        return ctx.db.patch(noteId, {
          order: index,
          updatedAt: Date.now()
        });
      })
    );
    
    return { success: true, updatedNotes: noteIds.length };
  }
});

export const getNotesByNoteId = query({
    args: { noteId: v.any() }, // Accept noteId as an argument
    handler: async (ctx, { noteId }) => { // Destructure noteId from args
        const userId = getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const note = await ctx.db.query("notes").filter(q => q.eq(q.field("_id"), noteId)).first(); // Fetch the note by ID
        if (!note) {
            throw new Error("Note not found");
        }
        return note;
    }
})

export const deleteNote = mutation({
    args:{
        _id: v.id("notes"),
    },
    handler: async (ctx, args)=>{
        const userId = getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { _id } = args;
        const note = await ctx.db.get(_id);
        if (!note) {
            throw new Error("Note not found");
        }
        await ctx.db.delete(_id);
        return _id;
    }
})
export const getNoteByUserId = query({
    args: {
        userid: v.any()
    },
    handler: async (ctx, args) => {
        const userId = getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { userid } = args;
        const notes = await ctx.db.query("notes")
            .withIndex("by_userId", (q) => q.eq("userId", userid))
            .collect();
        
        if (!notes) {
            throw new Error("Notes not found");
        }
        
        return notes.sort((a, b) => {
            if (a.notesTableId !== b.notesTableId) {
                return a.notesTableId < b.notesTableId ? -1 : 1;
            }
            return (a.order ?? Infinity) - (b.order ?? Infinity);
        });
    }
})
