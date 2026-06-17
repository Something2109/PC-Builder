"use client";

export default function PaginationBar({
  path,
  current,
  total,
}: {
  path: string | ((page: number) => void);
  current: number;
  total: number;
}) {
  const components = [];

  if (total > 0) {
    if (current > 1) {
      components.push(
        <PaginationButton key="Pagination-Begin" path={path} title={"<<"} num={1} />,
        <PaginationButton key="Pagination-Back" path={path} title={"<"} num={current - 1} />
      );
    }

    const min = Math.max(1, current - 3);
    const max = Math.min(total, current + 3);
    for (let i = min; i <= max; i++) {
      if (i === current) {
        components.push(
          <span
            key={`Pagination-${i}`}
            className="flex items-center justify-center size-9 rounded-full bg-accent-indigo text-white font-bold shadow-sm shadow-accent-indigo/20"
          >
            {i}
          </span>
        );
      } else {
        components.push(
          <PaginationButton key={`Pagination-${i}`} path={path} title={String(i)} num={i} />
        );
      }
    }

    if (current < total) {
      components.push(
        <PaginationButton key="Pagination-Forward" path={path} title={">"} num={current + 1} />,
        <PaginationButton key="Pagination-End" path={path} title={">>"} num={total} />
      );
    }
  }

  return <nav className="flex flex-row justify-center my-6 gap-2 items-center">{components}</nav>;
}

const PaginationButtonStyle =
  "flex items-center justify-center size-9 rounded-full border border-border bg-card text-text/70 font-semibold hover:border-accent-indigo hover:text-accent-indigo hover:shadow-xs transition-all duration-200";

function PaginationButton({
  path,
  title,
  num,
}: {
  path: string | ((page: number) => void);
  title: string;
  num: number;
}) {
  if (typeof path === "string") {
    return (
      <a
        href={`${path}${path.includes("?") ? "&" : "?"}page=${num}`}
        className={PaginationButtonStyle}
      >
        <span className="font-bold text-xs">{title}</span>
      </a>
    );
  }
  return (
    <button type="button" onClick={() => path(num)} className={PaginationButtonStyle}>
      <span className="font-bold text-xs">{title}</span>
    </button>
  );
}
