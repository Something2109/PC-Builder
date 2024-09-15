import { PartInformationType } from "@/models/parts/Part";

export default function PartPicture({
  part: { image_url, part, name },
  className,
}: {
  part: PartInformationType;
  className?: string;
}) {
  const classlist = ["aspect-square"];
  if (className) {
    classlist.push(className);
  }

  return (
    <picture className={classlist.join(" ")}>
      {image_url ? (
        <img src={image_url} alt={name} />
      ) : (
        <>
          <img
            src={`/images/icons/${part}.png`}
            alt={name}
            className="dark:hidden"
          />
          <img
            src={`/images/icons/${part}-dark.png`}
            alt={name}
            className="hidden dark:block"
          />
        </>
      )}
    </picture>
  );
}
