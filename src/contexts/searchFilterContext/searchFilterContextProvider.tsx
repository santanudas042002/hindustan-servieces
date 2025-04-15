import { useState } from "react";
import searchFilterContext, { filterType } from "./searchFilterContext.ts";

export default function SearchFilterContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filter, updateFilter] = useState<filterType>({
    quickFilter: ["Trending", "New", "Verified", "Open Now"],
    filters: [],
  });

  const [selectedFilter, updateSelectedFilters] = useState<String[]>([]);

  return (
    <searchFilterContext.Provider
      value={{
        filter,
        updateFilter,
        selectedFilter,
        updateSelectedFilters,
      }}
    >
      {children}
    </searchFilterContext.Provider>
  );
}
