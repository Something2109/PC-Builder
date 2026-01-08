import { RowWrapper } from "@/components/utils/FlexWrapper";

export function NotificationBar({
  message,
  remove,
  alert,
}: Readonly<{
  message: string;
  remove: () => void;
  alert: boolean;
}>) {
  return (
    <RowWrapper
      className={`rounded-xl p-2 justify-between font-bold text-line ${
        alert ? "bg-red-700" : "bg-green-700"
      }`}
    >
      <p>{message}</p>
      <button type="button" onClick={() => remove()}>
        X
      </button>
    </RowWrapper>
  );
}
