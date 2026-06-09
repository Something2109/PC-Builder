import {
  ReactFormExtendedApi,
  FormOptions as TanstackFormOptions,
  FormValidateOrFn,
  FormAsyncValidateOrFn,
  FieldApi as TanstackFieldApi,
  DeepKeys,
  DeepValue,
  FieldValidateOrFn,
  FieldAsyncValidateOrFn,
  StandardSchemaV1,
} from "@tanstack/react-form";

type FormValidation<Data> = undefined | FormValidateOrFn<Data>;

type FormAsyncValidation<Data> = undefined | FormAsyncValidateOrFn<Data>;

type FieldValidation<Data extends object, Name extends DeepKeys<Data>> =
  | undefined
  | FieldValidateOrFn<Data, Name, DeepValue<Data, Name>>;

type FieldAsyncValidation<Data extends object, Name extends DeepKeys<Data>> =
  | undefined
  | FieldAsyncValidateOrFn<Data, Name, DeepValue<Data, Name>>;

export type FormApi<
  TFormData extends object,
  TSubmitMeta = unknown,
> = ReactFormExtendedApi<
  TFormData,
  FormValidation<TFormData>,
  StandardSchemaV1<TFormData>,
  FormAsyncValidation<TFormData>,
  FormValidation<TFormData>,
  FormAsyncValidation<TFormData>,
  FormValidation<TFormData>,
  FormAsyncValidation<TFormData>,
  FormValidation<TFormData>,
  FormAsyncValidation<TFormData>,
  FormAsyncValidation<TFormData>,
  TSubmitMeta
>;

export type FormOptions<
  TFormData extends object,
  TSubmitMeta = unknown,
> = TanstackFormOptions<
  TFormData,
  FormValidation<TFormData>,
  StandardSchemaV1<TFormData>,
  FormAsyncValidation<TFormData>,
  FormValidation<TFormData>,
  FormAsyncValidation<TFormData>,
  FormValidation<TFormData>,
  FormAsyncValidation<TFormData>,
  FormValidation<TFormData>,
  FormAsyncValidation<TFormData>,
  FormAsyncValidation<TFormData>,
  TSubmitMeta
>;

export type FieldApi<
  TParentData extends object,
  TName extends DeepKeys<TParentData>,
  TParentSubmitMeta = unknown,
> = TanstackFieldApi<
  TParentData,
  TName,
  DeepValue<TParentData, TName>,
  FieldValidation<TParentData, TName>,
  FieldValidation<TParentData, TName>,
  FieldAsyncValidation<TParentData, TName>,
  FieldValidation<TParentData, TName>,
  FieldAsyncValidation<TParentData, TName>,
  FieldValidation<TParentData, TName>,
  FieldAsyncValidation<TParentData, TName>,
  FieldValidation<TParentData, TName>,
  FieldAsyncValidation<TParentData, TName>,
  FormValidation<TParentData>,
  StandardSchemaV1<TParentData>,
  FormAsyncValidation<TParentData>,
  FormValidation<TParentData>,
  FormAsyncValidation<TParentData>,
  FormValidation<TParentData>,
  FormAsyncValidation<TParentData>,
  FormValidation<TParentData>,
  FormAsyncValidation<TParentData>,
  FormAsyncValidation<TParentData>,
  TParentSubmitMeta
>;

export type ArrayForm<Item> = { items: Item[] };

export type ArrayFormApi<
  TFormData extends object,
  TSubmitMeta = unknown,
> = FormApi<ArrayForm<TFormData>, TSubmitMeta>;

export type ArrayFieldApi<T> = FieldApi<ArrayForm<T>, "items">;
