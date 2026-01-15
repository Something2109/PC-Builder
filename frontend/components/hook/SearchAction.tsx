import Part, { Products } from "@/utils/part";
import {
  ChangeEventHandler,
  useActionState,
  useRef,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

export default function useSearchAction(part?: Products) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [_, transitioning] = useTransition();
  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const [result, setSearch, pending] = useActionState<Part.Summary[], string>(
    async (prev, str: string) => {
      if (str.length === 0) return [];

      const params = new URLSearchParams();
      params.set("q", str);
      params.set("limit", "5");
      if (part) params.set("part", part);

      const response = await fetch(`/api/part?${params.toString()}`);

      if (!response.ok) return prev;

      const { list } = await response.json();

      return list;
    },
    []
  );

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      transitioning(() => setSearch(e.target.value));
    }, 500);
  };

  const onBlur = () => {
    clearTimeout(timeout.current);
    setTimeout(() => transitioning(() => setSearch("")), 200);
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
