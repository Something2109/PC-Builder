import Image, { StaticImageData } from "next/image";
import { Products } from "@/utils/Enum";
import { RedirectButton } from "./utils/Button";

const title: { [key in Products]: string } = {
  [Products.CPU]: "CPU",
  [Products.GPU]: "GPU",
  [Products.GRAPHIC_CARD]: "Graphic Card",
  [Products.MAIN]: "Mainboard",
  [Products.RAM]: "RAM",
  [Products.SSD]: "SSD",
  [Products.HDD]: "HDD",
  [Products.PSU]: "PSU",
  [Products.CASE]: "Case",
  [Products.COOLER]: "Cooler",
  [Products.AIO]: "AIO",
  [Products.FAN]: "Fan",
  [Products.CPU_BLOCK]: "CPU Block",
  [Products.PUMP]: "Pump",
  [Products.RADIATOR]: "Radiator",
};

export default function PartList({ path }: { path: string }) {
  return (
    <nav className="flex flex-row justify-between flex-wrap gap-2">
      {Object.values(Products).map((part) => (
        <LinkButton
          image={`/images/icons/${part}.png`}
          title={title[part]}
          link={`/${path}/${part}`}
          key={`PartList-${part}`}
        />
      ))}
    </nav>
  );
}

type LinkButtonProps = {
  image: StaticImageData | string;
  dark_image?: StaticImageData | string;
  title: string;
  link: string;
};

function LinkButton({ image, title, link }: LinkButtonProps) {
  return (
    <RedirectButton className="flex flex-row" href={link}>
      <picture className="size-6 md:size-8">
        <Image
          src={image}
          alt={`${title} logo`}
          className="dark:invert transition ease-in-out duration-500 delay-0"
          width="128"
          height="128"
        />
      </picture>
      <p className="pl-2 md:my-auto md:text-xl">{title}</p>
    </RedirectButton>
  );
}
