import type { QueryClient, QueryKey } from '@tanstack/react-query';

/** Keep a cached list in step with a server write, so the table updates without a refetch. */

type Compare<T> = (a: T, b: T) => number;

const sorted = <T>(items: T[], compare?: Compare<T>) => (compare ? items.sort(compare) : items);

export function addToList<T extends { id: string }>(
  queryClient: QueryClient,
  key: QueryKey,
  item: T,
  compare?: Compare<T>,
) {
  queryClient.setQueryData<T[]>(key, (prev = []) => sorted([...prev, item], compare));
}

export function replaceInList<T extends { id: string }>(
  queryClient: QueryClient,
  key: QueryKey,
  item: T,
  compare?: Compare<T>,
) {
  queryClient.setQueryData<T[]>(key, (prev = []) =>
    sorted(
      prev.map((existing) => (existing.id === item.id ? item : existing)),
      compare,
    ),
  );
}

export function removeFromList<T extends { id: string }>(
  queryClient: QueryClient,
  key: QueryKey,
  id: string,
) {
  queryClient.setQueryData<T[]>(key, (prev = []) => prev.filter((item) => item.id !== id));
}
