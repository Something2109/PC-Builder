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
        <PaginationButton
          key="Pagination-Begin"
          path={path}
          title={"<<"}
          num={1}
        />,
        <PaginationButton
          key="Pagination-Back"
          path={path}
          title={"<"}
          num={current - 1}
        />
      );
    }

    const min = Math.max(1, current - 3);
    const max = Math.min(total, current + 3);
    for (let i = min; i <= max; i++) {
      if (i !== current) {
        components.push(
          <PaginationButton
            key={`Pagination-${i}`}
            path={path}
            title={String(i)}
            num={i}
          />
        );
      }
    }

    if (current < total) {
      components.push(
        <PaginationButton
          key="Pagination-Forward"
          path={path}
          title={">"}
          num={current + 1}
        />,
        <PaginationButton
          key="Pagination-End"
          path={path}
          title={">>"}
          num={total}
        />
      );
    }
  }

  return (
    <nav className="flex flex-row justify-center my-2 gap-2">{components}</nav>
  );
}

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
        className="block size-8 aspect-square content-center rounded-full border-2 border-line hover:bg-line hover:text-background"
      >
        <p className="m-auto size-fit font-bold">{title}</p>
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={() => path(num)}
      className="block size-8 aspect-square content-center rounded-full border-2 border-line hover:bg-line hover:text-background"
    >
      <p className="m-auto size-fit font-bold">{title}</p>
    </button>
  );
}
