import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useNews = () =>
  useQuery({
    queryKey: ["news"],
    queryFn: async () => (await api.get("/news?limit=40")).data.items,
    staleTime: 10 * 60_000,
    refetchInterval: 10 * 60_000,
  });
