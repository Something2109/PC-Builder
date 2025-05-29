import { FunctionComponent } from "react";
import { RowWrapper } from "../../utils/FlexWrapper";
import { InfoLabel } from "./Table";

export type InfoSummaryMapping<T extends Record<string, any>> = {
  [key in keyof Required<T>]: FunctionComponent<{ value?: T[key] }>;
};

export function GenericSummaryCells<T extends Record<string, any>>(
  Components: InfoSummaryMapping<T>,
  Labels: InfoLabel<T>,
  Attributes: string[]
) {
  return ({ defaultValue }: { defaultValue?: Partial<T> }) => {
    if (!defaultValue)
      return Attributes.map((attr) => (
        <td key={`Header-${attr}`}>{Labels[attr]}</td>
      ));

    return Attributes.map((attr) => {
      const Component = Components[attr];

      return (
        <td key={`Row-${defaultValue.id}-${attr}`}>
          {Components[attr] && defaultValue[attr] && (
            <RowWrapper>
              <p className="lg:hidden">{Labels[attr]}:</p>
              <Component value={defaultValue[attr]} />
            </RowWrapper>
          )}
        </td>
      );
    });
  };
}
