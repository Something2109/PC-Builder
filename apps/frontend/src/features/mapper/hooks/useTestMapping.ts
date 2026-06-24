import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Products } from "@pc-builder/shared/part";
import axiosInstance from "@/lib/axios";
import { MapperResult } from "../types";

export interface TestMappingParams {
  productType: Products;
  fallbackBrand: string;
  jsonInput: string;
}

export function useTestMapping() {
  const [lastMappedJson, setLastMappedJson] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation<MapperResult, Error, TestMappingParams>({
    mutationFn: async (params) => {
      setErrorMessage(null);
      const parsedInput = JSON.parse(params.jsonInput);
      const url = `/mapper/map/${params.productType}`;
      const queryParams = params.fallbackBrand ? { fallbackBrand: params.fallbackBrand } : undefined;

      const response = await axiosInstance.post<MapperResult>(url, parsedInput, { params: queryParams });
      return response.data;
    },
    onSuccess: (data, variables) => {
      setLastMappedJson(variables.jsonInput);
    },
    onError: (err: unknown) => {
      console.error("Mapping test failed:", err);
      let msg = "Mapping endpoint error. Check server logs.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setErrorMessage(msg);
    },
  });

  return {
    testMapping: mutation.mutate,
    testMappingAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    result: mutation.data ?? null,
    error: errorMessage,
    lastMappedJson,
    reset: () => {
      mutation.reset();
      setLastMappedJson("");
      setErrorMessage(null);
    },
  };
}
