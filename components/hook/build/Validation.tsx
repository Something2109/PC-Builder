"use client";

import Build from "@/utils/build";
import { createContext, useActionState, useContext } from "react";
import axios from "axios";

const DefaultResult = { missing: {}, rules: {}, products: {} };

type Validation = {
  result: Build.Result;
  pending: boolean;
  validate: (list: Build.List) => void;
};

const ValidationContext = createContext<Validation>({
  result: DefaultResult,
  pending: false,
  validate: function (): void {
    throw new Error("You are trying to call validate without a context.");
  },
});

function useValidateAction() {
  const [state, setState, pending] = useActionState<Build.Result, Build.List>(
    async (_, list) => {
      try {
        const response = await axios.post<Build.Result>(
          `/api/build/validate`,
          list,
          { withCredentials: true }
        );

        return response.data;
      } catch (err) {
        console.error(err);
      }
      return DefaultResult;
    },
    DefaultResult
  );

  return { result: state, validate: setState, pending } as const;
}

function ValidationProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const validation = useValidateAction();

  return (
    <ValidationContext.Provider value={validation}>
      {children}
    </ValidationContext.Provider>
  );
}

function useValidation() {
  return useContext(ValidationContext);
}

export { ValidationProvider, useValidation };
