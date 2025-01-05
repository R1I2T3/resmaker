import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import * as authSchema from "./schema/auth";
export const db = drizzle(env.DB_URL, {
  schema: {
    ...authSchema,
  },
});
