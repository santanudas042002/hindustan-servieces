import { useState } from "react";
import userDetailsContext from "./userDetailsContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

export default function UserDetailsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [userData, updateUserData] = useState<null | {
    name: string;
    email: string;
    address: string;
    phone: string;
    token: string;
    role: Number;
  }>(null);

  useQuery({
    queryKey: ["authLog"],
    retry: false,

    queryFn: async () => {
      try {
        //get token named cookie

        const token = Cookies.get("token");
        if (!token) {
          return null;
        }

        console.log(token);

        const res = await axios.post(
          `${backendURL}/auth/get-user-details`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = res.data.user;
        updateUserData({
          name: user.name,
          email: user.email,
          address: user.address,
          phone: user.phone,
          token: token,
          role: user.role,
        });

        if (
          res.data.CODE &&
          res.data.CODE === "VERIFY_EMAIL" &&
          location.pathname !== "/auth/verify-email"
        ) {
          return null;
        }

        return res;
      } catch (error) {
        throw error;
      }
    },
  });

  console.log(userData)

  return (
    <userDetailsContext.Provider
      value={{
        userData,
        updateUserData,
      }}
    >
      {children}
    </userDetailsContext.Provider>
  );
}
