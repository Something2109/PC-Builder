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
  return ({ defaultValue }: { defaultValue?: Partial<T> }) => (
    <>
      {Attributes.map((attr, index) => {
        const Component = Components[attr] as FunctionComponent<{
          value?: T[typeof attr];
        }>;
        const value = defaultValue ? defaultValue[attr] : undefined;

        return (
          <td key={new Date().getTime() + index}>
            <RowWrapper>
              <p className="lg:hidden">{Labels[attr]}:</p>
              {Component ? <Component value={value} /> : undefined}
            </RowWrapper>
          </td>
        );
      })}
    </>
  );
}
