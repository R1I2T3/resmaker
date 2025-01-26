"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/client/lib/hono-rpc";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  typeof apiClient.restore.archive.$put
>["json"];
type ResponseType = InferResponseType<typeof apiClient.restore.archive.$put>;
const useRestore = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await apiClient.restore.archive.$put({ json });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trashDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document"] });
    },
    onError: () => {
      toast.error("Failed to restore document");
    },
  });
  return mutation;
};

export default useRestore;
