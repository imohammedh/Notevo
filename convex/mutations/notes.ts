import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import {generateSlug} from "../../lib/generateSlug";

export const createNote = mutation({
    args:{
        title: v.string(),
        notesTableId: v.id("notesTables"),
    },
    handler: async (ctx, args:any)=>{{{
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { title,notesTableId } = args;
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
            title,
            notesTableId,
            slug: slug,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const newNote = await ctx.db.insert("notes", note);
        return newNote;
    }}}
})

export const updateNote = mutation({
    args:{
        _id: v.id("notes"),
        title: v.optional(v.string()),
        body: v.optional(v.string()),
    },
    handler: async (ctx, args)=>{
        const userId = getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { _id, title, body } = args;
        const note = await ctx.db.get(_id);
        if (!note) {
            throw new Error("Note not found");
        }
        const update = {
            title: title ?? note.title ?? "untitled",
            body: body ?? note.body ?? "untitled",
            notesTableId: note.notesTableId,
            createdAt: note.createdAt,
            updatedAt: Date.now(),
        };
        const updatedNote = await ctx.db.replace(_id,update);
        return updatedNote;
    }
})
export const getNotes = query({
    args: {
    },
    handler: async (ctx)=>{
        const userId = getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const note = ctx.db.query("notes").collect();
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