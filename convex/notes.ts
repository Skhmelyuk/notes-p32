import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getNotes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }
    return await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createNote = mutation({
  args: { title: v.string(), completed: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Not authenticated");
    }
    const newNote = await ctx.db.insert("notes", {
      title: args.title,
      completed: args.completed,
      userId,
    });
    return newNote;
  },
});

export const toggleNote = mutation({
  args: {
    id: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Not authenticated");
    }
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new ConvexError("Note not found");
    }
    if (note.userId !== userId) {
      throw new ConvexError("Not authorized");
    }
    return await ctx.db.patch(args.id, {
      completed: !note.completed,
    });
  },
});

export const deleteNote = mutation({
  args: {
    id: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Not authenticated");
    }
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new ConvexError("Note not found");
    }
    if (note.userId !== userId) {
      throw new ConvexError("Not authorized");
    }
    return await ctx.db.delete(args.id);
  },
});

export const clearAllNotes = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Not authenticated");
    }
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const note of notes) {
      await ctx.db.delete(note._id);
    }
    return { deletedCount: notes.length };
  },
});
