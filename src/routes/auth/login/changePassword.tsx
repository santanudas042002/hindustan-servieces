import { useContext, useEffect, useState } from "react";
import MiddleSectionContainer from "../../../components/middleSectionContainer/middleSectionContainer";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import { Button, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";

export default function ChangePassword() {
  const userDetails = useContext(userDetailsContext);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<
    | {
        password: string;
      }
    | boolean
  >(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  const { isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["auth", "change-password"],
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/auth/reset-password`,
          {
            password:
              formData && typeof formData === "object" ? formData.password : "",
          },
          {
            headers: {
              Authorization: `Bearer ${userDetails.userData?.token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        setError("An error occurred");

        if (error instanceof AxiosError && error.response?.data.message) {
          setError(error.response?.data.message);
        }
        throw error;
      }
    },
  });
  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    //create form data
    const fromData = new FormData(e.currentTarget);

    if (fromData.get("password") !== fromData.get("confirmPassword")) {
      setError("Password and confirm password are not same");
      return;
    }
    setFormData({
      password: fromData.get("password") as string,
    });
  };
  useEffect(() => {
    console.log("Rendering");
    if (formData && typeof formData === "object") {
      refetch();
    }
  }, [formData]);
  return (
    <MiddleSectionContainer>
      {isFetching && <LoadingComponent />}
      <h1>Change Password</h1>

      {error !== "" && <p className="error">{error}</p>}
      {isSuccess && <p className="success">Details updated successfully</p>}

      <form onSubmit={handelSubmit}>
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          name="password"
          type="password"
        />
        <TextField
          label="confirm Password"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          name="confirmPassword"
          type="password"
        />

        <Button variant="contained" color="primary" type="submit">
          change password
        </Button>
      </form>
    </MiddleSectionContainer>
  );
}
