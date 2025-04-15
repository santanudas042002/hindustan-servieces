import { Button, TextField } from "@mui/material";
import MiddleSectionContainer from "../../../components/middleSectionContainer/middleSectionContainer";
import "./addSeller.scss";
import { useContext, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";

export default function AddSeller() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { userData } = useContext(userDetailsContext);

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
  const generateUserName = () => {
    if (!formRef.current) return;

    const name = (
      formRef.current.querySelector('input[name="name"]') as HTMLInputElement
    )?.value;
    console.log(name);
    const username =
      name.split(" ").join("").toLowerCase() + generateRandomString(6);

    setUsername(username);
  };

  const generatePassword = () => {
    setPassword(generateRandomString(8));
  };

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const data: any = {};
    formData.forEach((value, key) => {
      if(value && value !== "") {
        data[key] = value;
      }
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      setLoading(true);
      setError("");
       await axios.post(
        `${backendUrl}/super-admin/add-seller`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      setSuccess("Seller added successfully");
      //reset form
      formRef.current.reset();
      setUsername("");
      setPassword("");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.data) {
          setError(error.response.data.error);
          return;
        }
      }
      setError("Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <MiddleSectionContainer>
      {loading && <LoadingComponent />}
      <div className="superAdminAddSeller">
        <div className="header">
          <h1>Add Seller</h1>
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
              required
            />
            <TextField
              id="outlined-basic"
              label="Email"
              name="email"
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              label="Phone"
              name="phone"
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              label="Address"
              name="address"
              variant="outlined"
            />
            <div className="username">
              <TextField
                id="outlined-basic"
                label="Username"
                name="userName"
                variant="outlined"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />
              <Button
                variant="contained"
                color="success"
                onClick={generateUserName}
              >
                Generate
              </Button>
            </div>
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
                Add Seller
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MiddleSectionContainer>
  );
}
