import { BuildProvider } from "@/components/build/hook/BuildContext";
import { ProductTypeProvider } from "@/components/build/hook/ProductType";
import { ValidationProvider } from "@/components/build/hook/Validation";
import BuildProductList from "@/components/build/List";
import BuildValidateForm from "@/components/build/Form";
import BuildProductSummary from "@/components/build/Summary";
import BuildResultList from "@/components/build/Result";
import { ColumnWrapper, RowWrapper } from "@/components/utils/FlexWrapper";

export default function build() {
  return (
    <BuildProvider>
      <ProductTypeProvider>
        <ValidationProvider>
          <RowWrapper className="w-full">
            <ColumnWrapper className="w-1/3">
              <h1 className="text-2xl font-bold mb-4">Build Your PC</h1>
              <p className="mb-4">
                Select the components you want to include in your build.
              </p>
              <BuildProductList />
              <BuildValidateForm />
              <BuildResultList />
            </ColumnWrapper>
            <ColumnWrapper>
              <BuildProductSummary></BuildProductSummary>
            </ColumnWrapper>
          </RowWrapper>
        </ValidationProvider>
      </ProductTypeProvider>
    </BuildProvider>
  );
}
