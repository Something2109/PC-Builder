import React, { startTransition } from "react";
import { z } from "zod";
import { useForm, DeepKeys, StandardSchemaV1 } from "@tanstack/react-form";

import { FormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { RowWrapper } from "@/ui/FlexWrapper";

import { DynamicField } from "./DynamicField";
import { Table } from "./Table";
import { inspectFieldSchema } from "./schemaInspector";

interface DynamicArrayFormProps<TElement extends Record<string, unknown> = Record<string, unknown>> {
  elementSchema: z.ZodObject<z.ZodRawShape>;
  labels: Record<string, string>;
  pending: boolean;
  defaultValue: TElement[];
  onSubmit: (value: TElement[]) => void;
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

function GroupedSection<TElement extends Record<string, unknown>>({
  groupNode,
  groupKeys,
  depth,
  form,
  elementSchema,
  labels,
  nonGroupProperties,
  onAddRow,
  onDeleteRow,
  onUpdateGroupValue,
}: {
  groupNode: GroupedResult;
  groupKeys: string[];
  depth: number;
  form: FormApi<{ items: TElement[] }>;
  elementSchema: z.ZodObject<z.ZodRawShape>;
  labels: Record<string, string>;
  nonGroupProperties: string[];
  onAddRow: (presets: Record<string, unknown>) => void;
  onDeleteRow: (index: number) => void;
  onUpdateGroupValue: (indices: number[], key: string, val: unknown) => void;
}) {
  const currentKey = groupKeys[depth];
  const fieldLabel = labels[currentKey] || currentKey;
  const firstIndex = groupNode.items[0];

  return (
    <div className="border border-border/40 bg-card/20 rounded-2xl p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="font-bold text-xs uppercase tracking-wider text-text/50">{fieldLabel}:</span>
        <div className="w-1/3">
          <form.Field name={`items[${firstIndex}].${currentKey}` as DeepKeys<{ items: TElement[] }>} mode="value">
            {(field) => (
              <DynamicField
                field={field}
                schema={elementSchema.shape[currentKey] as unknown as z.ZodTypeAny}
                label={fieldLabel}
              />
            )}
          </form.Field>
        </div>
      </div>

      {groupNode.children && groupNode.children.length > 0 ? (
        <div className="pl-6 space-y-4 border-l border-border/30">
          {groupNode.children.map((child, cIndex) => (
            <GroupedSection
              key={cIndex}
              groupNode={child}
              groupKeys={groupKeys}
              depth={depth + 1}
              form={form}
              elementSchema={elementSchema}
              labels={labels}
              nonGroupProperties={nonGroupProperties}
              onAddRow={onAddRow}
              onDeleteRow={onDeleteRow}
              onUpdateGroupValue={onUpdateGroupValue}
            />
          ))}
        </div>
      ) : (
        <div className="pl-6 border-l border-border/30 space-y-3">
          <Table.Component>
            <Table.Head>
              <Table.Row>
                {nonGroupProperties.map((key) => (
                  <Table.Cell key={key} className="font-bold">
                    {labels[key] || key}
                  </Table.Cell>
                ))}
                <Table.Cell className="w-12"></Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              {groupNode.items.map((index) => (
                <Table.Row key={index}>
                  {nonGroupProperties.map((key) => (
                    <Table.Cell key={key}>
                      <form.Field
                        name={`items[${index}].${key}` as DeepKeys<{ items: TElement[] }>}
                      >
                        {(subField) => (
                          <DynamicField
                            field={subField}
                            schema={elementSchema.shape[key] as unknown as z.ZodTypeAny}
                            label={labels[key] || key}
                          />
                        )}
                      </form.Field>
                    </Table.Cell>
                  ))}
                  <Table.Cell className="relative align-middle text-center">
                    <DeleteButton onClick={() => onDeleteRow(index)} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </tbody>
          </Table.Component>

          <Button
            type="button"
            className="text-xs py-1.5 px-3 border border-dashed border-border/80 text-text/70 hover:text-accent-indigo hover:border-accent-indigo transition-colors"
            onClick={() => {
              const presets: Record<string, unknown> = {};
              const firstItem = (form.state.values.items?.[firstIndex] || {}) as Record<string, unknown>;
              for (const gk of groupKeys) {
                presets[gk] = firstItem[gk];
              }
              onAddRow(presets);
            }}
          >
            + Add Row to Group
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Renders form fields for a ZodArray of ZodObjects in a tabular list editor
 */
function ArrayFormFields<TElement extends Record<string, unknown>>({
  form,
  elementSchema,
  labels,
  group,
}: {
  form: FormApi<{ items: TElement[] }>;
  elementSchema: z.ZodObject<z.ZodRawShape>;
  labels: Record<string, string>;
  group?: string[];
}) {
  const shape = elementSchema.shape;
  const properties = Object.keys(shape);

  const groupProperties = group || [];
  const nonGroupProperties = properties.filter((p) => !groupProperties.includes(p));

  const getDefaultRowValue = () => {
    const defaultVal: Record<string, unknown> = {};
    for (const key of properties) {
      const config = inspectFieldSchema(shape[key] as unknown as z.ZodTypeAny);
      if (config.type === "number") defaultVal[key] = 0;
      else if (config.type === "boolean") defaultVal[key] = false;
      else if (config.type === "enum") defaultVal[key] = config.options?.[0] || "";
      else defaultVal[key] = "";
    }
    return defaultVal;
  };

  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const values = (field.state.value ?? []) as Record<string, unknown>[];
        const flatIndices = values.map((_, i) => i);

        if (groupProperties.length === 0) {
          return (
            <div className="space-y-4">
              <Table.Component>
                <Table.Head>
                  <Table.Row>
                    {properties.map((key) => (
                      <Table.Cell key={key} className="font-bold">
                        {labels[key] || key}
                      </Table.Cell>
                    ))}
                    <Table.Cell className="w-12"></Table.Cell>
                  </Table.Row>
                </Table.Head>
                <tbody>
                  {values.map((item, index) => (
                    <Table.Row key={index}>
                      {properties.map((key) => (
                        <Table.Cell key={key}>
                          <form.Field
                            name={`items[${index}].${key}` as DeepKeys<{ items: TElement[] }>}
                          >
                            {(subField) => (
                              <DynamicField
                                field={subField}
                                schema={shape[key] as unknown as z.ZodTypeAny}
                                label={labels[key] || key}
                              />
                            )}
                          </form.Field>
                        </Table.Cell>
                      ))}
                      <Table.Cell className="relative align-middle text-center">
                        <DeleteButton onClick={() => field.removeValue(index)} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </tbody>
              </Table.Component>

              <Button
                type="button"
                className="w-full py-2 border border-dashed border-border/80 text-text/70 hover:text-accent-indigo hover:border-accent-indigo transition-colors"
                onClick={() => (field.pushValue as (val: TElement) => void)(getDefaultRowValue() as TElement)}
              >
                + Add Row
              </Button>
            </div>
          );
        }

        const groupedTree = getGroupedIndices(values, groupProperties, flatIndices);

        const handleUpdateGroupValue = (indices: number[], key: string, val: unknown) => {
          for (const index of indices) {
            (form.setFieldValue as (path: string, val: unknown) => void)(`items[${index}].${key}`, val);
          }
        };

        const handleAddRow = (presets: Record<string, unknown>) => {
          const defaultRow = getDefaultRowValue();
          (field.pushValue as (val: TElement) => void)({
            ...defaultRow,
            ...presets,
          } as TElement);
        };

        const handleDeleteRow = (index: number) => {
          field.removeValue(index);
        };

        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {groupedTree.map((node, index) => (
                <GroupedSection
                  key={index}
                  groupNode={node}
                  groupKeys={groupProperties}
                  depth={0}
                  form={form}
                  elementSchema={elementSchema}
                  labels={labels}
                  nonGroupProperties={nonGroupProperties}
                  onAddRow={handleAddRow}
                  onDeleteRow={handleDeleteRow}
                  onUpdateGroupValue={handleUpdateGroupValue}
                />
              ))}
            </div>

            <Button
              type="button"
              className="w-full py-2.5 border border-dashed border-border/80 text-text/70 hover:text-accent-indigo hover:border-accent-indigo transition-colors"
              onClick={() => (field.pushValue as (val: TElement) => void)(getDefaultRowValue() as TElement)}
            >
              + Add New Group
            </Button>
          </div>
        );
      }}
    </form.Field>
  );
}

export function DynamicArrayForm<TElement extends Record<string, unknown> = Record<string, unknown>>({
  elementSchema,
  labels,
  pending,
  defaultValue,
  onSubmit,
  group,
}: DynamicArrayFormProps<TElement>) {
  const schema = React.useMemo(() => {
    return z.object({ items: z.array(elementSchema) });
  }, [elementSchema]);

  const form = useForm({
    defaultValues: { items: defaultValue },
    onSubmit: ({ value }) => startTransition(() => onSubmit(value.items)),
    validators: { onChange: schema as unknown as StandardSchemaV1<{ items: TElement[] }, unknown> },
  }) as unknown as FormApi<{ items: TElement[] }>;

  return (
    <form
      action={() => {
        form.handleSubmit();
      }}
      className="flex flex-col gap-1 w-full"
    >
      <ArrayFormFields<TElement> form={form} elementSchema={elementSchema} labels={labels} group={group} />
      {pending ? (
        <p className="button border-0">Saving...</p>
      ) : (
        <RowWrapper>
          <Button type="button" onClick={() => form.handleSubmit()}>
            Delete
          </Button>
          <Button type="submit" className="w-full" disabled={pending}>
            Save
          </Button>
        </RowWrapper>
      )}
    </form>
  );
}
