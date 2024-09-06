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

      <div className="size-full ml-3 flex flex-col justify-between font-bold lg:ml-0 lg:mt-2">
        <h3 className="mb-2 text-xs sm:text-sm md:text-md">{item.name}</h3>

        <div className="flex flex-row justify-between">
          <h5 className="text-price">{`${item.price.toLocaleString()}đ`}</h5>
          {item.availability ? (
            <h5 className="text-green-500">Còn hàng</h5>
          ) : (
            <h5 className="text-red-600">Hết hàng</h5>
          )}
        </div>
      </div>
    </a>
  );
}
