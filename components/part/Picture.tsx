import { PartType } from "@/utils/interface/Parts";

export default function PartPicture({
  part: { image_url, part, name },
  className,
}: {
  part: PartType.BasicInfo;
  className?: string;
}) {
  const classlist = ["aspect-square *:m-auto"];
  if (className) {
    classlist.push(className);
  }
  const imgClass = "max-w-full max-h-full";

  return (
    <picture className={classlist.join(" ")}>
      {image_url ? (
        <img src={image_url} alt={name} className={imgClass} />
      ) : (
        <>
          <img
            src={`/images/icons/${part}.png`}
            alt={name}
            className={`dark:hidden ${imgClass}`}
          />
          <img
            src={`/images/icons/${part}-dark.png`}
            alt={name}
            className={`hidden dark:block ${imgClass}`}
          />
        </>
      )}
    </picture>
  );
}
