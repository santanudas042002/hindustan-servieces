import { createContext } from "react";

const initialState = {
  show: true,
  updateShow: () => {},
};

interface IContext {
  show: boolean;
  updateShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const showFilterIconContext =createContext<IContext>(initialState);

export default showFilterIconContext;

