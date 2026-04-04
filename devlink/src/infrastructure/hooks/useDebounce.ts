import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const debouncedSet = useCallback(
    debounce((newValue: T) => {
      setDebouncedValue(newValue);
    }, delay),
    [delay],
  );

  useEffect(() => {
    debouncedSet(value);
  }, [value, debouncedSet]);

  return debouncedValue;
};
