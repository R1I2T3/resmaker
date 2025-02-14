import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import { env } from "@/lib/env";
const pool = new Pool({ connectionString: env.DB_URL });
export const db = drizzle({
  client: pool,
  schema: {
    ...schema,
  },
});
