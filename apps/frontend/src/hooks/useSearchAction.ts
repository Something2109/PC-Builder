import Part, { Products } from "@pc-builder/shared/part";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useRef, useState } from "react";

export default function useSearchAction(part?: Products) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: result = [], isFetching: pending } = useQuery<Part.Summary[]>({
    queryKey: ["partSuggestions", part, searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      params.set("limit", "5");
      if (part) params.set("part", part);

      const response = await fetch(`/api/part?${params.toString()}`);
      if (!response.ok) return [];
      const { list } = await response.json();
      return list;
    },
    enabled: searchQuery.length > 0,
  });

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setSearchQuery(val);
    }, 500);
  };

  const onBlur = () => {
    clearTimeout(timeout.current);
    setTimeout(() => setSearchQuery(""), 200);
  };

  const onEnter = () => {
    input.current?.blur();
    const search = input.current?.value;
    if (search && search.length > 0) {
      timeout.current = setTimeout(() => {
        clearTimeout(timeout.current);
        router.push(`/search?q=${search}`);
      }, 500);
    }
  };

  return [input, result, pending, onChange, onBlur, onEnter] as const;
}
