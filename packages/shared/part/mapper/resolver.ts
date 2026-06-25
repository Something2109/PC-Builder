import { z } from "zod";

import { parseSingleValue } from "./parser";
import {
  IAliasRegistry,
  ResolvedTarget,
  ResolvedMapping,
  BasicMapping,
  HeuristicConfig,
} from "./types";
import { normalizeKey, getLevenshteinDistance, getInnerSchema } from "./utils";

// ─── Fuzzy Matcher ───────────────────────────────────────────────────

/**
 * Fuzzy matching result with confidence score.
 */
interface FuzzyMatch {
  target: ResolvedTarget;
  score: number;
}

/**
 * Runs fuzzy analysis (substring → Levenshtein) against a list of targets
 * to find the best match for a normalized key.
 *
 * This is used when the registry lookup misses. If a match is found
 * with sufficient confidence, the caller (learner) should register it
 * for future instant hits.
 *
 * @param normalizedKey The normalized raw key to match.
 * @param targets All possible (info, attribute) targets for the product.
 * @param registry The registry to read alias lists from (for alias substring/lev matching).
 * @param product The product type.
 * @param config Heuristic configuration (thresholds).
 * @returns The best fuzzy match if confidence is high enough, or undefined.
 */
export function fuzzyMatch(
  normalizedKey: string,
  targets: ResolvedTarget[],
  registry: IAliasRegistry,
  product: string,
  config: HeuristicConfig
): FuzzyMatch | undefined {
  let bestMatch: FuzzyMatch | undefined;

  for (const target of targets) {
    const normTarget =
      target.attribute === "_self" ? normalizeKey(target.info) : normalizeKey(target.attribute);

    const score = computeFuzzyScore(normalizedKey, normTarget, target, registry, product, config);

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { target, score };
    }
  }

  return bestMatch;
}

/**
 * Runs fuzzy analysis against BasicInfo targets.
 */
export function fuzzyMatchBasic(
  normalizedKey: string,
  basicTargets: string[],
  registry: IAliasRegistry,
  config: HeuristicConfig
): { attribute: string; score: number } | undefined {
  let bestMatch: { attribute: string; score: number } | undefined;

  for (const attribute of basicTargets) {
    const normTarget = normalizeKey(attribute);
    const score = computeBasicFuzzyScore(normalizedKey, normTarget, attribute, registry, config);

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { attribute, score };
    }
  }

  return bestMatch;
}

/**
 * Computes a fuzzy confidence score for a normalized raw key
 * against a specific target attribute.
 *
 * Scoring tiers:
 *   - Exact target name match: 100
 *   - Exact alias match: 90 - aliasIndex
 *   - Substring on target name: 60
 *   - Substring on alias: 50 - aliasIndex
 *   - Levenshtein on target name: 40 - distance
 *   - Levenshtein on alias: 30 - distance
 *
 * Returns 0 if no match found.
 */
function computeFuzzyScore(
  normalizedKey: string,
  normTarget: string,
  target: ResolvedTarget,
  registry: IAliasRegistry,
  product: string,
  config: HeuristicConfig
): number {
  // 1. Exact match on target name
  if (normalizedKey === normTarget) {
    return 100;
  }

  // Get aliases for this target
  const aliases =
    target.attribute === "_self"
      ? registry.getInfoAliases(product, target.info)
      : registry.getAttributeAliases(product, target.info, target.attribute);

  const normAliases = aliases.map(normalizeKey);

  // 2. Exact match on alias
  const aliasIndex = normAliases.indexOf(normalizedKey);
  if (aliasIndex !== -1) {
    return 90 - aliasIndex;
  }

  // 3. Substring match on target name
  if (
    normalizedKey.length > config.minSubstringLength &&
    normTarget.length > config.minSubstringLength &&
    (normalizedKey.includes(normTarget) || normTarget.includes(normalizedKey))
  ) {
    return 60;
  }

  // 4. Substring match on alias
  const matchedAliasIndex = normAliases.findIndex(
    (a) =>
      a.length > config.minSubstringLength &&
      normalizedKey.length > config.minSubstringLength &&
      (normalizedKey.includes(a) || a.includes(normalizedKey))
  );
  if (matchedAliasIndex !== -1) {
    return 50 - matchedAliasIndex;
  }

  // 5. Levenshtein match on target name
  if (Math.abs(normalizedKey.length - normTarget.length) <= 3) {
    const dist = getLevenshteinDistance(normalizedKey, normTarget);
    if (dist <= config.levenshteinThreshold) {
      return 40 - dist;
    }
  }

  // 6. Levenshtein match on aliases
  let bestAliasDist = Infinity;
  for (const alias of normAliases) {
    if (Math.abs(normalizedKey.length - alias.length) <= 3) {
      const dist = getLevenshteinDistance(normalizedKey, alias);
      if (dist < bestAliasDist) {
        bestAliasDist = dist;
      }
    }
  }
  if (bestAliasDist <= config.levenshteinThreshold) {
    return 30 - bestAliasDist;
  }

  return 0;
}

