import Part from "@/utils/interface/info/Parts";
import PartPicture from "./Picture";

export default function PartPanel({ item }: { item: Part.BasicInfo }) {
  const frameClass =
    "flex flex-row lg:flex-col p-3 rounded-xl border-line border-2";

  return (
    <a href={`/part/${item.part}/${item.id}`} className={frameClass}>
      <PartPicture part={item} className="h-20 lg:size-auto content-center" />
      <div className="size-full ml-3 flex flex-col justify-between lg:ml-0 lg:mt-2">
        <h3 className="mb-2 text-xs sm:text-sm md:text-md font-bold">
          {item.name}
        </h3>
        <div>
          <p className="text-xs md:text-sm">{`Part: ${item.part}`}</p>
          <p className="text-xs md:text-sm">{`Brand: ${item.brand}`}</p>
        </div>
      </div>
    </a>
  );
}
