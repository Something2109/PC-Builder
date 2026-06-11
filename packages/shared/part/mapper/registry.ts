import type {
  IAliasRegistry,
  ResolvedTarget,
  HeuristicConfig,
} from "./types";

import defaultAliases from "./aliases.json";
import { normalizeKey } from "./utils";

/**
 * In-memory implementation of IAliasRegistry.
 * 
 * Loads aliases from the JSON config and builds a reverse index
 * for O(1) key resolution. This implementation stores everything in memory;
 * a future DB-backed implementation will conform to the same IAliasRegistry interface.
 */
export class AliasRegistry implements IAliasRegistry {
  private static instance: AliasRegistry;

  // Forward maps
  private basicForward: Record<string, string[]> = {};
  private productForward: Record<string, Record<string, Record<string, string[]>>> = {};

  // Reverse indices (normalizedAlias → target)
  private basicReverse: Map<string, string> = new Map();
  private productReverse: Record<string, Map<string, ResolvedTarget[]>> = {};

  // Cached product targets list
  private productTargetsCache: Record<string, ResolvedTarget[]> = {};

  private config: HeuristicConfig = {
    levenshteinThreshold: 2,
    minSubstringLength: 2,
  };

  private constructor() {
    this.resetSync();
  }

  public static getInstance(): AliasRegistry {
    if (!AliasRegistry.instance) {
      AliasRegistry.instance = new AliasRegistry();
    }
    return AliasRegistry.instance;
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

  public async addAlias(product: string, info: string, attribute: string, alias: string): Promise<void> {
    const normAlias = normalizeKey(alias);
    if (!normAlias) return;

    // Forward
    if (!this.productForward[product]) this.productForward[product] = {};
    if (!this.productForward[product][info]) this.productForward[product][info] = {};
    if (!this.productForward[product][info][attribute]) this.productForward[product][info][attribute] = [];

    if (!this.productForward[product][info][attribute].includes(alias)) {
      this.productForward[product][info][attribute].push(alias);
    }

    // Reverse
    this.addToReverseIndex(product, normAlias, { info, attribute });

    // Invalidate targets cache
    delete this.productTargetsCache[product];
  }

  public async addInfoAlias(product: string, info: string, alias: string): Promise<void> {
    await this.addAlias(product, info, "_self", alias);
  }

  public async addBasicAlias(attribute: string, alias: string): Promise<void> {
    const normAlias = normalizeKey(alias);
    if (!normAlias) return;

    if (!this.basicForward[attribute]) this.basicForward[attribute] = [];
    if (!this.basicForward[attribute].includes(alias)) {
      this.basicForward[attribute].push(alias);
    }

    if (!this.basicReverse.has(normAlias)) {
      this.basicReverse.set(normAlias, attribute);
    }
  }

  // ── Config ───────────────────────────────────────────────────────

  public getConfig(): HeuristicConfig {
    return { ...this.config };
  }

  public setConfig(newConfig: Partial<HeuristicConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // ── Reset & Build ────────────────────────────────────────────────

  private resetSync(): void {
    this.basicForward = {};
    this.basicReverse = new Map();
    this.productForward = {};
    this.productReverse = {};
    this.productTargetsCache = {};
    this.config = {
      levenshteinThreshold: 2,
      minSubstringLength: 2,
    };

    this.loadFromJson(defaultAliases as Record<string, any>);
  }

  public async reset(): Promise<void> {
    this.resetSync();
  }

  /**
   * Loads aliases from a structured JSON object and builds indices.
   */
  private loadFromJson(data: Record<string, any>): void {
    for (const [topKey, topValue] of Object.entries(data)) {
      if (topKey === "basic") {
        // BasicInfo aliases
        for (const [attr, aliases] of Object.entries(topValue as Record<string, string[]>)) {
          this.basicForward[attr] = [...aliases];

          // Add target name itself to reverse index
          this.basicReverse.set(normalizeKey(attr), attr);

          // Add each alias to reverse index
          for (const alias of aliases) {
            const normAlias = normalizeKey(alias);
            if (!this.basicReverse.has(normAlias)) {
              this.basicReverse.set(normAlias, attr);
            }
          }
        }
      } else {
        // Product-scoped aliases: product → info → attribute → aliases[]
        const product = topKey;
        this.productForward[product] = {};
        this.productReverse[product] = new Map();

        for (const [infoName, infoValue] of Object.entries(topValue as Record<string, Record<string, string[]>>)) {
          this.productForward[product][infoName] = {};

          for (const [attrName, aliases] of Object.entries(infoValue)) {
            this.productForward[product][infoName][attrName] = [...aliases];

            // Add target attribute name itself to reverse index
            // (so "total_cores" matches "total_cores" exactly)
            const normAttr = attrName === "_self"
              ? normalizeKey(infoName)
              : normalizeKey(attrName);
            this.addToReverseIndex(product, normAttr, { info: infoName, attribute: attrName });

            // Add each alias to reverse index
            for (const alias of aliases) {
              const normAlias = normalizeKey(alias);
              this.addToReverseIndex(product, normAlias, { info: infoName, attribute: attrName });
            }
          }
        }
      }
    }
  }

  /**
   * Adds a (normalizedAlias → target) entry to the product reverse index.
   * Multiple targets per alias are allowed (a raw key might match multiple targets).
   */
  private addToReverseIndex(product: string, normAlias: string, target: ResolvedTarget): void {
    if (!this.productReverse[product]) {
      this.productReverse[product] = new Map();
    }

    const existing = this.productReverse[product].get(normAlias);
    if (existing) {
      // Avoid duplicates
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

  /**
   * Returns the full alias data for debugging/export.
   */
  public getAll(product?: string): any {
    if (product) {
      return {
        product: this.productForward[product] || {},
      };
    }
    return {
      basic: { ...this.basicForward },
      products: { ...this.productForward },
    };
  }
}
