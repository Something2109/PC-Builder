"use client";

import { ColumnWrapper } from "@/components/utils/FlexWrapper";
import { Input, Select } from "@/components/utils/Input";
import {
  useState,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  useRef,
} from "react";

export function TableRowWrapper({ children }: { children: React.ReactNode[] }) {
  return (
    <tr className="border-2 *:p-2 *:rounded-sm">
      {[...children].map((child, index) => (
        <td
          key={new Date().getTime() + index}
          className="first:font-bold border-2"
        >
          {child}
        </td>
      ))}
    </tr>
  );
}

export function InputRow({
  name,
  label,
  options,
  ...rest
}: {
  label: string;
  options?: string[];
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <tr className="border-2 *:p-2 *:rounded-sm">
      <td className="first:font-bold border-2">
        <label htmlFor={name}>{label}</label>
      </td>
      <td className="first:font-bold border-2">
        <Input
          name={name}
          id={name}
          placeholder={label}
          list={options ? `${name}s` : undefined}
          {...rest}
        />
        {options ? (
          <datalist id={`${name}s`}>
            {options.map((value) => (
              <option key={`${name}-${value}`}>{value}</option>
            ))}
          </datalist>
        ) : undefined}
      </td>
    </tr>
  );
}

export function SelectInputRow({
  name,
  label,
  options,
  ...rest
}: {
  name: string;
  label: string;
  options: any[];
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <TableRowWrapper>
      <label htmlFor={name}>{label}</label>
      <Select name={name} id={name} {...rest}>
        {Object.values(options).map((product) => (
          <option key={`${name}-${product}`} value={product}>
            {product}
          </option>
        ))}
      </Select>
    </TableRowWrapper>
  );
}

export function DimensionInputRow({
  defaultValue,
}: {
  defaultValue?: { width?: number; length?: number; height?: number };
}) {
  return (
    <TableRowWrapper>
      Dimension
      <table className="w-full">
        <tbody>
          <InputRow
            type="number"
            name="width"
            label="Width"
            defaultValue={defaultValue?.width}
          />
          <InputRow
            type="number"
            name="length"
            label="Length"
            defaultValue={defaultValue?.length}
          />
          <InputRow
            type="number"
            name="height"
            label="Height"
            defaultValue={defaultValue?.height}
          />
        </tbody>
      </table>
    </TableRowWrapper>
  );
}

export function PictureInput({
  part: { image_url, part, name },
  className,
}: {
  part: { image_url?: string; part: string; name: string };
  className?: string;
}) {
  const [image, setImage] = useState<string | null>(image_url ?? null);
  const defaultUrl = `/images/icons/${part}.png`;

  return (
    <ColumnWrapper className={className}>
      <picture className="rounded-lg bg-white aspect-square *:m-auto p-1">
        <img
          src={image ?? defaultUrl}
          alt={name}
          className="max-w-full max-h-full size-full"
          onError={({ currentTarget }) => {
            setImage(null);
            currentTarget.src = defaultUrl;
          }}
        />
      </picture>
      <Input
        type="url"
        name="image_url"
        id="image_url"
        placeholder="Image URL"
        onChange={(e) => setImage(e.target.value)}
      />
    </ColumnWrapper>
  );
}
