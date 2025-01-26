"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRPC } from "@/client/lib/hono-rpc";
const useGetDocuments = (isTrash: boolean) => {
  const queryKey = isTrash ? ["trashDocuments"] : ["documents"];
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // const route = isTrash ? apiRPC.resumes
    },
  });
  return query;
};

export default useGetDocuments;
