import { TextField, Button, Snackbar, IconButton } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./login.scss";
import React, { useContext } from "react";
import zod, { ZodError } from "zod";
import ClearIcon from "@mui/icons-material/Clear";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import CloseIcon from "@mui/icons-material/Close";
import GoogleLoginButton from "./googleLogin";
import Layout from "../../../components/layout/layout";

const registerSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 letter long"),
});

export default function Login() {
  //check if user is already logged in

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { userData } = useContext(userDetailsContext);

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [formError, setFormError] = React.useState<string>("");

  const [formData, setFormData] = React.useState<{
    email: string;
    password: string;
  } | null>(null);

  const registerQuery = useQuery({
    queryKey: ["register"],
    enabled: false,
    retry: false,
    queryFn: async () => {
      try {
        const res = await axios.post(`${backendURL}/auth/login`, formData);

        console.log("success", res);
        const token = res.data.token;
        console.log("token", token);
        //set the token for 7 days on cookie

        const d = new Date();
        d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
        document.cookie = `token=${token}; expires=${d.toUTCString()}; path=/`;

        navigate("/auth");

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

    setFormData({
      email: formObject.email,
      password: formObject.password,
    });
  }

  const [loginLoading, setLoginLoading] = React.useState<boolean>(false);

  if (userData) {
    return <Navigate to="/auth" />;
  }

  return (
    <Layout>
      <div className="loginSectionWrapper">
        <Snackbar
          open={errorMessage !== null}
          autoHideDuration={6000}
          onClose={() => setErrorMessage(null)}
          message={errorMessage}
          action={
            <>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setErrorMessage(null)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
        {(registerQuery.isFetching || loginLoading) && <LoadingComponent />}
        <div className="loginSection">
          <div className="header">
            <h1>Sign in</h1>
            <p>Welcome Back!!</p>
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
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="password"
              type="password"
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="registerButton"
              type="submit"
            >
              Sign in
            </Button>

            <div className="footer">
              <GoogleLoginButton
                setErrorMessage={setErrorMessage}
                setLoading={setLoginLoading}
              />
              <p>
                <Link to="/auth/register">Don't have an account? Register</Link>
              </p>
              <p>
                <Link to="/auth/forgot-password">Forgot Password</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
