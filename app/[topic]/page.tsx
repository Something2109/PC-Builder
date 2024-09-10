import { ArticleLink } from "@/components/utils/ArticleLink";
import { ColumnWrapper } from "@/components/utils/FlexWrapper";
import { Database } from "@/models/Database";

export default async function TopicPage({
  params,
}: {
  params: { topic: string };
}) {
  const articleSumaries = await Database.articles.getSummary(params.topic);

  return (
    <>
      <h1 className="text-4xl font-bold mb-2">Giới thiệu</h1>
      <ColumnWrapper>
        {articleSumaries.map((article) => {
          return (
            <ArticleLink
              key={article.url}
              href={article.url}
              summary={article}
            />
          );
        })}
      </ColumnWrapper>
    </>
  );
}
