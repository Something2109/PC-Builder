import { StandardSchemaV1, useForm, DeepKeys, DeepValue, Updater } from "@tanstack/react-form";
import { ComponentType, FC, TableHTMLAttributes, startTransition } from "react";
import { z, ZodType } from "zod";

import { ArrayForm, ArrayFormApi, FieldApi, FormApi, FormOptions } from "@/type/form";
import { Button } from "@/ui/Button";
import { RowWrapper } from "@/ui/Layout/FlexWrapper";

import { Table } from "./Table";

export type InputFormComponent<T extends object> = FC<InputFormProps<T>>;

export type InputFormProps<T extends object> = Readonly<{
  pending: boolean;
  defaultValue: T;
  onSubmit: (value: T) => void;
}> &
  Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue" | "onSubmit">;

type InputFieldComponent<T extends object> = FC<{
  form: FormApi<T>;
}>;

export type InfoComponentObject<T extends Record<string, unknown>> = {
  [key in keyof Required<T> & string]: ComponentType<FieldApi<T, key>>;
};

export type InfoLabel<T extends Record<string, unknown>> = {
  [key in keyof Required<T>]: string;
};

function useGenericForm<TFormData extends object, TSubmitMeta = unknown>(
  options: FormOptions<TFormData, TSubmitMeta>
) {
  return useForm(options);
}

export function GenericInputForm<Form extends object>(
  InputComponent: InputFieldComponent<Form>,
  Schema: StandardSchemaV1<Form>
): InputFormComponent<Form> {
  const InputField = ({ pending, defaultValue, onSubmit, ...props }: InputFormProps<Form>) => {
    const form = useGenericForm({
      defaultValues: defaultValue,
      onSubmit: ({ value }) => startTransition(() => onSubmit(value)),
      validators: { onChange: Schema },
    });

    return (
      <form action={() => form.handleSubmit()} className="flex flex-col gap-1 w-full">
        <InputComponent form={form} {...props} />
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
  };

  return InputField;
}

export function GenericSingleInputForm<T extends Record<string, unknown>>(
  ComponentObject: InfoComponentObject<T>,
  Labels: InfoLabel<T>,
  Schema: StandardSchemaV1<T>
): InputFormComponent<T> {
  const FormComponent: InputFieldComponent<T> = ({
    form,
    ...props
  }: TableHTMLAttributes<HTMLTableElement> & {
    form: FormApi<T>;
  }) => {
    return (
      <Table.Component {...props}>
        <tbody>
          {Object.entries(ComponentObject).map(([key, Component]) => {
            return (
              <Table.Row key={key}>
                <Table.Cell className="font-bold">{Labels[key]}</Table.Cell>
                <Table.Cell>
                  <form.Field name={key}>
                    {(field) => <Component placeholder={Labels[key]} {...field} />}
                  </form.Field>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </tbody>
      </Table.Component>
    );
  };

  return GenericInputForm<T>(FormComponent, Schema);
}

export function GenericListInputForm<Item extends object>(
  InputComponent: ComponentType<{ form: ArrayFormApi<Item> }>,
  ItemSchema: ZodType<Item>
): InputFormComponent<Item[]> {
  const Schema = z.object({ items: z.array(ItemSchema) }) as ZodType<
    ArrayForm<Item>,
    ArrayForm<Item>
  >;

  const InputField = ({ pending, defaultValue, onSubmit, ..._props }: InputFormProps<Item[]>) => {
    const form = useGenericForm<ArrayForm<Item>>({
      defaultValues: { items: defaultValue },
      onSubmit: ({ value }) => startTransition(() => onSubmit(value.items)),
      validators: { onChange: Schema },
    });

    return (
      <form action={() => form.handleSubmit()} className="flex flex-col gap-1 w-full">
        <InputComponent form={form} />
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
  };

  return InputField;
}

export function mapChange<TParentData extends object, TName extends DeepKeys<TParentData>>(
  field: Pick<FieldApi<TParentData, TName>, "state" | "handleChange">,
  type: "number"
): {
  defaultValue: Exclude<DeepValue<TParentData, TName>, null> | undefined;
  onChange: (e: { target: { value: string } }) => void;
};

export function mapChange<TParentData extends object, TName extends DeepKeys<TParentData>>(
  field: Pick<FieldApi<TParentData, TName>, "state" | "handleChange">,
  type: "select"
): {
  value: Exclude<DeepValue<TParentData, TName>, null> | "";
  onChange: (e: { target: { value: string } }) => void;
};

export function mapChange<TParentData extends object, TName extends DeepKeys<TParentData>>(
  field: Pick<FieldApi<TParentData, TName>, "state" | "handleChange">,
  type?: "string"
): {
  defaultValue: Exclude<DeepValue<TParentData, TName>, null> | undefined;
  onChange: (e: { target: { value: string } }) => void;
};

export function mapChange<TParentData extends object, TName extends DeepKeys<TParentData>>(
  field: Pick<FieldApi<TParentData, TName>, "state" | "handleChange">,
  type: "number" | "string" | "select" = "string"
) {
  if (type === "number") {
    return {
      defaultValue: field.state.value ?? undefined,
      onChange: (e: { target: { value: string } }) => {
        const value = e.target.value as Updater<DeepValue<TParentData, TName>>;

        field.handleChange(value);
      },
    };
  }
  if (type === "select") {
    return {
      value: field.state.value ?? "",
      onChange: (e: { target: { value: string } }) => {
        const value = e.target.value as Updater<DeepValue<TParentData, TName>>;

        field.handleChange(value);
      },
    };
  }
  return {
    defaultValue: field.state.value ?? undefined,
    onChange: (e: { target: { value: string } }) => {
      const value = e.target.value as Updater<DeepValue<TParentData, TName>>;

      field.handleChange(value);
    },
  };
}
