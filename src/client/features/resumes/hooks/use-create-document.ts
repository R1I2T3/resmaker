"use client";
import { toast } from "sonner";
import { apiClient } from "@/client/lib/hono-rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
  typeof apiClient.resumes.create.$post
>["json"];
type ResponseType = InferResponseType<typeof apiClient.resumes.create.$post>;

const useCreateDocument = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await apiClient.resumes.create.$post({ json });
      const data = await response.json();
      return data;
    },
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: () => {
      toast.error("Failed to create a new Resume");
    },
  });
  return mutation;
};

export default useCreateDocument;
