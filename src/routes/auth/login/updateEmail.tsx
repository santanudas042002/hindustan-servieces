import { useContext, useEffect, useState } from "react";
import MiddleSectionContainer from "../../../components/middleSectionContainer/middleSectionContainer";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import { Button, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";
import queryClient from "../../../main";

export default function UpdateEmail() {
  const userDetails = useContext(userDetailsContext);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<
    | {
        email: string;
      }
    | boolean
  >(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  const { isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["auth", "update-email"],
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/auth/update-email`,
          {
            email:
              formData && typeof formData === "object" ? formData.email : "",
          },
          {
            headers: {
              Authorization: `Bearer ${userDetails.userData?.token}`,
            },
          }
        );
        queryClient.invalidateQueries({
          queryKey: ["authLog"],
        });
        queryClient.invalidateQueries({
          queryKey: ["auth"],
        });
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
    setFormData({
      email: fromData.get("email") as string,
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
      <h1>Change Email</h1>

      {error !== "" && <p className="error">{error}</p>}
      {isSuccess && <p className="success">Details updated successfully</p>}

      <form onSubmit={handelSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          name="email"
          type="email"
        />

        <Button variant="contained" color="primary" type="submit">
          change email
        </Button>
      </form>
    </MiddleSectionContainer>
  );
}
