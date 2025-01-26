"use client";

import { toast } from "sonner";
import { apiClient } from "@/client/lib/hono-rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useParams } from "next/navigation";
type ResponseType = InferResponseType<
  (typeof apiClient.resumes.update)[":id"]["$put"]
>;
type RequestType = InferRequestType<
  (typeof apiClient.resumes.update)[":id"]["$put"]
>["json"];

const useUpdateDocument = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const documentId = params.documentId as string;

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await apiClient.resumes.update[":id"].$put({
        param: {
          id: documentId,
        },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Info Updated Successfully");
      queryClient.invalidateQueries({
        queryKey: ["document", documentId],
      });
    },
    onError: () => {
      toast.error("Failed to update document");
    },
  });
  return mutation;
};

export default useUpdateDocument;
