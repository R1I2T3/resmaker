import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DB_URL: z.string().default(""),
    BETTER_AUTH_SECRET: z.string().default(""),
    BETTER_AUTH_URL: z.string().default(""),
  },
  runtimeEnv: {
    DB_URL: process.env.DB_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  },
});
