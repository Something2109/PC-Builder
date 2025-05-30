"use client";

import { VerticalCollapsible } from "../utils/Collapsible";
import { ColumnWrapper } from "../utils/FlexWrapper";
import { useValidation } from "./hook/Validation";

export default function BuildResultList() {
  const { generic, rules } = useValidation();

  return (
    <VerticalCollapsible>
      <h1 className="text-2xl font-bold">Result</h1>
      <ColumnWrapper>
        <h2>Generic</h2>
        <ul>
          {Object.entries(generic).map(([name, items]) => (
            <li key={`Generic-${name}`}>
              {name}
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <h2>Rules</h2>
        <ul>
          {Object.entries(rules).map(([name, rule], index) => (
            <li key={`Rule-${name}`}>{`${index + 1}. ${name} ${rule}`}</li>
          ))}
        </ul>
      </ColumnWrapper>
    </VerticalCollapsible>
  );
}
