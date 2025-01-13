import { ArticleSummary } from "@/models/articles/article";
import { ColumnWrapper } from "./FlexWrapper";
import Link from "next/link";

const normal =
  "flex flex-col-reverse lg:flex-row p-3 lg:gap-3 border-t-2 border-line lg:rounded-xl lg:border-2";
const light = "hover:lg:border-blue-500 hover:bg-line";
const dark = "dark:hover:bg-blue-500 dark:hover:border-blue-500";
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
      <picture className="w-full *:w-full lg:min-w-48 lg:max-w-48 aspect-video content-center">
        <img
          src="/images/icons/pc.png"
          alt="thumbnail"
          className="dark:invert transition ease-in-out duration-500 delay-0"
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
