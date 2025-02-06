"use client";

import { InfoForm, FormContainer } from "@/components/part/Form";
import PartForm from "@/components/part/input/Part";
import { Button } from "@/components/utils/Button";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { ObjectTable } from "@/components/utils/ObjectTable";
import { Products, Info } from "@/utils/Enum";
import { DetailInfo, InfoLabels, ProductInfo } from "@/utils/interface";
import { useEffect, useReducer, useRef, useState } from "react";

export default function PartDetailEditPage({
  params: { part, id },
}: {
  params: { part: Products; id: string };
}) {
  const SaveLink = useRef(`/api/part/${part}/${id}`);
  const [forms, setForm] = useReducer(
    (state: FormContainer, info: Info) => ({ ...state, [info]: !state[info] }),
    ProductInfo[part],
    (init) => Object.fromEntries(init.map((val) => [val, true]))
  );
  const [data, setData] = useState<DetailInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(SaveLink.current).then((response) => {
      if (response.ok) {
        response.json().then((data: DetailInfo) => {
          setData(data);
          console.log(data);
        });
      } else {
        response.json().then((data: { message: string }) => {
          setError(data.message);
        });
      }
    });
  }, []);

  if (!data && !error) {
    return <h1>Loading</h1>;
  }

  if (!data) {
    return <h1>{error}</h1>;
  }

  return (
    <>
      <PartForm path={SaveLink.current} part={part} defaultValue={data} />
      <ResponsiveWrapper className="w-full align-top">
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Raw</h1>
          <ObjectTable
            className="border-2"
            object={data?.raw ? JSON.parse(data.raw) : undefined}
          />
        </ColumnWrapper>
        <ColumnWrapper className="basis-1/2">
          {ProductInfo[part].map((info) =>
            forms[info] ? (
              <InfoForm
                key={info}
                path={SaveLink.current}
                info={info}
                defaultValue={data[info]}
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
