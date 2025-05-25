import CaseMainboardRule from "./rule/CaseMainboardRule";
import CasePSURule from "./rule/CasePSURule";
import CPUSocketRule from "./rule/CPUSocketRule";
import PCIeRule from "./rule/PCIeRule";
import RAMRule from "./rule/RAMRule";
import {
  BuildAttributeMapping,
  BuildFilterAttributes,
  BuildPartList,
  BuildPartSchema,
  BuildValidateAttributes,
  PCBuildRule,
} from "./utils";
import Part, { Information } from "../part";
import { Infos, Products } from "@/utils/Enum";

/**
 * The `Build` namespace provides utilities and rules for validating PC build configurations.
 *
 * @namespace Build
 */

/// <reference path="./utils.ts" />
namespace Build {
  export const Schema = BuildPartSchema;

  export type List = BuildPartList;

  export type Details<T = Part.Detail> = {
    [key in keyof Required<BuildPartList>]?: Required<BuildPartList>[key] extends string[]
      ? T[]
      : Required<BuildPartList>[key] extends string
      ? T
      : never;
  };

  export type AttributeMapping = BuildAttributeMapping;

  export type ValidateAttributes<T extends AttributeMapping> =
    BuildValidateAttributes<T>;

  export type FilterAttributes<T extends AttributeMapping> =
    BuildFilterAttributes<T>;

  export type Rule<T extends AttributeMapping> = PCBuildRule<T>;

  /**
   * An array of all PC build validation rules.
   * Each rule enforces compatibility between different PC components.
   */
  export const Rules: PCBuildRule<BuildAttributeMapping>[] = [
    CaseMainboardRule,
    CasePSURule,
    CPUSocketRule,
    PCIeRule,
    RAMRule,
  ];

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
  export const ProductRules = Rules.reduce((acc, rule) => {
    Object.values(rule.attributes).forEach((v) => {
      const [product] = v;

      if (!acc[product]) acc[product] = [];
      acc[product].push(rule);
    });

    return acc;
  }, {} as { [key in Products]?: PCBuildRule<BuildAttributeMapping>[] });

  /**
   * A mapping of each product type to the information filters
   * of relevant products required for validation.
   * For each product, it maps to an object describing
   * the information (by `Infos`) and attributes of relevant products
   * that are relevant for filtering.
   * This is used to filter the product list based on the selected build
   * and prevent unnecessary information be queried.
   */
  export const ProductValidateAttributes = Rules.reduce((acc, rule) => {
    Object.values(rule.attributes).forEach((v) => {
      const [filterProduct, info, attr] = v;

      if (!acc[filterProduct]) acc[filterProduct] = {};

      if (!attr)
        acc[filterProduct][info] =
          Information.Schema.shape[info].keyof().options;

      if (!acc[filterProduct][info]) acc[filterProduct][info] = [];

      if (attr && !acc[filterProduct][info].includes(attr))
        acc[filterProduct][info].push(attr);
    });
    return acc;
  }, {} as { [key in Products]?: { [info in Infos]?: string[] } });

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
  export const RelevantProductFilterAttributes = Object.fromEntries(
    Object.entries(ProductRules).map(([key, rules]) => {
      const product = key as Products;

      const productInfoMapping = rules.reduce((acc, rule) => {
        Object.values(rule.attributes).forEach((v) => {
          const [filterProduct, info, attr] = v;

          if (filterProduct === product) return;

          if (!acc[filterProduct]) acc[filterProduct] = {};

          if (!attr)
            acc[filterProduct][info] =
              Information.Schema.shape[info].keyof().options;

          if (!acc[filterProduct][info]) acc[filterProduct][info] = [];

          if (attr && !acc[filterProduct][info].includes(attr))
            acc[filterProduct][info].push(attr);
        });
        return acc;
      }, {} as { [key in Products]?: { [info in Infos]?: string[] } });

      return [product, productInfoMapping];
    })
  ) as {
    [key in Products]?: { [key in Products]?: { [info in Infos]?: string[] } };
  };
}

export default Build;
