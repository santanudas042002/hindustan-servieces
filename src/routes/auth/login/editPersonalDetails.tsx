import { useContext, useEffect, useState } from "react";
import MiddleSectionContainer from "../../../components/middleSectionContainer/middleSectionContainer";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import { Button, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";

export default function EditPersonalDetails() {
  const userDetails = useContext(userDetailsContext);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<
    | {
        name: string;
        phone: string;
        address: string;
      }
    | boolean
  >(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  const { isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["auth", "userDetails-update"],
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/auth/update-profile`,
          {
            name: formData && typeof formData === "object" ? formData.name : "",
            phone:
              formData && typeof formData === "object" ? formData.phone : "",
            address:
              formData && typeof formData === "object" ? formData.address : "",
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
    //create object from form data
    //set form data
    setFormData({
      name: fromData.get("name") as string,
      phone: fromData.get("phone") as string,
      address: fromData.get("address") as string,
    });
  };
  useEffect(() => {
    console.log("Rendering");
    if (formData && typeof formData === "object") {
      refetch();
    }
  }, [formData]);
  console.log(isSuccess)
  return (
    <MiddleSectionContainer>
      {isFetching && <LoadingComponent />}
      <h1>Edit Details</h1>

      {error !== "" && <p className="error">{error}</p>}
      {isSuccess && <p className="success">Details updated successfully</p>}

      <form onSubmit={handelSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          name="name"
          defaultValue={userDetails.userData?.name}
        />
        <TextField
          label="phone"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          name="phone"
          defaultValue={userDetails.userData?.phone}
        />
        <TextField
          label="address"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          name="address"
          defaultValue={userDetails.userData?.address}
        />
        <Button variant="contained" color="primary" type="submit">
          Save Changes
        </Button>
      </form>
    </MiddleSectionContainer>
  );
}
