import { useMemo } from "react";
import { GenericStringInMemoryStorage } from "../fhevm/GenericStringStorage";

export function useInMemoryStorage(): {
  storage: GenericStringInMemoryStorage;
} {
  const storage = useMemo(() => new GenericStringInMemoryStorage(), []);
  return { storage };
}

