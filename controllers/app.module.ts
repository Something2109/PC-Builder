import { Module } from "@nestjs/common";
import { ArticleModule } from "./article/article.module";
import { PartModule } from "./part/part.module";
import { DBModule } from "./db.module";
import { ConfigModule } from "@nestjs/config";
import { FilterModule } from "./filter/filter.module";
import { SearchModule } from "./search/search.module";
import { CrawlerModule } from "./crawler/crawler.module";

@Module({
  imports: [
    PartModule,
    FilterModule,
    SearchModule,
    CrawlerModule,
    ArticleModule,
    ConfigModule.forRoot(),
    DBModule,
  ],
})
export class AppModule {}
