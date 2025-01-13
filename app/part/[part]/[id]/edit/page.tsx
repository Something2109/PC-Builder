"use client";

import PartForm from "@/components/part/Form";
import { Products } from "@/utils/Enum";
import { DetailInfo } from "@/utils/interface";
import React, { useEffect, useState } from "react";

export default function PartDetailEditPage({
  params: { part, id },
}: {
  params: { part: string; id: string };
}) {
  const [data, setData] = useState<DetailInfo<Products> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const SaveLink = `/api/part/${part}/${id}`;

  useEffect(() => {
    setError(null);
    fetch(SaveLink).then((response) => {
      if (response.ok) {
        response.json().then((data: DetailInfo<Products>) => {
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

  return <PartForm defaultValue={data} part={part as Products} />;
}
