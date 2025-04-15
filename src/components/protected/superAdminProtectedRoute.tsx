import { useContext } from "react";
import userDetailsContext from "../../contexts/userDeatailsContext/userDetailsContext";
import { Navigate } from "react-router-dom";

export default function SuperAdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData } = useContext(userDetailsContext);
  console.log(userData?.role);

  if (!userData || userData.role !== 2) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}
