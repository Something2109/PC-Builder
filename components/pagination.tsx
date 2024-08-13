"use client";

export default function PaginationBar({
  path,
  current,
  total,
}: {
  path: string;
  current: number;
  total: number;
}) {
  const components = [];

  if (total > 0) {
    if (current > 1) {
      components.push(
        <PaginationButton path={path} title={"<"} num={current - 1} />
      );
    }

    for (let i = 1; i <= total; i++) {
      if (i !== current) {
        components.push(
          <PaginationButton path={path} title={String(i)} num={i} />
        );
      }
    }

    if (current < total) {
      components.push(
        <PaginationButton path={path} title={">"} num={current + 1} />
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
  path: string;
  title: string;
  num: number;
}) {
  return (
    <a
      href={`${path}?page=${num}`}
      className="block size-8 aspect-square content-center rounded-full border-2 border-line hover:bg-line hover:text-background"
    >
      <p className="m-auto size-fit font-bold">{title}</p>
    </a>
  );
}
