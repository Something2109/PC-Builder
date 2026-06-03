import { Content as ArticleContent } from "@/utils/article";
import axios from "axios";

export type ContentProps<T extends ArticleContent> = Readonly<{
  content: T;
  prefix?: string;
}>;

export async function uploadFile(file: File, subfolder?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  
  let url = "/api/article/media/upload";
  if (subfolder) {
    url += `?subfolder=${encodeURIComponent(subfolder)}`;
  }
  
  const response = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return response.data.url;
}

