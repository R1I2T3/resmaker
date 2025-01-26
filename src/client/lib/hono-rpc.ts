import { hc } from "hono/client";
import { AppType } from "@/server/features/resume/route";
import { env } from "@/lib/env";
export const apiRPC = hc<AppType>(env.NEXT_PUBLIC_BETTER_AUTH_URL);
