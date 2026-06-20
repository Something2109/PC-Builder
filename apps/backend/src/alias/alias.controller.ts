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
import * as API from "@pc-builder/shared/API";
import {
  CreateAliasSchema,
  CreateAliasDto,
  UpdateAliasSchema,
  UpdateAliasDto,
  BulkLearnSchema,
  BulkLearnDto,
} from "@pc-builder/shared/part";
import { normalizeKey } from "@pc-builder/shared/part/mapper/utils";
import { Roles } from "@pc-builder/shared/user";

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
  async listAliases(@Query() params: Record<string, string | string[]>) {
    const options = API.toPageOptions(params);
    const { product, info, attribute, alias } = params;

    const where: any = {};
    if (typeof product === "string" && product) where.product = product;
    if (typeof info === "string" && info !== undefined) where.info = info;
    if (typeof attribute === "string" && attribute) where.attribute = attribute;
    if (typeof alias === "string" && alias) {
      const normAlias = normalizeKey(alias);
      where.alias = { [Op.like]: `%${normAlias}%` };
    }

    const validSortFields = [
      "id",
      "product",
      "info",
      "attribute",
      "alias",
      "source",
      "frequency",
      "confidence",
      "created_at",
      "updated_at",
      "createdAt",
      "updatedAt",
    ];

    const order: [string, string][] =
      options.sort_key && validSortFields.includes(options.sort_key)
        ? [[options.sort_key, options.sort_order || "asc"]]
        : [["created_at", "DESC"]];

    const { rows, count } = await this.aliasModel.findAndCountAll({
      where,
      limit: options.limit,
      offset: (options.page - 1) * options.limit,
      order,
    });

    return {
      data: rows,
      total: count,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(count / options.limit),
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
  async updateAlias(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateAliasDto) {
    const entry = await this.aliasModel.findByPk(id);
    if (!entry) {
      throw new NotFoundException("Alias entry not found");
    }

    const product = body.product ?? entry.product;
    const info = body.info !== undefined ? body.info || "" : entry.info;
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
  async listLogs(@Query() params: Record<string, string | string[]>) {
    const options = API.toPageOptions(params);
    const { product, status } = params;

    const where: any = {};
    if (typeof product === "string" && product) where.product = product;
    if (typeof status === "string" && status) where.status = status;

    const validSortFields = [
      "id",
      "product",
      "info",
      "attribute",
      "raw_key",
      "normalized_key",
      "match_type",
      "match_score",
      "status",
      "created_at",
      "updated_at",
      "createdAt",
      "updatedAt",
    ];

    const order: [string, string][] =
      options.sort_key && validSortFields.includes(options.sort_key)
        ? [[options.sort_key, options.sort_order || "asc"]]
        : [["created_at", "DESC"]];

    const { rows, count } = await this.logModel.findAndCountAll({
      where,
      limit: options.limit,
      offset: (options.page - 1) * options.limit,
      order,
    });

    return {
      data: rows,
      total: count,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(count / options.limit),
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
