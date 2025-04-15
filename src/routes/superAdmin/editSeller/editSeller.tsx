import { Button, TextField } from "@mui/material";
import MiddleSectionContainer from "../../../components/middleSectionContainer/middleSectionContainer";
import "./../addSeller/addSeller.scss";
import { useContext, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import FullLoadingComponent from "../../../components/loadingContainer/fullLoadingScreen";

export default function EditSeller() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { userData } = useContext(userDetailsContext);
  const navigate = useNavigate()

  const { sellerId } = useParams<{ sellerId: string }>();
  if (!sellerId) {
    return <div>Invalid Seller Id</div>;
  }

  const sellerInfoQuery = useQuery({
    queryKey: ["seller", sellerId],
    queryFn: async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      try {
        const res = await axios.post(
          `${backendUrl}/super-admin/get-single-seller`,
          {
            id: sellerId,
          },
          {
            headers: {
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        );

        return res.data.seller;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response && error.response.data) {
            throw new Error(error.response.data.error);
          }
        }
        throw new Error("Something went wrong! Please try again later.");
      }
    },
  });

  const generateRandomString = (length: number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const generatePassword = () => {
    setPassword(generateRandomString(8));
  };

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.append("id", sellerId);
    const data: any = {};
    formData.forEach((value, key) => {
      if (value && value !== "") {
        data[key] = value;
      }
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      setLoading(true);
      setError("");
      await axios.post(`${backendUrl}/super-admin/edit-seller`, data, {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      });
      setSuccess("Seller Details updated successfully");
      navigate(-1)
      //navigate to previous

      //reset form
      formRef.current.reset();
      setPassword("");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
          return;
        }
      }
      setError("Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  if (sellerInfoQuery.isLoading) {
    return <FullLoadingComponent />;
  }

 
  return (
    <MiddleSectionContainer>
      {loading && <LoadingComponent />}
      <div className="superAdminAddSeller">
        <div className="header">
          <h1>Edit Seller details</h1>
        </div>

        <div className="fromWrapper">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <form ref={formRef} onSubmit={handelSubmit}>
            <TextField
              id="outlined-basic"
              label="Name"
              name="name"
              variant="outlined"
              defaultValue={sellerInfoQuery.data.name}
              required
            />
            <TextField
              id="outlined-basic"
              label="Email"
              name="email"
              variant="outlined"
              defaultValue={
                sellerInfoQuery.data.email === null
                  ? ""
                  : sellerInfoQuery.data.email
              }
            />
            <TextField
              id="outlined-basic"
              label="Phone"
              name="phone"
              variant="outlined"
              defaultValue={
                sellerInfoQuery.data.phone === null
                  ? ""
                  : sellerInfoQuery.data.phone
              }
            />
            <TextField
              id="outlined-basic"
              label="Address"
              name="address"
              variant="outlined"
              defaultValue={
                sellerInfoQuery.data.address === null
                  ? ""
                  : sellerInfoQuery.data.address
              }
            />
            <div className="password">
              <TextField
                id="outlined-basic"
                label="Password"
                name="password"
                variant="outlined"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
              <Button
                variant="contained"
                color="success"
                onClick={generatePassword}
              >
                Generate
              </Button>
            </div>
            <div className="buttonContainer">
              <Button variant="contained" color="primary" type="submit">
                Edit Seller
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MiddleSectionContainer>
  );
}
