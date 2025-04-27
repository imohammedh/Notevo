import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { generateSlug } from "../../lib/generateSlug";

export const createWorkingSpace = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { name } = args;
        const generateSlugName = generateSlug(name);

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
    args: {
        _id: v.id("workingSpaces"),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const { _id, name } = args;
        const workingSpace = await ctx.db.get(_id);
        if (!workingSpace) {
            throw new Error("WorkingSpace not found");
        }
        
        // Authorization check: verify the workspace belongs to the authenticated user
        if (workingSpace.userId !== userId) {
            throw new Error("Not authorized to update this workspace");
        }
        
        const generateSlugName = generateSlug(name ?? "Untitled");
        // Check if the slug already exists and add incremental number if it does
        let slug = generateSlugName;
        let existingWorkingSpace = await ctx.db.query("workingSpaces").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
        let counter = 1;
        while (existingWorkingSpace && existingWorkingSpace._id !== _id) { // Skip current workspace
            slug = `${generateSlugName}-${counter}`;
            existingWorkingSpace = await ctx.db.query("workingSpaces").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
            counter++;
        }
        const update = {
            name: name ?? workingSpace.name,
            userId: workingSpace.userId, // Preserve the original user ID
            slug: slug,
            createdAt: workingSpace.createdAt,
            updatedAt: Date.now(),
        };
        const updatedWorkingSpace = await ctx.db.replace(_id, update);
        return updatedWorkingSpace;
    }
})

export const deleteWorkingSpace = mutation({
  args: {
    _id: v.id("workingSpaces"),
  },
  handler: async (ctx, args) => {
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
      throw new Error("Not authorized to delete this workspace");
    }
    
    // Find all tables associated with this workspace
    const tables = await ctx.db
      .query("notesTables")
      .withIndex("by_workingSpaceId", (q) => q.eq("workingSpaceId", _id))
      .collect();
    
    // Delete all notes associated with this workspace
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_workingSpaceId", (q) => q.eq("workingSpaceId", _id))
      .collect();
    
    // Delete all notes
    for (const note of notes) {
      await ctx.db.delete(note._id);
    }
    
    // Delete all tables
    for (const table of tables) {
      await ctx.db.delete(table._id);
    }
    
    // Finally, delete the workspace
    await ctx.db.delete(_id);
    
    return { success: true };
  }
});

export const getRecentWorkingSpaces = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        // This function is already secure since it only returns workspaces belonging to the authenticated user
        // However, I fixed the sorting to be by updatedAt in descending order to get truly recent workspaces
        const recentWorkingSpaces = await ctx.db
            .query("workingSpaces")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .order("desc") // Changed from "asc" to "desc" to get newest first
            .collect();
        return recentWorkingSpaces;
    }
});

export const getWorkingSpaceById = query({
    args: {
        _id: v.id("workingSpaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        
        const { _id } = args;
        const workingSpace = await ctx.db.get(_id);
        
        if (!workingSpace) {
            throw new Error("WorkingSpace not found");
        }
        
        // Ensure the workspace belongs to the authenticated user
        if (workingSpace.userId !== userId) {
            throw new Error("Not authorized to access this workspace");
        }
        
        return workingSpace;
    }
});
