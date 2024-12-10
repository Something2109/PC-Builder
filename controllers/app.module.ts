import { Module } from "@nestjs/common";
import { ArticleModule } from "./article/article.module";
import { PartModule } from "./part/part.module";
import { DBModule } from "./db.module";
import { ConfigModule } from "@nestjs/config";
import { FilterModule } from "./filter/filter.module";

@Module({
  imports: [
    PartModule,
    ArticleModule,
    FilterModule,
    ConfigModule.forRoot(),
    DBModule,
  ],
})
export class AppModule {}
