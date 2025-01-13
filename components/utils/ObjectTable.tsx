import { TableHTMLAttributes } from "react";

export function ObjectTable({
  object,
  ...rest
}: { object?: {} } & TableHTMLAttributes<HTMLTableElement>) {
  if (!object) return undefined;

  return (
    <table {...rest}>
      <tbody>
        {Object.entries(object).map(([key, value], index) => {
          if (value) {
            return (
              <tr
                key={new Date().getTime() + index}
                className="first:border-t-0 border-t-2 *:rounded-sm"
              >
                <td className="p-2 font-bold">{key}</td>
                {typeof value === "object" ? (
                  <td className="border-l-2 p-0 break-all">
                    <ObjectTable className="w-full" object={value} />
                  </td>
                ) : (
                  <td
                    className="border-l-2 p-2 break-all"
                    dangerouslySetInnerHTML={{
                      __html: value ? value.toLocaleString() : "",
                    }}
                  />
                )}
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}
