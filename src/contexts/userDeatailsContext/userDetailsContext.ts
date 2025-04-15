import { createContext } from "react";

const initialState = {
  userData: null,
  updateUserData: () => {},
};

interface IContext {
  userData: null | {
    name: string;
    email: string;
    address: string;
    phone: string;
    token: string;
    role: Number;
  };
  updateUserData: React.Dispatch<
    React.SetStateAction<null | {
      name: string;
      email: string;
      address: string;
      phone: string;
      token: string;
      role: Number;
    }>
  >;
}

const userDetailsContext = createContext<IContext>(initialState);

export default userDetailsContext;
