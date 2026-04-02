import BuildProductList from "@/components/build/List";
import BuildValidateForm from "@/components/build/Form";
import BuildResultList from "@/components/build/Result";
import { ColumnWrapper } from "@/components/utils/FlexWrapper";

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
