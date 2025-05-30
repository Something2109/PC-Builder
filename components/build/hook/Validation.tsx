"use client";

import Build from "@/utils/interface/build";
import { createContext, useActionState, useContext } from "react";

const DefaultResult = { generic: {}, rules: {}, products: {} };

const ValidationContext = createContext<
  Build.Result & { pending: boolean; validate: (list: Build.List) => void }
>({
  generic: {},
  rules: {},
  products: {},
  pending: false,
  validate: function (list: Build.List): void {
    throw new Error("Function not implemented.");
  },
});

function useValidateAction() {
  const [state, setState, pending] = useActionState<Build.Result, Build.List>(
    async (_, list) => {
      const response = await fetch(`/api/build/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });

      if (!response.ok) return DefaultResult;

      const result = await response.json();

      return result;
    },
    DefaultResult
  );

  return [state, setState, pending] as const;
}

function ValidationProvider({ children }: { children: React.ReactNode }) {
  const [state, validate, pending] = useValidateAction();

  return (
    <ValidationContext.Provider
      value={{
        ...state,
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
