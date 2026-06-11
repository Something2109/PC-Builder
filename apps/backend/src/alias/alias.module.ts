import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import AliasEntry from "@/models/alias/AliasEntry.entity";
import AliasLearnerLog from "@/models/alias/AliasLearnerLog.entity";

import { AliasSeedService } from "./alias-seed.service";
import { AliasController } from "./alias.controller";
import { DbAliasLearner } from "./db-alias-learner.service";
import { DbAliasRegistry } from "./db-alias-registry.service";

@Module({
  imports: [
    SequelizeModule.forFeature([AliasEntry, AliasLearnerLog]),
  ],
  controllers: [AliasController],
  providers: [
    DbAliasRegistry,
    DbAliasLearner,
    AliasSeedService,
  ],
  exports: [
    DbAliasRegistry,
    DbAliasLearner,
  ],
})
export class AliasModule {}
