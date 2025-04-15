import { createContext } from "react";

export type sortsStringType =
  | "BusinessAvgPrice"
  | undefined
  | "rating"
  | "isVerified"
  | "isTrending"
  | {
      type: "dist";
      long: Number;
      lat: Number;
    };

const initialState = {
  sort: "BusinessAvgPrice" as sortsStringType,
  updateSort: () => {},
};

interface IContext {
  sort: sortsStringType;
  updateSort: React.Dispatch<React.SetStateAction<sortsStringType>>;
}

const searchSortContext = createContext<IContext>(initialState);

export default searchSortContext;
