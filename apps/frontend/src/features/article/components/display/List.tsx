import React from "react";

export function List({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-none pl-6 my-3 space-y-2 border-l-2 border-slate-100 dark:border-slate-800">
      {React.Children.map(children, (child, index) => (
        <li key={index} className="pl-2">
          {child}
        </li>
      ))}
    </ul>
  );
}
