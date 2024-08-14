import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Products } from "@/models/interface";

const title: { [key in Products]: string } = {
  [Products.CPU]: "CPU",
  [Products.GPU]: "GPU",
  [Products.MAIN]: "Mainboard",
  [Products.RAM]: "RAM",
  [Products.SSD]: "SSD",
  [Products.HDD]: "HDD",
  [Products.PSU]: "PSU",
  [Products.CASE]: "Case",
  [Products.COOLER]: "Cooler",
  [Products.AIO]: "AIO",
  [Products.FAN]: "Fan",
};

export default function PartList({ path }: { path: string }) {
  return (
    <nav className="flex flex-row justify-between flex-wrap gap-2">
      {Object.values(Products).map((part) => (
        <LinkButton
          image={`/images/icons/${part}.png`}
          dark_image={`/images/icons/${part}-dark.png`}
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

function LinkButton({ image, dark_image, title, link }: LinkButtonProps) {
  if (!dark_image) dark_image = image;

  const normal =
    "flex flex-row rounded-lg lg:rounded-xl border-2 border-line p-1 md:border-4 hover:border-blue-500";
  const dark = "dark:hover:bg-blue-500";
  return (
    <Link className={`${normal} ${dark}`} href={link}>
      <picture className="size-6 md:size-8">
        <Image
          src={image}
          alt={`${title} logo`}
          className="dark:hidden"
          width="128"
          height="128"
        />
        <Image
          src={dark_image}
          alt={`${title} logo`}
          className="hidden dark:block"
          width="128"
          height="128"
        />
      </picture>
      <p className="pl-2 md:my-auto md:text-xl font-medium">{title}</p>
    </Link>
  );
}
