// ─── Resolved Target Types ───────────────────────────────────────────

/**
 * Represents a resolved target from alias lookup.
 * attribute = "_self" means the raw key maps to the entire info category.
 */
export interface ResolvedTarget {
  info: string;
  attribute: string; // "_self" for info-level match
}

/**
 * A resolved mapping of a raw key to a specific info attribute.
 */
export interface ResolvedMapping {
  rawKey: string;
  info: string;
  attribute: string; // "_self" for info-level match
  matchType: "exact" | "alias" | "fuzzy";
  matchScore: number;
}

/**
 * A resolved mapping of a raw key to a BasicInfo attribute.
 */
export interface BasicMapping {
  rawKey: string;
  attribute: string;
  matchType: "exact" | "alias" | "fuzzy";
  matchScore: number;
}

// ─── Heuristic Config ────────────────────────────────────────────────

export interface HeuristicConfig {
  levenshteinThreshold: number;
  minSubstringLength: number;
}

// ─── Registry Interface ──────────────────────────────────────────────

/**
 * Interface for the alias registry.
 *
 * The registry stores a product-scoped alias mapping:
 *   product → info → attribute → aliases[]
 * with a "_self" key for info-level aliases
 * and a separate "basic" section for BasicInfo fields.
 *
 * Implementations may be backed by JSON files, databases, or in-memory stores.
 */
export interface IAliasRegistry {
  // ── Phase 2 Lookups (O(1) via reverse index) ──

  /**
   * Resolve a normalized raw key against the product-scoped alias index.
   * Returns all matching targets (a key could theoretically match multiple targets,
   * though typically it resolves to one).
   */
  resolveKey(product: string, normalizedKey: string): ResolvedTarget[] | undefined;

  /**
   * Resolve a normalized raw key against the BasicInfo alias index.
   * Returns the BasicInfo attribute name if found.
   */
  resolveBasicKey(normalizedKey: string): string | undefined;

  // ── Forward Lookups (for fuzzy analysis fallback) ──

  /** Get info-level aliases ("_self") for a product's info. */
  getInfoAliases(product: string, info: string): string[];

  /** Get attribute-level aliases for a specific (product, info, attribute). */
  getAttributeAliases(product: string, info: string, attribute: string): string[];

  /** Get aliases for a BasicInfo attribute. */
  getBasicAliases(attribute: string): string[];

  /**
   * Get all target (info, attribute) pairs for a product.
   * Used by fuzzy analysis to iterate over possible targets.
   */
  getProductTargets(product: string): ResolvedTarget[];

  /**
   * Get all BasicInfo attribute names.
   */
  getBasicTargets(): string[];

  // ── Registration (learner integration) ──

  /** Register a new attribute-level alias. */
  addAlias(product: string, info: string, attribute: string, alias: string): Promise<void>;

  /** Register a new info-level alias ("_self"). */
  addInfoAlias(product: string, info: string, alias: string): Promise<void>;

  /** Register a new BasicInfo alias. */
  addBasicAlias(attribute: string, alias: string): Promise<void>;

  // ── Config ──

  getConfig(): HeuristicConfig;
  setConfig(config: Partial<HeuristicConfig>): void;

  /** Reload from the underlying data source. */
  reset(): Promise<void>;
}

// ─── Learner Interface ───────────────────────────────────────────────

/**
 * Interface for the alias auto-learner.
 *
 * The learner analyzes raw crawled data to discover new aliases
 * and registers them into the registry.
 *
 * Implementations may persist learned aliases to databases
 * or keep them in-memory.
 */
export interface IAliasLearner {
  /**
   * Inline learning: called when Phase 2 misses registry.
   * Runs fuzzy analysis against all product targets and returns
   * the best match if confidence is high enough.
   *
   * If a match is found, the learner should register it in the
   * registry so future lookups are instant hits.
   *
   * @param normalizedKey The normalized raw key that missed the registry.
   * @param product The product type being mapped.
   * @param registry The registry to query targets from and register into.
   * @returns The resolved target if a confident match is found.
   */
  tryResolve(
    normalizedKey: string,
    rawKey: string,
    product: string,
    registry: IAliasRegistry
  ): Promise<ResolvedTarget | undefined>;

  /**
   * Batch learning: analyze many raw records to discover recurring
   * unmapped keys and register them as aliases.
   *
   * @param rawRecords Array of raw key-value scraped records.
   * @param product The product type.
   * @param registry The registry to register into.
   * @param minCount Minimum frequency for a key to be considered.
   * @returns Newly learned aliases grouped by info → attribute → alias[].
   */
  learnFromData(
    rawRecords: Record<string, any>[],
    product: string,
    registry: IAliasRegistry,
    minCount?: number
  ): Promise<Record<string, Record<string, string[]>>>;
}
