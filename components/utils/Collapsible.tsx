import { HTMLAttributes, useState } from "react";
import { ColumnWrapper } from "./FlexWrapper";

function VerticalCollapsible({
  children,
  ...divAttributes
}: {
  children: Iterable<React.ReactNode>;
} & HTMLAttributes<HTMLDivElement>) {
  const [collapse, setCollapse] = useState(true);
  const [header, ...rest] = [...children];

  return (
    <ColumnWrapper {...divAttributes}>
      <button
        type="button"
        className="flex flex-row w-full px-2 border-b-2 justify-between"
        onClick={() => setCollapse(!collapse)}
      >
        {header}
        <span className="font-bold">{collapse ? "+" : "-"}</span>
      </button>

      <ColumnWrapper
        className={`${
          collapse ? "h-0" : "h-fit"
        } mx-2 overflow-auto transition-all ease-in-out duration-500 delay-0`}
      >
        {rest}
      </ColumnWrapper>
    </ColumnWrapper>
  );
}

export { VerticalCollapsible };
