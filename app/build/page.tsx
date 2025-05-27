import { BuildProvider } from "@/components/build/hook/BuildDetail";
import { ProductSelectProvider } from "@/components/build/hook/ProductSelect";
import BuildProductList from "@/components/build/List";
import BuildValidateForm from "@/components/build/Form";
import BuildProductSummary from "@/components/build/Summary";
import { VerticalCollapsible } from "@/components/utils/Collapsible";
import { ColumnWrapper, RowWrapper } from "@/components/utils/FlexWrapper";

export default function build() {
  return (
    <BuildProvider>
      <ProductSelectProvider>
        <RowWrapper className="w-full">
          <ColumnWrapper className="w-1/3">
            <h1 className="text-2xl font-bold mb-4">Build Your PC</h1>
            <p className="mb-4">
              Select the components you want to include in your build.
            </p>
            <BuildProductList />
            <BuildValidateForm />
            <VerticalCollapsible>
              <h1 className="text-2xl font-bold">Result</h1>
              <ColumnWrapper></ColumnWrapper>
            </VerticalCollapsible>
          </ColumnWrapper>
          <ColumnWrapper>
            <BuildProductSummary></BuildProductSummary>
          </ColumnWrapper>
        </RowWrapper>
      </ProductSelectProvider>
    </BuildProvider>
  );
}