/**
 * Computes fuzzy score for BasicInfo targets.
 */
function computeBasicFuzzyScore(
  normalizedKey: string,
  normTarget: string,
  attribute: string,
  registry: IAliasRegistry,
  config: HeuristicConfig
): number {
  if (normalizedKey === normTarget) {
    return 100;
  }

  const aliases = registry.getBasicAliases(attribute);
  const normAliases = aliases.map(normalizeKey);

  const aliasIndex = normAliases.indexOf(normalizedKey);
  if (aliasIndex !== -1) {
    return 90 - aliasIndex;
  }

  if (
    normalizedKey.length > config.minSubstringLength &&
    normTarget.length > config.minSubstringLength &&
    (normalizedKey.includes(normTarget) || normTarget.includes(normalizedKey))
  ) {
    return 60;
  }

  const matchedAliasIndex = normAliases.findIndex(
    (a) =>
      a.length > config.minSubstringLength &&
      normalizedKey.length > config.minSubstringLength &&
      (normalizedKey.includes(a) || a.includes(normalizedKey))
  );
  if (matchedAliasIndex !== -1) {
    return 50 - matchedAliasIndex;
  }

  if (Math.abs(normalizedKey.length - normTarget.length) <= 3) {
    const dist = getLevenshteinDistance(normalizedKey, normTarget);
    if (dist <= config.levenshteinThreshold) {
      return 40 - dist;
    }
  }

  let bestAliasDist = Infinity;
  for (const alias of normAliases) {
    if (Math.abs(normalizedKey.length - alias.length) <= 3) {
      const dist = getLevenshteinDistance(normalizedKey, alias);
      if (dist < bestAliasDist) {
        bestAliasDist = dist;
      }
    }
  }
  if (bestAliasDist <= config.levenshteinThreshold) {
    return 30 - bestAliasDist;
  }

  return 0;
}

// ─── Conflict Resolver ───────────────────────────────────────────────

/** Placeholder values that indicate missing/empty data. */
const PLACEHOLDER_VALUES = new Set([
  "",
  "n/a",
  "na",
  "-",
  "none",
  "null",
  "undefined",
  "tbd",
  "tba",
  "unknown",
]);

/**
 * Scores the quality of a raw value for conflict resolution.
 *
 * Scoring:
 *   - Non-null/non-undefined: +20
 *   - Non-placeholder: +30
 *   - Successfully parses against Zod schema: +50
 *
 * @param rawValue The raw value to score.
 * @param targetAttr The target attribute name (used for parse context).
 * @param schema The Zod schema to validate against (optional).
 * @returns A quality score (0-100).
 */
export function scoreValueQuality(
  rawValue: any,
  targetAttr: string,
  schema?: z.ZodTypeAny
): number {
  let score = 0;

  if (rawValue === undefined || rawValue === null) {
    return score;
  }
  score += 20;

  const strVal = String(rawValue).trim().toLowerCase();
  if (!PLACEHOLDER_VALUES.has(strVal)) {
    score += 30;

    if (schema) {
      try {
        const parsed = parseSingleValue(rawValue, targetAttr, schema);
        if (parsed !== undefined) {
          score += 50;
        }
      } catch {
        // Parse failure, no bonus
      }
    }
  }

  return score;
}

