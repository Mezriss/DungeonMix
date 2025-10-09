import { get } from "idb-keyval";
import { useEffect, useState } from "react";

export const useIDB = <T>(key: string) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await get<T>(key);
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key]);

  return { data, error, loading };
};
