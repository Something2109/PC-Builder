import { BuildProvider } from "@/components/build/hook/BuildContext";
import { ValidationProvider } from "@/components/build/hook/Validation";
import { ReactNode } from "react";

export default function build({ children }: { children: ReactNode }) {
  return (
    <BuildProvider>
      <ValidationProvider>{children}</ValidationProvider>
    </BuildProvider>
  );
}
