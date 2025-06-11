"use client";

import Build from "@/utils/interface/build";
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
  validate: function (list: Build.List): void {
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

  return [state, setState, pending] as const;
}

function ValidationProvider({ children }: { children: React.ReactNode }) {
  const [result, validate, pending] = useValidateAction();

  return (
    <ValidationContext.Provider
      value={{
        result,
        pending,
        validate,
      }}
    >
      {children}
    </ValidationContext.Provider>
  );
}

function useValidation() {
  return useContext(ValidationContext);
}

export { ValidationProvider, useValidation };
