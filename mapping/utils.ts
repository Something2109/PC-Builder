import { Infos } from "@/utils/Enum";

export type AttributeMappingType<T extends any> =
  | string[]
  | {
      raw: string[];
      defaultValue: T;
    };

export type InfoMappingType<T extends { [key in string]: any }> = {
  [key in keyof T]: AttributeMappingType<T[key]>;
};

export type ProductMappingType<T extends Infos> = {
  [key in T]: InfoMappingType<any>[];
};

export type InfoParsing<T extends { [key in string]: any }> = {
  [key in keyof T]: (val: NonNullable<any>) => T[key] | null;
};

export type ProductParsingType<T extends Infos> = {
  [key in T]: InfoParsing<any>;
};

export function TableMapping<T extends {}>(
  infoMappings: InfoMappingType<T>[],
  validate?: InfoParsing<T>
) {
  return (raw: { [key in string]: any }) => {
    return infoMappings
      .map((infoMapping) => {
        const result: Partial<T> = {};
        let hasData: boolean = false;

        Object.entries<AttributeMappingType<any>>(infoMapping).forEach(
          ([attr, attrMapping]) => {
            const attribute = attr as keyof T;
            const { raw: rawKeys, defaultValue } = Array.isArray(attrMapping)
              ? { raw: attrMapping, defaultValue: null }
              : attrMapping;

            for (const key of rawKeys) {
              if (!raw[key]) continue;

              const parsed =
                validate && validate[attribute]
                  ? validate[attribute](raw[key])
                  : raw[key];

              if (!parsed) continue;

              result[attribute] = parsed;
              hasData = true;
              break;
            }

            if (!result[attribute]) result[attribute] = defaultValue;
          }
        );

        if (!hasData) return null;

        return result;
      })
      .filter((item) => item !== null);
  };
}
