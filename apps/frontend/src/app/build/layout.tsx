import { BuildProvider } from "@/features/build/hooks/BuildContext";
import { ValidationProvider } from "@/features/build/hooks/Validation";
import { ReactNode } from "react";

export default function build({ children, modal }: { children: ReactNode; modal: ReactNode }) {
  return (
    <BuildProvider>
      <ValidationProvider>
        {children}
        {modal}
      </ValidationProvider>
    </BuildProvider>
  );
}
