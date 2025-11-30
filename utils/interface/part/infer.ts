import { Infos } from "../../Enum";
import * as Information from "./info";

/**
 * The `Infer` namespace provides types to infer information and attributes
 * based on the part's {@link DTO} info.
 */
/**
 * Type representing the information type for a given info key.
 * @template I - The info key from the `Infos` enum.
 * * This type extracts the type of information associated with the given info key.
 */
export type InfoType<I extends Infos> = I extends Information.MultipleValueInfo
  ? (Information.Info[I] | undefined)[]
  : Information.Info[I] | undefined;

/**
 * Type representing the attribute type for a given info key and attribute name.
 * @template I - The info key from the `Infos` enum.
 * @template A - The attribute name as a string.
 * * This type extracts the type of the attribute associated with the given info key and attribute name.
 * * It ensures that if the information is an array, the type is an array of the attribute type.
 */
export type AttributeType<
  I extends Infos,
  A extends string
> = A extends keyof Information.Info[I]
  ? I extends Information.MultipleValueInfo
    ? (Information.Info[I][A] | undefined)[]
    : Information.Info[I][A] | undefined
  : undefined;
