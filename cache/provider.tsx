"use client";
import { useConvex } from "convex/react";
import { createContext, FC, PropsWithChildren, useMemo } from "react";
import { CacheRegistry, ConvexQueryCacheOptions } from "./core";

export const ConvexQueryCacheContext = createContext({
  registry: null as CacheRegistry | null,
});

/**
 * A provider that establishes a query cache context in the React render
 * tree so that cached `useQuery` calls can be used.
 *
 * @component
 * @param {ConvexQueryCacheOptions} props.options - Options for the query cache
 * @returns {Element}
 */
export const ConvexQueryCacheProvider: FC<PropsWithChildren<ConvexQueryCacheOptions>> = ({
  children,
  ...options
}) => {
  const convex = useConvex();
  if (!convex) {
    throw new Error(
      "Could not find Convex client! `ConvexQueryCacheProvider` must be used under `ConvexProvider`."
    );
  }

  const registry = useMemo(() => new CacheRegistry(convex, options), [convex, options.expiration, options.maxIdleEntries, options.debug]);

  return (
    <ConvexQueryCacheContext.Provider value={{ registry }}>
      {children}
    </ConvexQueryCacheContext.Provider>
  );
};