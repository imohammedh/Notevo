import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new Error("User was deleted");
    }
    return user;
  },
});
export const users = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const users = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.neq(q.field("emailVerificationTime"), null),
          q.neq(q.field("phoneVerificationTime"), null),
        ),
      )
      .order("desc")
      .paginate(paginationOpts);
    return users;
  },
});
