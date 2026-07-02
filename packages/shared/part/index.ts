import * as Part from "./part";

export default Part;
export * as Information from "./info";
export { Name as Infos } from "./info";
export { Name as Products } from "./product";
export * as Product from "./product";
export * as Mapping from "./mapping";
export { RawPartMapper } from "./mapper";
export { AliasRegistry } from "./mapper/registry";
export { AliasLearner } from "./mapper/learner";
export { SELF_ATTRIBUTE } from "./mapper/types";
export type {
  IAliasRegistry,
  IAliasLearner,
  ResolvedTarget,
  ResolvedMapping,
  BasicMapping,
  HeuristicConfig,
} from "./mapper/types";
export {
  fuzzyMatch,
  fuzzyMatchBasic,
  scoreValueQuality,
  resolveConflicts,
  resolveBasicConflicts,
} from "./mapper/resolver";
export { RawKeyResolver } from "./mapper/pipeline";
export type { PipelineResult } from "./mapper/pipeline";
export { CreateAliasSchema, UpdateAliasSchema, BulkLearnSchema } from "./mapper/dto";
export type { CreateAliasDto, UpdateAliasDto, BulkLearnDto } from "./mapper/dto";
