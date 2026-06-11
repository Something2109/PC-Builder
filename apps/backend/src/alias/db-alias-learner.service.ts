import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import AliasLearnerLog from "@/models/alias/AliasLearnerLog.entity";
import { IAliasLearner, IAliasRegistry, ResolvedTarget } from "@/utils/part";
import { fuzzyMatch, fuzzyMatchBasic } from "@/utils/part/mapper/resolver";
import { normalizeKey } from "@/utils/part/mapper/utils";

@Injectable()
export class DbAliasLearner implements IAliasLearner {
  constructor(
    @InjectModel(AliasLearnerLog)
    private logModel: typeof AliasLearnerLog
  ) {}

  public async tryResolve(
    normalizedKey: string,
    rawKey: string,
    product: string,
    registry: IAliasRegistry
  ): Promise<ResolvedTarget | undefined> {
    const config = registry.getConfig();
    const targets = registry.getProductTargets(product);

    const match = fuzzyMatch(normalizedKey, targets, registry, product, config);

    if (match && match.score >= 30) {
      // Register the alias for future instant hits (persists to DB via registry)
      if (match.target.attribute === "_self") {
        await registry.addInfoAlias(product, match.target.info, rawKey);
      } else {
        await registry.addAlias(product, match.target.info, match.target.attribute, rawKey);
      }

      // Log the learning event
      await this.logModel.create({
        product,
        info: match.target.info,
        attribute: match.target.attribute,
        raw_key: rawKey,
        normalized_key: normalizedKey,
        match_type: "fuzzy",
        match_score: match.score,
        status: "auto",
      });

      return match.target;
    }

    // Also try BasicInfo targets
    const basicTargets = registry.getBasicTargets();
    const basicMatch = fuzzyMatchBasic(normalizedKey, basicTargets, registry, config);

    if (basicMatch && basicMatch.score >= 30) {
      await registry.addBasicAlias(basicMatch.attribute, rawKey);

      // Log the learning event
      await this.logModel.create({
        product: "basic",
        info: "",
        attribute: basicMatch.attribute,
        raw_key: rawKey,
        normalized_key: normalizedKey,
        match_type: "fuzzy_basic",
        match_score: basicMatch.score,
        status: "auto",
      });

      // Return as a pseudo-target (info = "basic")
      return { info: "basic", attribute: basicMatch.attribute };
    }

    return undefined;
  }

  public async learnFromData(
    rawRecords: Record<string, any>[],
    product: string,
    registry: IAliasRegistry,
    minCount: number = 5
  ): Promise<Record<string, Record<string, string[]>>> {
    // 1. Count raw key frequencies
    const keyCounts: Record<string, number> = {};
    for (const record of rawRecords) {
      if (!record || typeof record !== "object") continue;
      for (const key of Object.keys(record)) {
        keyCounts[key] = (keyCounts[key] || 0) + 1;
      }
    }

    // 2. Track which normalized keys are already covered
    const coveredKeys = new Set<string>();
    const targets = registry.getProductTargets(product);
    for (const target of targets) {
      coveredKeys.add(normalizeKey(target.attribute === "_self" ? target.info : target.attribute));
      const aliases = target.attribute === "_self"
        ? registry.getInfoAliases(product, target.info)
        : registry.getAttributeAliases(product, target.info, target.attribute);
      for (const alias of aliases) {
        coveredKeys.add(normalizeKey(alias));
      }
    }

    const basicTargets = registry.getBasicTargets();
    for (const attr of basicTargets) {
      coveredKeys.add(normalizeKey(attr));
      for (const alias of registry.getBasicAliases(attr)) {
        coveredKeys.add(normalizeKey(alias));
      }
    }

    const newlyLearned: Record<string, Record<string, string[]>> = {};

    // 3. Analyze frequent keys
    for (const [rawKey, count] of Object.entries(keyCounts)) {
      if (count < minCount) continue;

      const normKey = normalizeKey(rawKey);
      if (coveredKeys.has(normKey)) continue;

      const resolved = await this.tryResolve(normKey, rawKey, product, registry);

      if (resolved && resolved.info !== "basic") {
        if (!newlyLearned[resolved.info]) {
          newlyLearned[resolved.info] = {};
        }
        if (!newlyLearned[resolved.info][resolved.attribute]) {
          newlyLearned[resolved.info][resolved.attribute] = [];
        }
        newlyLearned[resolved.info][resolved.attribute].push(rawKey);
        coveredKeys.add(normKey);
      }
    }

    return newlyLearned;
  }
}
