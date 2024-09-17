import { PartType } from "@/utils/interface/Parts";

export default function PartPicture({
  part: { image_url, part, name },
  className,
}: {
  part: PartType.BasicInfo;
  className?: string;
}) {
  const classlist = ["rounded-lg bg-white aspect-square *:m-auto"];
  if (className) {
    classlist.push(className);
  }
  const imgClass = "max-w-full max-h-full";

  return (
    <picture className={classlist.join(" ")}>
      <img
        src={image_url ?? ""}
        alt={name}
        className={imgClass}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = `/images/icons/${part}.png`;
        }}
      />
    </picture>
  );
}
