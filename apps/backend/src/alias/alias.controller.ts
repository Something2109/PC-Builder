import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Role } from "src/utils/role/role.decorator";
import { ZodValidationPipe } from "src/utils/utils.modules";

import AliasEntry from "@/models/alias/AliasEntry.entity";
import AliasLearnerLog from "@/models/alias/AliasLearnerLog.entity";
import {
  CreateAliasSchema,
  CreateAliasDto,
  UpdateAliasSchema,
  UpdateAliasDto,
  BulkLearnSchema,
  BulkLearnDto,
} from "@/utils/part";
import { normalizeKey } from "@/utils/part/mapper/utils";
import { Roles } from "@/utils/user";

import { DbAliasLearner } from "./db-alias-learner.service";
import { DbAliasRegistry } from "./db-alias-registry.service";


@Controller("alias")
export class AliasController {
  constructor(
    @InjectModel(AliasEntry)
    private readonly aliasModel: typeof AliasEntry,
    @InjectModel(AliasLearnerLog)
    private readonly logModel: typeof AliasLearnerLog,
    private readonly registry: DbAliasRegistry,
    private readonly learner: DbAliasLearner
  ) {}

  // ── Alias Entries CRUD ─────────────────────────────────────────────

  @Get()
  async listAliases(
    @Query("page") page = "1",
    @Query("limit") limit = "100",
    @Query("product") product?: string,
    @Query("info") info?: string,
    @Query("attribute") attribute?: string,
    @Query("alias") alias?: string
  ) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(1000, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (product) where.product = product;
    if (info !== undefined) where.info = info;
    if (attribute) where.attribute = attribute;
    if (alias) {
      const normAlias = normalizeKey(alias);
      where.alias = { [Op.like]: `%${normAlias}%` };
    }

    const { rows, count } = await this.aliasModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [["created_at", "DESC"]],
    });

    return {
      data: rows,
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
    };
  }

  @Get(":id")
  async getAlias(@Param("id", ParseIntPipe) id: number) {
    const entry = await this.aliasModel.findByPk(id);
    if (!entry) {
      throw new NotFoundException("Alias entry not found");
    }
    return entry;
  }

  @Role(Roles.ADMIN)
  @Post()
  @UsePipes(new ZodValidationPipe(CreateAliasSchema))
  async createAlias(@Body() body: CreateAliasDto) {
    const normAlias = normalizeKey(body.alias);
    if (!normAlias) {
      throw new BadRequestException("Alias key cannot be empty after normalization");
    }

    const infoVal = body.info || "";

    // Prevent duplicate entries
    const existing = await this.aliasModel.findOne({
      where: {
        product: body.product,
        info: infoVal,
        attribute: body.attribute,
        alias: normAlias,
      },
    });

    if (existing) {
      throw new BadRequestException("Alias entry already exists.");
    }

    const created = await this.aliasModel.create({
      ...body,
      info: infoVal,
      alias: normAlias,
    });

    // Refresh memory cache in DbAliasRegistry
    await this.registry.reset();

    return created;
  }

  @Role(Roles.ADMIN)
  @Put(":id")
  @UsePipes(new ZodValidationPipe(UpdateAliasSchema))
  async updateAlias(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateAliasDto
  ) {
    const entry = await this.aliasModel.findByPk(id);
    if (!entry) {
      throw new NotFoundException("Alias entry not found");
    }

    const product = body.product ?? entry.product;
    const info = body.info !== undefined ? (body.info || "") : entry.info;
    const attribute = body.attribute ?? entry.attribute;
    const alias = body.alias ? normalizeKey(body.alias) : entry.alias;

    if (!alias) {
      throw new BadRequestException("Alias key cannot be empty after normalization");
    }

    // Check duplicate check on update
    const duplicate = await this.aliasModel.findOne({
      where: {
        id: { [Op.ne]: id },
        product,
        info,
        attribute,
        alias,
      },
    });

    if (duplicate) {
      throw new BadRequestException("Another alias entry with these attributes already exists.");
    }

    await entry.update({
      ...body,
      info,
      alias,
    });

    // Refresh memory cache in DbAliasRegistry
    await this.registry.reset();

    return entry;
  }

  @Role(Roles.ADMIN)
  @Delete(":id")
  async deleteAlias(@Param("id", ParseIntPipe) id: number) {
    const entry = await this.aliasModel.findByPk(id);
    if (!entry) {
      throw new NotFoundException("Alias entry not found");
    }

    await entry.destroy();

    // Refresh memory cache in DbAliasRegistry
    await this.registry.reset();

    return { success: true };
  }

  // ── Learner Logs and Controls ──────────────────────────────────────

  @Role(Roles.ADMIN)
  @Get("learner/logs")
  async listLogs(
    @Query("page") page = "1",
    @Query("limit") limit = "50",
    @Query("product") product?: string,
    @Query("status") status?: string
  ) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(500, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (product) where.product = product;
    if (status) where.status = status;

    const { rows, count } = await this.logModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [["created_at", "DESC"]],
    });

    return {
      data: rows,
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
    };
  }

  @Role(Roles.ADMIN)
  @Post("learner/logs/:id/approve")
  async approveLog(@Param("id", ParseIntPipe) id: number) {
    const log = await this.logModel.findByPk(id);
    if (!log) {
      throw new NotFoundException("Learner log entry not found");
    }

    log.status = "approved";
    await log.save();

    // Register alias in DB (DbAliasRegistry handles database write and cache update)
    if (log.attribute === "_self") {
      await this.registry.addInfoAlias(log.product, log.info, log.raw_key);
    } else {
      await this.registry.addAlias(log.product, log.info, log.attribute, log.raw_key);
    }

    return { success: true, log };
  }

  @Role(Roles.ADMIN)
  @Post("learner/logs/:id/reject")
  async rejectLog(@Param("id", ParseIntPipe) id: number) {
    const log = await this.logModel.findByPk(id);
    if (!log) {
      throw new NotFoundException("Learner log entry not found");
    }

    log.status = "rejected";
    await log.save();

    // Evict corresponding alias from DB (it might have been auto-added on learning hit)
    const normAlias = normalizeKey(log.raw_key);
    await this.aliasModel.destroy({
      where: {
        product: log.product,
        info: log.info,
        attribute: log.attribute,
        alias: normAlias,
      },
    });

    // Invalidate registry memory cache since we deleted the alias entry
    await this.registry.reset();

    return { success: true, log };
  }

  @Role(Roles.ADMIN)
  @Post("learner/learn")
  @UsePipes(new ZodValidationPipe(BulkLearnSchema))
  async bulkLearn(@Body() body: BulkLearnDto) {
    const newlyLearned = await this.learner.learnFromData(
      body.rawRecords,
      body.product,
      this.registry,
      body.minCount
    );

    return {
      success: true,
      newlyLearned,
    };
  }
}
