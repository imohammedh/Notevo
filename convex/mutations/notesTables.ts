import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import {generateSlug} from "../../lib/generateSlug";

export const createTable = mutation({
    args:{
        name: v.string(),
        workingSpaceId: v.id("workingSpaces"),
    },
    handler: async (ctx, args:any)=>{
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { name, workingSpaceId } = args;
        const generateSlugName = generateSlug(name);
        // Check if the slug already exists and add incremental number if it does
        let slug = generateSlugName;
        let existingWorkingSpace = await ctx.db.query("notesTables").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
        let counter = 1;
        while (existingWorkingSpace) {
            slug = `${generateSlugName}-${counter}`;
            existingWorkingSpace = await ctx.db.query("notesTables").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
            counter++;
        }
        const table = {
            name,
            workingSpaceId,
            slug: slug,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const newTable = await ctx.db.insert("notesTables", table);
        return newTable;
    }
})

export const updateTable = mutation({
    args:{
        _id: v.id("notesTables"),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args)=>{
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { _id, name } = args;
        const table = await ctx.db.get(_id);
        if (!table) {
            throw new Error("Table not found");
        }
        const generateSlugName = generateSlug(name??"Untitled");
        // Check if the slug already exists and add incremental number if it does
        let slug = generateSlugName;
        let existingWorkingSpace = await ctx.db.query("notesTables").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
        let counter = 1;
        while (existingWorkingSpace) {
            slug = `${generateSlugName}-${counter}`;
            existingWorkingSpace = await ctx.db.query("notesTables").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
            counter++;
        }
        const update = {
            name: name ?? table.name,
            workingSpaceId: table.workingSpaceId,
            slug: slug,
            createdAt: table.createdAt,
            updatedAt: Date.now(),
        };
        const updatedTable = await ctx.db.replace(_id,update);
        return updatedTable;
    }
})
export const getTables = query({
    args: {
        workingSpaceId:v.any()
    },
    handler: async (ctx,args)=>{
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const {workingSpaceId}=args
        const tables = await ctx.db.query("notesTables").withIndex("by_workingSpaceId", (q) => q.eq("workingSpaceId", workingSpaceId)).collect();
        return tables;
    }
})
export const deleteTable = mutation({
    args:{
        _id: v.id("notesTables"),
    },
    handler: async (ctx, args)=>{
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { _id } = args;
        await ctx.db.delete(_id);
        return true;
    }
})