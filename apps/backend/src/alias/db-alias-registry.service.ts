import { Injectable, OnModuleInit } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { InjectModel } from "@nestjs/sequelize";

import AliasEntry from "@/models/alias/AliasEntry.entity";
import { IAliasRegistry, ResolvedTarget, HeuristicConfig } from "@/utils/part";
import { normalizeKey } from "@/utils/part/mapper/utils";

import { AliasSeedService } from "./alias-seed.service";

@Injectable()
export class DbAliasRegistry implements IAliasRegistry, OnModuleInit {
  // In-memory cache
  private basicForward: Record<string, string[]> = {};
  private productForward: Record<string, Record<string, Record<string, string[]>>> = {};

  private basicReverse: Map<string, string> = new Map();
  private productReverse: Record<string, Map<string, ResolvedTarget[]>> = {};

  private productTargetsCache: Record<string, ResolvedTarget[]> = {};

  private config: HeuristicConfig = {
    levenshteinThreshold: 2,
    minSubstringLength: 2,
  };

  private seedService!: AliasSeedService;

  constructor(
    @InjectModel(AliasEntry)
    private aliasModel: typeof AliasEntry,
    private moduleRef: ModuleRef
  ) {}

  async onModuleInit(): Promise<void> {
    this.seedService = this.moduleRef.get(AliasSeedService, { strict: false });
    await this.seedService.seedIfNeeded();
    await this.loadFromDb();
  }

  // ── Phase 2 Lookups ──────────────────────────────────────────────

  public resolveKey(product: string, normalizedKey: string): ResolvedTarget[] | undefined {
    const index = this.productReverse[product];
    if (!index) return undefined;
    return index.get(normalizedKey);
  }

  public resolveBasicKey(normalizedKey: string): string | undefined {
    return this.basicReverse.get(normalizedKey);
  }

  // ── Forward Lookups ──────────────────────────────────────────────

  public getInfoAliases(product: string, info: string): string[] {
    return this.productForward[product]?.[info]?.["_self"] || [];
  }

  public getAttributeAliases(product: string, info: string, attribute: string): string[] {
    return this.productForward[product]?.[info]?.[attribute] || [];
  }

  public getBasicAliases(attribute: string): string[] {
    return this.basicForward[attribute] || [];
  }

  public getProductTargets(product: string): ResolvedTarget[] {
    if (this.productTargetsCache[product]) {
      return this.productTargetsCache[product];
    }

    const targets: ResolvedTarget[] = [];
    const infos = this.productForward[product];
    if (infos) {
      for (const [infoName, attrs] of Object.entries(infos)) {
        for (const attrName of Object.keys(attrs)) {
          targets.push({ info: infoName, attribute: attrName });
        }
      }
    }

    this.productTargetsCache[product] = targets;
    return targets;
  }

  public getBasicTargets(): string[] {
    return Object.keys(this.basicForward);
  }

  // ── Registration ─────────────────────────────────────────────────

  public async addAlias(
    product: string,
    info: string,
    attribute: string,
    alias: string
  ): Promise<void> {
    const normAlias = normalizeKey(alias);
    if (!normAlias) return;

    // 1. Persist to DB using upsert
    await this.aliasModel.upsert({
      product,
      info,
      attribute,
      alias: normAlias,
      source: "learned",
      frequency: 1,
      confidence: 1.0,
    });

    // 2. Update in-memory cache
    if (!this.productForward[product]) this.productForward[product] = {};
    if (!this.productForward[product][info]) this.productForward[product][info] = {};
    if (!this.productForward[product][info][attribute])
      this.productForward[product][info][attribute] = [];

    if (!this.productForward[product][info][attribute].includes(normAlias)) {
      this.productForward[product][info][attribute].push(normAlias);
    }

    this.addToReverseIndex(product, normAlias, { info, attribute });
    delete this.productTargetsCache[product];
  }

  public async addInfoAlias(product: string, info: string, alias: string): Promise<void> {
    await this.addAlias(product, info, "_self", alias);
  }

  public async addBasicAlias(attribute: string, alias: string): Promise<void> {
    const normAlias = normalizeKey(alias);
    if (!normAlias) return;

    // 1. Persist to DB using upsert
    await this.aliasModel.upsert({
      product: "basic",
      info: "",
      attribute,
      alias: normAlias,
      source: "learned",
      frequency: 1,
      confidence: 1.0,
    });

    // 2. Update in-memory cache
    if (!this.basicForward[attribute]) this.basicForward[attribute] = [];
    if (!this.basicForward[attribute].includes(normAlias)) {
      this.basicForward[attribute].push(normAlias);
    }

    this.basicReverse.set(normAlias, attribute);
  }

  // ── Config ───────────────────────────────────────────────────────

  public getConfig(): HeuristicConfig {
    return { ...this.config };
  }

  public setConfig(newConfig: Partial<HeuristicConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // ── Reset & Build ────────────────────────────────────────────────

  public async reset(): Promise<void> {
    await this.loadFromDb();
  }

  private async loadFromDb(): Promise<void> {
    const entries = await this.aliasModel.findAll();

    this.basicForward = {};
    this.basicReverse.clear();
    this.productForward = {};
    this.productReverse = {};
    this.productTargetsCache = {};

    for (const entry of entries) {
      const { product, info, attribute, alias } = entry;
      const normAlias = normalizeKey(alias);
      if (!normAlias) continue;

      if (product === "basic") {
        if (!this.basicForward[attribute]) {
          this.basicForward[attribute] = [];
        }
        if (!this.basicForward[attribute].includes(alias)) {
          this.basicForward[attribute].push(alias);
        }

        this.basicReverse.set(normAlias, attribute);
        this.basicReverse.set(normalizeKey(attribute), attribute);
      } else {
        if (!this.productForward[product]) this.productForward[product] = {};
        if (!this.productForward[product][info]) this.productForward[product][info] = {};
        if (!this.productForward[product][info][attribute]) {
          this.productForward[product][info][attribute] = [];
        }
        if (!this.productForward[product][info][attribute].includes(alias)) {
          this.productForward[product][info][attribute].push(alias);
        }

        const target = { info, attribute };
        this.addToReverseIndex(product, normAlias, target);

        const normAttr = attribute === "_self" ? normalizeKey(info) : normalizeKey(attribute);
        this.addToReverseIndex(product, normAttr, target);
      }
    }
  }

  private addToReverseIndex(product: string, normAlias: string, target: ResolvedTarget): void {
    if (!this.productReverse[product]) {
      this.productReverse[product] = new Map();
    }

    const existing = this.productReverse[product].get(normAlias);
    if (existing) {
      const isDuplicate = existing.some(
        (t) => t.info === target.info && t.attribute === target.attribute
      );
      if (!isDuplicate) {
        existing.push(target);
      }
    } else {
      this.productReverse[product].set(normAlias, [target]);
    }
  }
}
