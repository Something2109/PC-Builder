import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

import axiosInstance from "@/lib/axios";

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/article/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      router.push("/article");
      router.refresh();
    },
    onError: (err: unknown) => {
      console.error("Failed to delete article:", err);
      let errMsg = "Failed to delete article.";
      if (axios.isAxiosError(err)) {
        errMsg = err.response?.data?.message || err.message || errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      alert(errMsg);
    },
  });

  return {
    deleteArticle: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}
