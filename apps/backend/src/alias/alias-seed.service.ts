import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { SELF_ATTRIBUTE } from "@pc-builder/shared/part";
import defaultAliases from "@pc-builder/shared/part/mapper/aliases.json";
import { normalizeKey } from "@pc-builder/shared/part/mapper/utils";

import AliasEntry from "@/models/alias/AliasEntry.entity";

@Injectable()
export class AliasSeedService {
  private readonly logger = new Logger(AliasSeedService.name);

  constructor(
    @InjectModel(AliasEntry)
    private aliasModel: typeof AliasEntry
  ) {}

  async seedIfNeeded() {
    const count = await this.aliasModel.count();
    if (count === 0) {
      this.logger.log("Alias registry table is empty. Seeding from aliases.json...");
      const entries = this.flattenAliasJson(defaultAliases as Record<string, any>);

      // Insert in chunks of 100 to prevent database driver hangs on large payloads
      const chunkSize = 100;
      for (let i = 0; i < entries.length; i += chunkSize) {
        const chunk = entries.slice(i, i + chunkSize);
        await this.aliasModel.bulkCreate(chunk);
      }

      this.logger.log(`Successfully seeded ${entries.length} alias entries.`);
    }
  }

  private flattenAliasJson(data: Record<string, any>): any[] {
    const entries: any[] = [];
    const seen = new Set<string>();

    const addEntry = (product: string, info: string, attribute: string, alias: string) => {
      const normAlias = normalizeKey(alias);
      if (!normAlias) return;
      const key = `${product}::${info}::${attribute}::${normAlias}`;
      if (seen.has(key)) return;
      seen.add(key);
      entries.push({
        product,
        info,
        attribute,
        alias: normAlias,
        source: "seed",
        frequency: 1,
        confidence: 1.0,
      });
    };

    for (const [topKey, topValue] of Object.entries(data)) {
      if (topKey === "basic") {
        for (const [attr, aliases] of Object.entries(topValue as Record<string, string[]>)) {
          addEntry("basic", "", attr, attr);
          for (const alias of aliases) {
            addEntry("basic", "", attr, alias);
          }
        }
      } else {
        const product = topKey;
        for (const [infoName, infoValue] of Object.entries(
          topValue as Record<string, Record<string, string[]>>
        )) {
          for (const [attrName, aliases] of Object.entries(infoValue)) {
            const selfAliasName = attrName === SELF_ATTRIBUTE ? infoName : attrName;
            addEntry(product, infoName, attrName, selfAliasName);
            for (const alias of aliases) {
              addEntry(product, infoName, attrName, alias);
            }
          }
        }
      }
    }

    return entries;
  }
}
