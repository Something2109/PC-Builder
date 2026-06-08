 
export default function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
) {
  let Timeout: NodeJS.Timeout | undefined = undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(Timeout);
    Timeout = setTimeout(() => func(...args), delay);
  };
}
