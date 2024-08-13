import { SellerProduct } from "@/models/sellers/SellerProduct";
import Image from "next/image";

export default function ListItem({ item }: { item: SellerProduct }) {
  const frameClass =
    "flex flex-row lg:flex-col p-3 rounded-xl border-line border-2 hover:bg-line hover:text-background";

  return (
    <a target="_blank" href={item.link} className={frameClass}>
      <picture className="h-20 lg:size-auto aspect-square content-center">
        <Image
          src={item.img}
          alt={item.name}
          width="240"
          height="240"
          className="h-auto w-full rounded-lg"
        />
      </picture>

      <div className="text-wrap ml-3 lg:ml-0 lg:mt-2">
        <h3 className="text-xs sm:text-sm md:text-md font-bold">{item.name}</h3>
        <h5 className="text-xs">{`${item.price} đ`}</h5>
      </div>
    </a>
  );
}
