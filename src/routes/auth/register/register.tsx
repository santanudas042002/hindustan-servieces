import { TextField, Button } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./register.scss";
import React, { useContext } from "react";
import zod, { ZodError } from "zod";
import ClearIcon from "@mui/icons-material/Clear";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Nav from "../../../components/layout/nav/nav";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
const registerSchema = zod.object({
  name: zod
    .string()
    .min(3, "Name must be at least 3 letter long")
    .max(255, "Name must be at most 255 letter long"),
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 letter long"),
  address: zod
    .string()
    .min(3, "Address must be at least 3 letter long")
    .max(255, "Address must be at most 255 letter long"),
  phone: zod
    .string()
    .min(10, "Phone number must be at least 10 digit long")
    .max(10, "Phone number must be at most 10 digit long"),
});

export default function Register() {
  const { userData } = useContext(userDetailsContext);
  if (userData) {
    return <Navigate to="/auth" />;
  }
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [formError, setFormError] = React.useState<string>("");

  const [formData, setFormData] = React.useState<{
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
  } | null>(null);

  const registerQuery = useQuery({
    queryKey: ["register"],
    enabled: false,
    queryFn: async () => {
      try {
        const res = await axios.post(`${backendURL}/auth/register`, formData);
        navigate("/auth/login");

        return res;
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          console.log(error.response?.data.message);
          setFormError(
            error.response
              ? error.response?.data.message
                ? error.response?.data.message
                : "An error occurred"
              : "An error occurred"
          );
          throw error;
        }
        setFormError("An error occurred");
        throw error;
      }
    },
  });

  React.useEffect(() => {
    if (formData) {
      registerQuery.refetch();
    }
  }, [formData]);

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    setFormError("");

    const formData = new FormData(form);

    //create a object from form data
    const formObject: any = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    //validate the form

    try {
      registerSchema.parse(formObject);
    } catch (error: any) {
      if (error instanceof ZodError) {
        setFormError(error.errors.map((err) => err.message).join(", "));
        return;
      }
      setFormError("An error occurred");
    }

    if (formObject.password !== formObject.confirmPassword) {
      setFormError("Password and Confirm Password do not match");
      return;
    }
    setFormData({
      name: formObject.name,
      email: formObject.email,
      password: formObject.password,
      address: formObject.address,
      phone: formObject.phone,
    });
  }

  return (
    <>
      <Nav />
      <div className="registerSectionWrapper">
        {registerQuery.isFetching && <LoadingComponent />}
        <div className="registerSection">
          <div className="header">
            <h1>Register</h1>
            <p>Explore the world with us</p>
          </div>

          <form onSubmit={handleFormSubmit}>
            {formError !== "" && (
              <div className="formError">
                <p className="text">{formError}</p>
                <p
                  className="icon"
                  onClick={() => {
                    setFormError("");
                  }}
                >
                  <ClearIcon />
                </p>
              </div>
            )}
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
            />
            {/* //password field with show password icon */}
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="password"
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="confirmPassword"
            />
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              margin="normal"
              name="phone"
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              name="address"
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="registerButton"
              type="submit"
            >
              Register
            </Button>

            <div className="footer">
              <p>
                Already have an account? <Link to="/auth/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
