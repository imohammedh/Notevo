import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { generateSlug } from "../../lib/generateSlug";
export const createNote = mutation({
    args: {
        title: v.string(),
        notesTableId:  v.optional(v.id("notesTables")),
        workingSpacesSlug: v.string(),
        workingSpaceId: v.id("workingSpaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Not authenticated");
        }
        
        const { title, notesTableId, workingSpacesSlug,workingSpaceId } = args;
        
        // Verify the user has access to this table
        if(notesTableId){
            const table = await ctx.db.get(notesTableId);
            if (!table) {
                throw new ConvexError("Table not found");
            }
        }
        // Get the workspace to verify ownership
        const workspace = await ctx.db.query("workingSpaces")
            .withIndex("by_slug", q => q.eq("slug", workingSpacesSlug))
            .first();
            
        if (!workspace) {
            throw new ConvexError("Workspace not found");
        }
        
        if (workspace.userId !== userId) {
            throw new ConvexError("Not authorized to create notes in this workspace");
        }
        

        const generateSlugName = generateSlug(title);
        // Check if the slug already exists and add incremental number if it does
        let slug = generateSlugName;
        let existingNote = await ctx.db.query("notes").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
        let counter = 1;
        while (existingNote) {
            slug = `${generateSlugName}-${counter}`;
            existingNote = await ctx.db.query("notes").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
            counter++;
        }
        const note = {
            userId: userId,
            title,
           ...(notesTableId ? { notesTableId } : {}),
            workingSpacesSlug,
            slug: slug,
            workingSpaceId:workingSpaceId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        
        const newNote = await ctx.db.insert("notes", note);
        return newNote;
    }
});

export const updateNote = mutation({
    args: {
        _id: v.id("notes"),
        title: v.optional(v.string()),
        body: v.optional(v.string()),
        order: v.optional(v.number()),
        favorite: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Not authenticated");
        }
        
        const { _id, title, body, order, favorite } = args;
        const note = await ctx.db.get(_id);
        if (!note) {
            throw new ConvexError("Note not found");
        }
        
        if (note.userId !== userId) {
            throw new ConvexError("Not authorized to update this note");
        }
        
        const generateSlugName = generateSlug(title ?? note.title ?? "Untitled");
        let slug = generateSlugName;
        let existingNote = await ctx.db.query("notes").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
        let counter = 1;
        while (existingNote && existingNote._id !== _id) {
            slug = `${generateSlugName}-${counter}`;
            existingNote = await ctx.db.query("notes").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
            counter++;
        }
        
        const update = {
            ...note,
            title: title ?? note.title,
            body: body ?? note.body,
            slug: slug,
            updatedAt: Date.now(),
            order: order ?? note.order,
            favorite: favorite ?? note.favorite
        };
        
        const updatedNote = await ctx.db.replace(_id, update);
        return updatedNote;
    }
});

export const updateNoteOrder = mutation({
    args: {
        tableId: v.id("notesTables"),
        noteIds: v.array(v.id("notes"))
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Not authenticated");
        }
        
        const { tableId, noteIds } = args;
        
        // Verify the table belongs to this user's workspace
        const table = await ctx.db.get(tableId);
        if (!table) {
            throw new ConvexError("Table not found");
        }
        
        const workspace = await ctx.db.get(table.workingSpaceId);
        if (!workspace || workspace.userId !== userId) {
            throw new ConvexError("Not authorized to update note order in this table");
        }
        
        const updates = await Promise.all(
            noteIds.map(async (noteId, index) => {
                const note = await ctx.db.get(noteId);
                if (!note) {
                    throw new ConvexError(`Note ${noteId} not found`);
                }
                
                if (note.notesTableId !== tableId) {
                    throw new ConvexError(`Note ${noteId} does not belong to table ${tableId}`);
                }
                
                // Verify note belongs to this user
                if (note.userId !== userId) {
                    throw new ConvexError(`Not authorized to update note ${noteId}`);
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

export const deleteNote = mutation({
    args: {
        _id: v.id("notes"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Not authenticated");
        }
        
        const { _id } = args;
        const note = await ctx.db.get(_id);
        if (!note) {
            throw new ConvexError("Note not found");
        }
        
        // Verify the note belongs to this user
        if (note.userId !== userId) {
            throw new ConvexError("Not authorized to delete this note");
        }
        
        await ctx.db.delete(_id);
        return _id;
    }
});

export const getNotesByWorkspaceId = query({
  args: {
    workingSpaceId: v.id("workingSpaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const { workingSpaceId } = args;

    // Get notes that belong to both the authenticated user and the specified workspace
    const notes = await ctx.db.query("notes")
      .withIndex("by_workingSpaceId", (q) =>
        q.eq("workingSpaceId", workingSpaceId)
      )
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return notes;
  }
});

export const getNoteByUserId = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Not authenticated");
        }
        
       
        const notes = await ctx.db.query("notes")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();
        
        if (!notes) {
            return []; 
        }
        
        return notes.sort((a, b) => {
            if(a.notesTableId&&b.notesTableId){

                if (a.notesTableId !== b.notesTableId) {
                    return a.notesTableId < b.notesTableId ? -1 : 1;
                }
            }
            return (a.order ?? Infinity) - (b.order ?? Infinity);
        });
    }
});
