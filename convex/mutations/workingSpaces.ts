import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import {generateSlug} from "../../lib/generateSlug";
export const createWorkingSpace = mutation({
    args:{
        name: v.string(),
    },
    handler: async (ctx, args)=>{
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { name } = args;
        const generateSlugName = generateSlug(name);

        // Check if the slug already exists and add incremental number if it does
        let slug = generateSlugName;
        let existingWorkingSpace = await ctx.db.query("workingSpaces").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
        let counter = 1;
        while (existingWorkingSpace) {
            slug = `${generateSlugName}-${counter}`;
            existingWorkingSpace = await ctx.db.query("workingSpaces").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
            counter++;
        }
        const workingSpace = {
            name,
            userId,
            slug: slug,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const newWorkingSpace = await ctx.db.insert("workingSpaces", workingSpace);
        return newWorkingSpace;
    }
})

export const updateWorkingSpace = mutation({
    args:{
        _id: v.id("workingSpaces"),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args)=>{
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { _id, name } = args;
        const workingSpace = await ctx.db.get(_id);
        if (!workingSpace) {
            throw new Error("WorkingSpace not found");
        }
        const generateSlugName = generateSlug(name??"Untitled");
        // Check if the slug already exists and add incremental number if it does
        let slug = generateSlugName;
        let existingWorkingSpace = await ctx.db.query("workingSpaces").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
        let counter = 1;
        while (existingWorkingSpace) {
            slug = `${generateSlugName}-${counter}`;
            existingWorkingSpace = await ctx.db.query("workingSpaces").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
            counter++;
        }
        const update = {
            name: name ?? workingSpace.name,
            userId: workingSpace.userId,
            slug: slug,
            createdAt: workingSpace.createdAt,
            updatedAt: Date.now(),
        };
        const updatedWorkingSpace = await ctx.db.replace(_id,update);
        return updatedWorkingSpace;
    }
})
export const getWorkingSpaces = query({
    args: {},
    handler: async (ctx)=>{
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const workingSpaces = ctx.db.query("workingSpaces").withIndex("by_userId", (q) => q.eq("userId", userId)).collect();
        return workingSpaces;
    }
})
export const deleteWorkingSpace = mutation({
    args:{
        _id: v.id("workingSpaces"),
    },
    handler: async (ctx, args)=>{
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { _id } = args;
        const workingSpace = await ctx.db.get(_id);
        if (!workingSpace) {
            throw new Error("WorkingSpace not found");
        }
        if (workingSpace.userId !== userId) {
            throw new Error("Not authorized");
        }
        await ctx.db.delete(_id);
    }
})
export const getRecentWorkingSpaces = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        // Fetch recent working spaces sorted by updatedAt
        const recentWorkingSpaces = await ctx.db
            .query("workingSpaces")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .order("asc")
            .collect();
        return recentWorkingSpaces;
    }
});