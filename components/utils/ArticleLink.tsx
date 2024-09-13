import { ArticleSummary } from "@/models/articles/article";
import { ColumnWrapper } from "./FlexWrapper";
import Image from "next/image";
import Link from "next/link";

const normal =
  "flex flex-col-reverse md:flex-row gap-3 rounded-lg lg:rounded-xl border-3 border-line p-3 md:border-4";
const light = "hover:border-blue-500";
const dark = "dark:hover:bg-blue-500";
const max_char = 200;

function ArticleLink({
  className,
  summary,
  ...rest
}: Parameters<typeof Link>[0] & { summary: ArticleSummary }) {
  let classList = [normal, light, dark];
  if (className) {
    classList.push(className);
  }

  return (
    <Link className={classList.join(" ")} {...rest}>
      <picture className="lg:w-64 aspect-video content-center">
        <Image
          src="/images/icons/pc.png"
          alt="thumbnail"
          className="dark:hidden"
          width="512"
          height="512"
        />
        <Image
          src="/images/icons/pc-dark.png"
          alt="thumbnail"
          className="hidden dark:block"
          width="512"
          height="512"
        />
      </picture>
      <ColumnWrapper className="h-fit">
        <h1 className="font-bold text-lg md:text-xl lg:text-2xl mb-2">
          {summary.title}
        </h1>
        <p className="text-md overflow-hidden md:text-lg lg:text-xl">
          {summary.standfirst.length > max_char
            ? `${summary.standfirst
                .slice(0, summary.standfirst.lastIndexOf(" ", max_char))
                .trim()}...`
            : summary.standfirst}
        </p>
      </ColumnWrapper>
    </Link>
  );
}

export { ArticleLink };
