import Link from "next/link";

const normal =
  "rounded-lg lg:rounded-xl border-2 border-line p-1 md:border-4 hover:border-blue-500";
const dark = "dark:hover:bg-blue-500";

function Button({
  onClick,
  className,
  children,
}: {
  onClick: Function;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      title={"asd"}
      type="button"
      className={`${className} ${normal} ${dark}`}
      onClick={() => onClick()}
    >
      {children}
    </button>
  );
}

function RedirectButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${className} ${normal} ${dark}`}>
      {children}
    </Link>
  );
}

export { Button, RedirectButton };
