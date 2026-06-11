import { z } from "zod";

import { resolveConflicts, resolveBasicConflicts } from "./resolver";
import {
  IAliasRegistry,
  IAliasLearner,
  ResolvedMapping,
  BasicMapping,
} from "./types";
import { normalizeKey } from "./utils";

export interface PipelineResult {
  basic: BasicMapping[];
  info: ResolvedMapping[];
  unmatched: string[]; // raw keys that couldn't be resolved
}

export class RawKeyResolver {
  /**
   * Phase 1 + 2: Normalize all raw keys and resolve them against registry/learner.
   */
  static async resolve(
    raw: Record<string, any>,
    product: string,
    registry: IAliasRegistry,
    learner?: IAliasLearner
  ): Promise<PipelineResult> {
    const rawKeys = Object.keys(raw);
    const basicMappings: BasicMapping[] = [];
    const infoMappings: ResolvedMapping[] = [];
    const unmatched: string[] = [];

    for (const rawKey of rawKeys) {
      // Phase 1: Normalize
      const normKey = normalizeKey(rawKey);
      if (!normKey) {
        unmatched.push(rawKey);
        continue;
      }

      // Phase 2a: Try basic reverse index
      const basicHit = registry.resolveBasicKey(normKey);
      if (basicHit) {
        basicMappings.push({
          rawKey,
          attribute: basicHit,
          matchType: "alias",
          matchScore: 90,
        });
        continue;
      }

      // Phase 2b: Try product reverse index
      const productHits = registry.resolveKey(product, normKey);
      if (productHits && productHits.length > 0) {
        for (const hit of productHits) {
          infoMappings.push({
            rawKey,
            info: hit.info,
            attribute: hit.attribute,
            matchType: "alias",
            matchScore: 90,
          });
        }
        continue;
      }

      // Phase 2c: Registry miss -> learner (fuzzy analysis)
      if (learner) {
        const learned = await learner.tryResolve(normKey, rawKey, product, registry);
        if (learned) {
          if (learned.info === "basic") {
            basicMappings.push({
              rawKey,
              attribute: learned.attribute,
              matchType: "fuzzy",
              matchScore: 30,
            });
          } else {
            infoMappings.push({
              rawKey,
              info: learned.info,
              attribute: learned.attribute,
              matchType: "fuzzy",
              matchScore: 30,
            });
          }
          continue;
        }
      }

      // Phase 2d: Unmatched
      unmatched.push(rawKey);
    }

    return { basic: basicMappings, info: infoMappings, unmatched };
  }

  /**
   * Phase 3: Resolve conflicts.
   */
  static resolveConflicts(
    result: PipelineResult,
    raw: Record<string, any>,
    infoSchemas?: Record<string, z.ZodTypeAny>
  ): PipelineResult {
    return {
      basic: resolveBasicConflicts(result.basic, raw),
      info: resolveConflicts(result.info, raw, infoSchemas),
      unmatched: result.unmatched,
    };
  }
}
