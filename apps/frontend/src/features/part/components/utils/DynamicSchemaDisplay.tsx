import React from "react";
import { z } from "zod";

import { DynamicFieldDisplay } from "./DynamicFieldDisplay";
import { Table } from "./Table";

interface DynamicSchemaDisplayProps {
  schema: z.ZodTypeAny;
  labels: Record<string, string>;
  defaultValue: unknown;
  multiple?: boolean;
  group?: string[];
}

interface GroupedResult {
  value: unknown;
  items: number[];
  children?: GroupedResult[];
}

function getGroupedIndices(
  items: Record<string, unknown>[],
  groupKeys: string[],
  flatIndices: number[],
  depth = 0
): GroupedResult[] {
  if (depth >= groupKeys.length) {
    return [];
  }

  const key = groupKeys[depth];
  const groups: Map<unknown, number[]> = new Map();

  for (const index of flatIndices) {
    const val = items[index]?.[key];
    if (!groups.has(val)) {
      groups.set(val, []);
    }
    groups.get(val)!.push(index);
  }

  const result: GroupedResult[] = [];
  for (const [val, indices] of groups.entries()) {
    if (depth === groupKeys.length - 1) {
      result.push({
        value: val,
        items: indices,
      });
    } else {
      result.push({
        value: val,
        items: indices,
        children: getGroupedIndices(items, groupKeys, indices, depth + 1),
      });
    }
  }
  return result;
}

function GroupedDisplaySection({
  groupNode,
  groupKeys,
  depth,
  elementSchema,
  labels,
  nonGroupProperties,
  flatData,
}: {
  groupNode: GroupedResult;
  groupKeys: string[];
  depth: number;
  elementSchema: z.ZodObject<z.ZodRawShape>;
  labels: Record<string, string>;
  nonGroupProperties: string[];
  flatData: Record<string, unknown>[];
}) {
  const currentKey = groupKeys[depth];
  const fieldLabel = labels[currentKey] || currentKey;

  return (
    <div className="border border-border/40 bg-card/20 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xs uppercase tracking-wider text-text/40">{fieldLabel}:</span>
        <span className="font-semibold text-text/80">
          {String(groupNode.value)}
        </span>
      </div>

      {groupNode.children && groupNode.children.length > 0 ? (
        <div className="pl-6 space-y-3 border-l border-border/20">
          {groupNode.children.map((child, index) => (
            <GroupedDisplaySection
              key={index}
              groupNode={child}
              groupKeys={groupKeys}
              depth={depth + 1}
              elementSchema={elementSchema}
              labels={labels}
              nonGroupProperties={nonGroupProperties}
              flatData={flatData}
            />
          ))}
        </div>
      ) : (
        <div className="pl-6 border-l border-border/20">
          <Table.Component>
            <Table.Head>
              <Table.Row>
                {nonGroupProperties.map((key) => (
                  <Table.Cell key={key} className="font-bold">
                    {labels[key] || key}
                  </Table.Cell>
                ))}
              </Table.Row>
            </Table.Head>
            <tbody>
              {groupNode.items.map((index) => {
                const item = flatData[index];
                return (
                  <Table.Row key={index}>
                    {nonGroupProperties.map((key) => (
                      <Table.Cell key={key}>
                        <DynamicFieldDisplay
                          schema={elementSchema.shape[key] as unknown as z.ZodTypeAny}
                          value={item?.[key]}
                        />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                );
              })}
            </tbody>
          </Table.Component>
        </div>
      )}
    </div>
  );
}

export function DynamicSchemaDisplay({
  schema,
  labels,
  defaultValue,
  multiple,
  group,
}: DynamicSchemaDisplayProps) {
  const schemaName = schema?.constructor?.name;

  if (!defaultValue || (Array.isArray(defaultValue) && defaultValue.length === 0)) {
    return <span className="text-text/40">No specifications provided.</span>;
  }

  const isMultiple = multiple || schemaName === "ZodArray";

  // 1. ZodArray layout (tabular list)
  if (isMultiple) {
    const elementSchema = (
      schemaName === "ZodArray"
        ? (schema as z.ZodArray<z.ZodTypeAny>).element
        : schema
    ) as z.ZodObject<z.ZodRawShape>;

    const shape = elementSchema.shape;
    const properties = Object.keys(shape);
    const listData = Array.isArray(defaultValue) ? (defaultValue as Record<string, unknown>[]) : [];

    const groupProperties = group || [];
    const nonGroupProperties = properties.filter((p) => !groupProperties.includes(p));

    if (groupProperties.length === 0) {
      return (
        <Table.Component>
          <Table.Head>
            <Table.Row>
              {properties.map((key) => (
                <Table.Cell key={key} className="font-bold">
                  {labels[key] || key}
                </Table.Cell>
              ))}
            </Table.Row>
          </Table.Head>
          <tbody>
            {listData.map((item, rowIndex) => (
              <Table.Row key={rowIndex}>
                {properties.map((key) => (
                  <Table.Cell key={key}>
                    <DynamicFieldDisplay
                      schema={shape[key] as unknown as z.ZodTypeAny}
                      value={item?.[key]}
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </tbody>
        </Table.Component>
      );
    }

    const flatIndices = listData.map((_, i) => i);
    const groupedTree = getGroupedIndices(listData, groupProperties, flatIndices);

    return (
      <div className="space-y-4">
        {groupedTree.map((node, index) => (
          <GroupedDisplaySection
            key={index}
            groupNode={node}
            groupKeys={groupProperties}
            depth={0}
            elementSchema={elementSchema}
            labels={labels}
            nonGroupProperties={nonGroupProperties}
            flatData={listData}
          />
        ))}
      </div>
    );
  }

  // 2. ZodObject layout (vertical table)
  if (schemaName === "ZodObject") {
    const objectSchema = schema as z.ZodObject<z.ZodRawShape>;
    const shape = objectSchema.shape;
    const properties = Object.keys(shape);

    return (
      <Table.Component>
        <tbody>
          {properties.map((key) => {
            const value = (defaultValue as Record<string, unknown>)?.[key];
            // Skip fields with no value to keep the display clean
            if (value === undefined || value === null || value === "") return null;

            return (
              <Table.Row key={key}>
                <Table.Cell className="font-bold w-1/3">{labels[key] || key}</Table.Cell>
                <Table.Cell>
                  <DynamicFieldDisplay schema={shape[key] as unknown as z.ZodTypeAny} value={value} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </tbody>
      </Table.Component>
    );
  }

  return <p className="text-red-500">Unsupported spec display type.</p>;
}
