/* eslint-disable @typescript-eslint/no-namespace */

import ProductCompatibleRule from "./rule/product/ProductCompatibleRule";
import CPUMainboardSocketRule from "./rule/socket/CPUMainboardSocketRule";
import GPURule from "./rule/GPURule";
import MainboardAIOSocketRule from "./rule/socket/MainboardAIOSocketRule";
import MainboardCPUBlockSocketRule from "./rule/socket/MainboardCPUBlockSocketRule";
import MainboardCoolerSocketRule from "./rule/socket/MainboardCoolerSocketRule";
import CaseMainboardRule from "./rule/CaseMainboardRule";
import CasePSURule from "./rule/CasePSURule";
import PCIeRule from "./rule/PCIeRule";
import RAMRule from "./rule/RAMRule";
import {
  BuildAttributeMapping,
  BuildValidateResult,
  BuildFilterAttributes,
  BuildPartList,
  BuildPartSchema,
  BuildPartDetails,
  BuildValidateAttributes,
  ProductRule,
  AttributeRule,
} from "./utils";
import Part, { Information } from "../part";
import { Infos, Products } from "../part";

const ProductRuleList: AttributeRule<BuildAttributeMapping>[] = [
  CPUMainboardSocketRule,
  GPURule,
  MainboardAIOSocketRule,
  MainboardCPUBlockSocketRule,
  MainboardCoolerSocketRule,
  CaseMainboardRule,
  CasePSURule,
  PCIeRule,
  RAMRule,
];

/**
 * The `Build` namespace provides utilities and rules for validating PC build configurations.
 *
 * @namespace Build
 */

namespace Build {
  export const Schema = BuildPartSchema;

  export type List = BuildPartList;

  export type Details<T = Part.Model> = BuildPartDetails<T>;

  export type Result = {
    products: ReturnType<ProductRule["validate"]>;
    rules: { [name in string]: RuleResult };
    missing: { [id in string]: { [attr in string]: string[] } };
  };

  export type RuleResult = {
    error?: string;
    attributes: BuildValidateResult<BuildAttributeMapping>;
  };

  export type Rule<T extends BuildAttributeMapping> = AttributeRule<T>;

  export namespace Rule {
    export const Product = ProductCompatibleRule;

    export type Mapping = BuildAttributeMapping;

    export type Attributes<T extends Mapping> = BuildValidateAttributes<T>;

    export type Result<T extends Mapping> = BuildValidateResult<T>;

    export type Filter<T extends Mapping> = BuildFilterAttributes<T>;

    /**
     * An array of all PC build validation rules.
     * Each rule enforces compatibility between different PC components.
     */
    export const Attribute = ProductRuleList;
  }

  export namespace Product {
    /**
     * A mapping from each product type to the list of validation rules that apply to it.
     *
     * @example
     * ProductRules[Products.Mainboard] = [
     *   CaseMainboardRule,
     *   CPUSocketRule,
     *   PCIeRule,...
     * ]
     */
    export const Rule = ProductRuleList.reduce(
      (acc, rule) => {
        for (const v of Object.values(rule.attributes)) {
          const [product] = v;

          acc[product] ??= [];
          acc[product].push(rule);
        }

        return acc;
      },
      {} as { [key in Products]?: AttributeRule<BuildAttributeMapping>[] }
    );

    /**
     * A mapping of each product type to the information filters
     * of relevant products required for validation.
     * For each product, it maps to an object describing
     * the information (by `Infos`) and attributes of relevant products
     * that are relevant for filtering.
     * This is used to filter the product list based on the selected build
     * and prevent unnecessary information be queried.
     */
    export const ValidateAttributes = ProductRuleList.reduce(
      (acc, rule) => {
        for (const v of Object.values(rule.attributes)) {
          const [filterProduct, info, attr] = v;

          acc[filterProduct] ??= {};

          if (!attr) acc[filterProduct][info] = Information.Info.shape[info].keyof().options;

          acc[filterProduct][info] ??= [];

          if (attr && !acc[filterProduct][info].includes(attr)) acc[filterProduct][info].push(attr);
        }
        return acc;
      },
      {} as { [key in Products]?: { [info in Infos]?: string[] } }
    );

    /**
     * A mapping of each product type to the information filters
     * of relevant products required for validation.
     * For each product, it maps to an object describing
     * the information (by `Infos`) and attributes of relevant products
     * that are relevant for filtering.
     * This is used to filter the product list based on the selected build
     * and prevent unnecessary information be queried.
     *
     * @example
     * ProductFilterAttributes[Products.CPU] = {
     *   // Mainboard has the socket attribute in main spec info that are relevant for filtering CPU.
     *   [Products.MAIN]: { [Infos.MAIN_SPEC]: ['socket'] },
     *   // CPU block has the socket attribute in cpu block socket info that are relevant for filtering CPU.
     *   [Products.CPU_BLOCK]: { [Infos.CPU_BLOCK_SOCKET]: ['socket'] },
     * }
     */
    export const RelevantFilterAttributes = Object.fromEntries(
      Object.entries(Rule).map(([key, rules]) => {
        const product = key as Products;

        const productInfoMapping = rules.reduce(
          (acc, rule) => {
            for (const v of Object.values(rule.attributes)) {
              const [filterProduct, info, attr] = v;

              if (filterProduct === product) continue;

              acc[filterProduct] ??= {};

              if (!attr) acc[filterProduct][info] = Information.Info.shape[info].keyof().options;

              acc[filterProduct][info] ??= [];

              if (attr && !acc[filterProduct][info].includes(attr))
                acc[filterProduct][info].push(attr);
            }
            return acc;
          },
          {} as { [key in Products]?: { [info in Infos]?: string[] } }
        );

        return [product, productInfoMapping];
      })
    ) as {
      [key in Products]?: {
        [key in Products]?: { [info in Infos]?: string[] };
      };
    };
  }
}

export default Build;
