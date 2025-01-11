import { createAuthClient } from "better-auth/client";
import { env } from "@/lib/env";
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
