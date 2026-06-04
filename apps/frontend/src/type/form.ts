import {
  ReactFormExtendedApi,
  FormOptions as TanstackFormOptions,
  FormValidateOrFn,
  FormAsyncValidateOrFn,
} from "@tanstack/react-form";

export type FormApi<
  TFormData extends object,
  TSubmitMeta = unknown,
> = ReactFormExtendedApi<
  TFormData,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta
>;

export type FormOptions<
  TFormData extends object,
  TSubmitMeta = unknown,
> = TanstackFormOptions<
  TFormData,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta
>;
