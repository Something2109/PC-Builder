import PartList from "@/components/partlist";

export default function IntroductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PartList path="introduction" />
      <section className="my-2">{children}</section>
    </>
  );
}
