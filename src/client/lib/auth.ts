import { createAuthClient } from "better-auth/client";
export const { useSession, signIn, signOut } = createAuthClient();
