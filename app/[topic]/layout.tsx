import PartList from "@/components/partlist";
import { Topics } from "@/utils/Enum";
import { notFound } from "next/navigation";

export default function TopicLayout({
  params,
  children,
}: {
  params: { topic: string };
  children: React.ReactNode;
}) {
  if (!Object.values(Topics).includes(params.topic as Topics)) {
    return notFound();
  }

  return (
    <>
      <PartList path={params.topic} />
      <section className="my-2">{children}</section>
    </>
  );
}
