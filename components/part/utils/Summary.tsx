import { FunctionComponent, HTMLAttributes } from "react";
import { RowWrapper } from "../../utils/FlexWrapper";
import { InfoLabel } from "./Table";

export namespace SummaryTable {
  const tableClass = "w-full border-separate border-spacing-0";
  const tableHeader =
    "hidden lg:table-header-group font-bold sticky top-32 bg-white dark:bg-background transition-bg";
  const tableRow =
    "grid grid-cols-2 border-b-2 *:p-2 lg:table-row *:lg:border-b-2 hover:rounded-lg hover:bg-line hover:dark:text-background";

  export const Component = ({
    className,
    ...rest
  }: HTMLAttributes<HTMLTableElement>) => (
    <table
      className={className ? className.concat(" ", tableClass) : tableClass}
      {...rest}
    />
  );

  export const Head = ({
    className,
    ...attr
  }: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className={className ? className.concat(" ", tableHeader) : tableHeader}
      {...attr}
    />
  );

  export const Row = ({
    className,
    ...attr
  }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={className ? className.concat(" ", tableRow) : tableRow}
      {...attr}
    />
  );
}

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
