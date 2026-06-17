import type { IAliasLearner, IAliasRegistry, ResolvedTarget } from "./types";

import { fuzzyMatch, fuzzyMatchBasic } from "./resolver";
import { normalizeKey } from "./utils";

/**
 * In-memory implementation of IAliasLearner.
 *
 * Uses fuzzy matching (substring + Levenshtein) to discover
 * new aliases and registers them in the provided registry.
 *
 * A future DB-backed implementation will conform to the same
 * IAliasLearner interface and persist learned aliases.
 */
export class AliasLearner implements IAliasLearner {
  /**
   * Inline learning: called when Phase 2 misses registry.
   *
   * Runs fuzzy analysis against all product targets and returns
   * the best match if confidence is high enough (score >= 30).
   * Registers the new alias in the registry for future instant hits.
   */
  async tryResolve(
    normalizedKey: string,
    rawKey: string,
    product: string,
    registry: IAliasRegistry
  ): Promise<ResolvedTarget | undefined> {
    const config = registry.getConfig();
    const targets = registry.getProductTargets(product);

    const match = fuzzyMatch(normalizedKey, targets, registry, product, config);

    if (match && match.score >= 30) {
      // Register the alias for future instant hits
      if (match.target.attribute === "_self") {
        await registry.addInfoAlias(product, match.target.info, rawKey);
      } else {
        await registry.addAlias(product, match.target.info, match.target.attribute, rawKey);
      }
      return match.target;
    }

    // Also try BasicInfo targets
    const basicTargets = registry.getBasicTargets();
    const basicMatch = fuzzyMatchBasic(normalizedKey, basicTargets, registry, config);

    if (basicMatch && basicMatch.score >= 30) {
      await registry.addBasicAlias(basicMatch.attribute, rawKey);
      // Return as a pseudo-target (info = "basic")
      return { info: "basic", attribute: basicMatch.attribute };
    }

    return undefined;
  }

  /**
   * Batch learning: analyze many raw records to discover recurring
   * unmapped keys and register them as aliases.
   *
   * @param rawRecords Array of raw key-value scraped records.
   * @param product The product type.
   * @param registry The registry to register into.
   * @param minCount Minimum frequency for a key to be considered (default: 5).
   * @returns Newly learned aliases grouped by info → attribute → alias[].
   */
  async learnFromData(
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
      const aliases =
        target.attribute === "_self"
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
