"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/client/lib/hono-rpc";
const useGetDocuments = (isTrash: boolean) => {
  const queryKey = isTrash ? ["trashDocuments"] : ["documents"];
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const endPoint = isTrash
        ? apiClient.resumes.trash.all
        : apiClient.resumes.all;
      const response = await endPoint.$get();
      if (!response.ok) {
        throw new Error("Failed to get documents");
      }
      const { data, success } = await response.json();
      return { data, success };
    },
  });
  return query;
};

export default useGetDocuments;
