import { hc } from "hono/client";
import { AppRouterType } from "@/app/api/[[...route]]/route";
import { env } from "@/lib/env";

export const apiClient = hc<AppRouterType>(env.NEXT_PUBLIC_BETTER_AUTH_URL).api;
