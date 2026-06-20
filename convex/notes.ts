import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";

export const getNotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notes").collect();
  },
});

export const createNote = mutation({
  args: { title: v.string(), completed: v.boolean() },
  handler: async (ctx, args) => {
    const newNote = await ctx.db.insert("notes", {
      title: args.title,
      completed: args.completed,
    });
    return newNote;
  },
});

export const toggleNote = mutation({
  args: {
    id: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new ConvexError("Note not found");
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
    return await ctx.db.delete(args.id);
  },
});

export const clearAllNotes = mutation({
  args: {},
  handler: async (ctx) => {
    const notes = await ctx.db.query("notes").collect();
    for (const note of notes) {
      await ctx.db.delete(note._id);
    }
    return { deletedCount: notes.length };
  },
});