/**
 * Resolves conflicts in a set of info-level resolved mappings.
 *
 * Rules:
 *   - Multiple raw keys mapping to the same (info, attribute) where
 *     attribute !== "_self" is a CONFLICT. Resolve by picking the
 *     candidate with the highest value quality score.
 *   - Multiple raw keys mapping to (info, "_self") is NOT a conflict,
 *     as each may contain a different section of a multi-value table
 *     (e.g. "USB front" and "USB back").
 *   - Unmatched attributes are already excluded (they won't be in the mappings).
 *
 * @param mappings The resolved mappings from Phase 2.
 * @param raw The original raw record (for reading values).
 * @param infoSchemas A map of info name → Zod schema, used for value quality scoring.
 * @returns The deduplicated mappings with conflicts resolved.
 */
export function resolveConflicts(
  mappings: ResolvedMapping[],
  raw: Record<string, any>,
  infoSchemas?: Record<string, z.ZodTypeAny>
): ResolvedMapping[] {
  // Group by (info, attribute)
  const groups = new Map<string, ResolvedMapping[]>();

  for (const mapping of mappings) {
    const key = `${mapping.info}::${mapping.attribute}`;
    const group = groups.get(key);
    if (group) {
      group.push(mapping);
    } else {
      groups.set(key, [mapping]);
    }
  }

  const resolved: ResolvedMapping[] = [];

  for (const [_groupKey, group] of groups) {
    // _self entries are never conflicts — keep all
    if (group[0].attribute === "_self") {
      resolved.push(...group);
      continue;
    }

    // Single entry — no conflict
    if (group.length === 1) {
      resolved.push(group[0]);
      continue;
    }

    const attrSchema = infoSchemas?.[group[0].info];
    const unwrappedInfo = attrSchema ? getInnerSchema(attrSchema) : undefined;
    const isArray = unwrappedInfo?.constructor?.name === "ZodArray";

    if (isArray) {
      // For multi-value tables, multiple raw keys for the same discrete attribute
      // are not conflicts — keep all of them so we can build multiple rows.
      resolved.push(...group);
      continue;
    }

    // Multiple entries for the same (info, attr) — resolve by value quality
    let bestCandidate = group[0];
    let bestScore = -1;

    for (const candidate of group) {
      const rawValue = raw[candidate.rawKey];

      // Combine match score and value quality
      const valueQuality = scoreValueQuality(rawValue, candidate.attribute, attrSchema);
      const totalScore = candidate.matchScore + valueQuality;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestCandidate = candidate;
      }
    }

    resolved.push(bestCandidate);
  }

  return resolved;
}

/**
 * Resolves conflicts in BasicInfo mappings.
 * Same logic: multiple raw keys for the same basic attribute
 * are resolved by value quality.
 */
export function resolveBasicConflicts(
  mappings: BasicMapping[],
  raw: Record<string, any>,
  basicSchema?: z.ZodTypeAny
): BasicMapping[] {
  const groups = new Map<string, BasicMapping[]>();

  for (const mapping of mappings) {
    const group = groups.get(mapping.attribute);
    if (group) {
      group.push(mapping);
    } else {
      groups.set(mapping.attribute, [mapping]);
    }
  }

  const resolved: BasicMapping[] = [];

  for (const [, group] of groups) {
    if (group.length === 1) {
      resolved.push(group[0]);
      continue;
    }

    let bestCandidate = group[0];
    let bestScore = -1;

    for (const candidate of group) {
      const rawValue = raw[candidate.rawKey];
      const valueQuality = scoreValueQuality(rawValue, candidate.attribute, basicSchema);
      const totalScore = candidate.matchScore + valueQuality;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestCandidate = candidate;
      }
    }

    resolved.push(bestCandidate);
  }

  return resolved;
}
