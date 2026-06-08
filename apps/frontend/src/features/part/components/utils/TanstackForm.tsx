import {
  FormOptions,
  ReactFormExtendedApi,
  StandardSchemaV1,
  useForm,
} from "@tanstack/react-form";
import { ComponentType, FC, TableHTMLAttributes } from "react";

import { FieldApi } from "@/type/form";
import { Button } from "@/ui/Button";
import { RowWrapper } from "@/ui/FlexWrapper";

import { Table } from "./Table";

type FormApi<
  TFormData extends object,
  TSubmitMeta = unknown,
> = ReactFormExtendedApi<
  TFormData,
  undefined,
  StandardSchemaV1<TFormData>,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  TSubmitMeta
>;

type Options<TFormData extends object, TSubmitMeta = unknown> = FormOptions<
  TFormData,
  undefined,
  StandardSchemaV1<TFormData>,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  TSubmitMeta
>;

export type InputFormComponent<T extends object> = FC<InputFormProps<T>>;

export type InputFormProps<T extends object> = Readonly<{
  pending: boolean;
}> &
  Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue" | "onSubmit"> &
  Pick<Options<T>, "defaultValues" | "onSubmit">;

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
  options: Options<TFormData, TSubmitMeta>
) {
  return useForm<
    TFormData,
    undefined,
    StandardSchemaV1<TFormData>,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    TSubmitMeta
  >(options);
}

export function GenericInputForm<Form extends object>(
  InputComponent: InputFieldComponent<Form>,
  Schema: StandardSchemaV1<Form>
): InputFormComponent<Form> {
  const InputField = ({
    pending,
    defaultValues,
    onSubmit,
    ...props
  }: InputFormProps<Form>) => {
    const form = useGenericForm({
      defaultValues,
      onSubmit,
      validators: { onChange: Schema },
    });

    return (
      <form
        action={() => form.handleSubmit()}
        className="flex flex-col gap-1 w-full"
      >
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
                    {(field) => (
                      <Component placeholder={Labels[key]} {...field} />
                    )}
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
