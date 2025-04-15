import { createContext } from "react";

export type filterType = {
  quickFilter?: Array<string>;
  priceRange?: [number, number];
  filters?: Array<string>;
};

const initialState = {
  filter: {},
  updateFilter: () => {},
  selectedFilter: [],
  updateSelectedFilters: () => {},
};

interface IContext {
  filter: filterType;
  updateFilter: React.Dispatch<React.SetStateAction<filterType>>;
  selectedFilter: String[];
  updateSelectedFilters: React.Dispatch<React.SetStateAction<String[]>>;
}

const searchFilterContext = createContext<IContext>(initialState);

export default searchFilterContext;
