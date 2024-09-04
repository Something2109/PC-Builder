"use client";

import { Button } from "@/components/utils/Button";
import { ParagraphType } from "@/models/articles/article";
import { useCallback, useState } from "react";
import { InputArea, InputContentParameters, RowWrapper } from "./utils";

export function Paragraph({ children }: { children: string }) {
  return <p className="text-xl">{children}</p>;
}

export function ParagraphInput({
  content,
  prefix,
  updateSelf,
}: InputContentParameters<ParagraphType>) {
  const [change, setChange] = useState(content.content.length);

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    content.content = e.target.value;
    console.log(content);
    setChange(content.content.length);
  }, []);

  return (
    <RowWrapper>
      {prefix ? <p>{prefix}</p> : undefined}
      <InputArea
        rows={3}
        placeholder="Paragragh"
        className="text-xl"
        defaultValue={content.content}
        onChange={onChange}
      />
      <div className="flex flex-col gap-1">
        <Button onClick={() => updateSelf.shiftUp()}>Up</Button>
        <Button onClick={() => updateSelf.remove()}>Remove</Button>
        <Button onClick={() => updateSelf.shiftDown()}>Down</Button>
      </div>
    </RowWrapper>
  );
}
