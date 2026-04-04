import { BuildProvider } from "@/features/build/hooks/BuildContext";
import { ValidationProvider } from "@/features/build/hooks/Validation";
import { ReactNode } from "react";

export default function build({ children }: { children: ReactNode }) {
  return (
    <BuildProvider>
      <ValidationProvider>{children}</ValidationProvider>
    </BuildProvider>
  );
}
