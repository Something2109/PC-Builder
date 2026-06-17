import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { uploadFile } from "@/features/article/components/utils";

export function useImageUpload() {
  const uploadMutation = useMutation<string, unknown, { file: File; subfolder?: string }>({
    mutationFn: async ({ file, subfolder }) => {
      return uploadFile(file, subfolder);
    },
  });

  const upload = async (file: File, subfolder?: string): Promise<string> => {
    return uploadMutation.mutateAsync({ file, subfolder });
  };

  let errorMsg: string | null = null;
  if (uploadMutation.error) {
    const err = uploadMutation.error;
    if (axios.isAxiosError(err)) {
      errorMsg = err.response?.data?.message || err.message || "Failed to upload image";
    } else if (err instanceof Error) {
      errorMsg = err.message;
    } else {
      errorMsg = "Failed to upload image";
    }
  }

  return {
    upload,
    isUploading: uploadMutation.isPending,
    error: errorMsg,
  };
}
