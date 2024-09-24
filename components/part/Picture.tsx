"use client";

export default function PartPicture({
  part: { image_url, part, name },
  className,
}: {
  part: { image_url?: string; part: string; name: string };
  className?: string;
}) {
  const classlist = ["rounded-lg bg-white aspect-square *:m-auto p-1"];
  if (className) {
    classlist.push(className);
  }
  const imgClass = "max-w-full max-h-full size-full";
  const defaultUrl = `/images/icons/${part}.png`;

  return (
    <picture className={classlist.join(" ")}>
      <img
        src={image_url ?? defaultUrl}
        alt={name}
        className={imgClass}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = defaultUrl;
        }}
      />
    </picture>
  );
}
