import { BuildProvider } from "@/components/hook/build/BuildContext";
import { ValidationProvider } from "@/components/hook/build/Validation";
import { ReactNode } from "react";

export default function build({ children }: { children: ReactNode }) {
  return (
    <BuildProvider>
      <ValidationProvider>{children}</ValidationProvider>
    </BuildProvider>
  );
}
