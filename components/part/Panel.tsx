import Part, { Product } from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { RedirectButton } from "../utils/Button";
import PartPicture from "./Picture";

export default function PartPanel({ item }: { item: Part.Summary }) {
  return (
    <RedirectButton
      href={`/part/${item.part}/${item.id}`}
      className="flex flex-row lg:flex-col p-3"
    >
      <PartPicture
        part={item.part}
        src={item.image_url ?? undefined}
        className="w-full"
      />
      <div className="size-full ml-3 flex flex-col justify-between text-left lg:ml-0 lg:mt-2">
        <h3 className="mb-2 text-xs sm:text-sm md:text-md font-bold">
          {item.name}
        </h3>
        <div className="font-normal">
          <p className="text-xs md:text-sm">{`Part: ${
            Product.Label[item.part as Products]
          }`}</p>
          <p className="text-xs md:text-sm">{`Brand: ${item.brand}`}</p>
        </div>
      </div>
    </RedirectButton>
  );
}
