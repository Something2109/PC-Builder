import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";

import axiosInstance from "@/lib/axios";

export function useCreateArticle() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<
    { id: string; slug?: string },
    unknown,
    { payload: unknown; queryParams?: URLSearchParams }
  >({
    mutationFn: async ({ payload, queryParams }) => {
      let url = "/article";
      if (queryParams && queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      const response = await axiosInstance.post(url, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      router.push(`/article/${data.slug || data.id}`);
      router.refresh();
    },
    onError: (err: unknown) => {
      console.error("Failed to create article:", err);
      let errMsg = "An error occurred while creating the article.";
      if (axios.isAxiosError(err)) {
        errMsg = err.response?.data?.message || err.message || errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      alert(errMsg);
    },
  });

  return {
    createArticle: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
