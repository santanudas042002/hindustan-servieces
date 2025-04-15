import { useState } from "react";
import searchSortContext, { sortsStringType } from "./sortContext.ts";

export default function SortContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sort, updateSort] = useState<sortsStringType>();

  return (
    <searchSortContext.Provider
      value={{
        sort,
        updateSort,
      }}
    >
      {children}
    </searchSortContext.Provider>
  );
}
