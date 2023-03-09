import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export function useUser() {
  const { data, error } = useSWR("/api/user", fetcher);

  return {
    data: data,
    isLoading: !error && data === undefined,
    isError: error,
  };
}
