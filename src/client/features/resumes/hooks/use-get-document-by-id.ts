"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/client/lib/hono-rpc";
const useGetDocumentById = (documentId: string, isPublic: boolean = false) => {
  const query = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const endPoint = !isPublic ? apiClient[":id"] : apiClient.public[":id"];
      const response = await endPoint.$get({
        param: {
          id: documentId,
        },
      });
      if (!response) {
        throw new Error("Failed to fetch Document");
      }
      const result = await response.json();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return {
        data: result.data,
        success: result.success,
      };
    },
  });
  return query;
};

export default useGetDocumentById;
