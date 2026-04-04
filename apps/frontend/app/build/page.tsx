import BuildProductList from "@/features/build/components/List";
import BuildValidateForm from "@/features/build/components/Form";
import BuildResultList from "@/features/build/components/Result";
import { ColumnWrapper } from "@/ui/FlexWrapper";

export default function build() {
  return (
    <ColumnWrapper className="w-full">
      <h1 className="text-2xl font-bold mb-4">Build Your PC</h1>
      <p className="mb-4">
        Select the components you want to include in your build.
      </p>
      <BuildProductList />
      <BuildValidateForm />
      <BuildResultList />
    </ColumnWrapper>
  );
}
