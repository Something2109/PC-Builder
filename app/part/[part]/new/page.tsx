"use client";

import { InfoForm, FormContainer } from "@/components/part/Form";
import PartForm from "@/components/part/input/Part";
import { Button } from "@/components/utils/Button";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { Products, Info } from "@/utils/Enum";
import { InfoLabels, ProductInfo } from "@/utils/interface";
import { useReducer, useRef } from "react";

export default function PartDetailNewPage({
  params: { part },
}: {
  params: { part: Products };
}) {
  const SaveLink = useRef(`/api/part/${part}`);
  const [forms, setForm] = useReducer(
    (state: FormContainer, info: Info) => ({ ...state, [info]: !state[info] }),
    ProductInfo[part],
    (init) => Object.fromEntries(init.map((val) => [val, true]))
  );

  return (
    <>
      <PartForm path={SaveLink.current} part={part} />
      <ResponsiveWrapper className="w-full align-top">
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Raw</h1>
        </ColumnWrapper>
        <ColumnWrapper className="basis-1/2">
          {ProductInfo[part].map((info) =>
            forms[info] ? (
              <InfoForm
                key={info}
                path={SaveLink.current}
                info={info}
                remove={setForm}
              />
            ) : (
              <Button
                key={info}
                className="w-full"
                onClick={() => setForm(info)}
              >{`Add ${InfoLabels[info]} Info`}</Button>
            )
          )}
        </ColumnWrapper>
      </ResponsiveWrapper>
    </>
  );
}
