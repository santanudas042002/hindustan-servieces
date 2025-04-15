import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import userDetailsContext from "../../contexts/userDeatailsContext/userDetailsContext";
import FullLoadingComponent from "../loadingContainer/fullLoadingScreen";
import Cookies from "js-cookie";


export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { updateUserData } = useContext(userDetailsContext);
  const { isLoading, error, data } = useQuery({
    queryKey: ["auth"],
    retry: false,

    queryFn: async () => {
      try {
        //fetch token from cookies
        const token = Cookies.get("token");
        console.log(token);
        if (!token) {
          throw new Error("TOKEN_NOT-PRESENT");
        }

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
          navigate("/auth/verify-email");
        }

        return res;
      } catch (error) {
        throw error;
      }
    },
  });

  console.log("datas", data);
  console.log(error);

  if (isLoading) {
    return <FullLoadingComponent />;
  }

  if (error) {
    updateUserData(null);
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
}
