import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

import axiosInstance from "@/lib/axios";

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<
    { id: string; slug?: string },
    unknown,
    { id: string; payload: unknown }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await axiosInstance.put(`/article/${id}`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["article", data.id] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      router.push(`/article/${data.slug || data.id}`);
      router.refresh();
    },
    onError: (err: unknown) => {
      console.error("Failed to update article:", err);
      let errMsg = "An error occurred while saving the article.";
      if (axios.isAxiosError(err)) {
        errMsg = err.response?.data?.message || err.message || errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      alert(errMsg);
    },
  });

  return {
    updateArticle: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}
