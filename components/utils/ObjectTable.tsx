export function ObjectTable({ object }: { object?: {} }) {
  if (!object) return undefined;

  return (
    <table>
      <tbody>
        {Object.entries(object).map(([key, value]) => {
          if (value) {
            return (
              <tr className="border-2 *:p-2 *:rounded-sm">
                <td className="border-2 font-bold">{key}</td>
                <td
                  className="border-2 break-all"
                  dangerouslySetInnerHTML={{
                    __html: value ? value.toLocaleString() : "",
                  }}
                />
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}
