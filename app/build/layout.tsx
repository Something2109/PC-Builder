import { BuildProvider } from "@/components/build/hook/BuildContext";
import { ProductTypeProvider } from "@/components/build/hook/ProductType";
import { ValidationProvider } from "@/components/build/hook/Validation";
import { ReactNode } from "react";

export default function build({ children }: { children: ReactNode }) {
  return (
    <BuildProvider>
      <ProductTypeProvider>
        <ValidationProvider>{children}</ValidationProvider>
      </ProductTypeProvider>
    </BuildProvider>
  );
}
