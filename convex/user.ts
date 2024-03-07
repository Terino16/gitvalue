import { mutation, query } from "./_generated/server";
import {v} from "convex/values"
/**
 * Insert or update the user in a Convex table then return the document's ID.
 *
 * The `UserIdentity.tokenIdentifier` string is a stable and unique value we use
 * to look up identities.
 *
 * Keep in mind that `UserIdentity` has a number of optional fields, the
 * presence of which depends on the identity provider chosen. It's up to the
 * application developer to determine which ones are available and to decide
 * which of those need to be persisted. For Clerk the fields are determined
 * by the JWT token's Claims config.
 */
export const addUser = mutation({
  args: {
    name:v.string(),
    id:v.string(),
  },
  handler: async (ctx,args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated Call, User Not Signed IN");
    }
   await ctx.db.insert("user",{
    name:args.name,
    user:identity.subject
   })
  
  },
});


export const getuser = query({
    args: {},
    handler: async (ctx,args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (identity === null) {
        return [];
      }
     return ctx.db.query("user").filter(q=>q.eq(q.field("user"),identity.subject)).collect();
    },
  });