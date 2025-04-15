import { Button, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";
import MiddleSectionContainer from "../../../components/middleSectionContainer/middleSectionContainer";
import "./forgetPassword.scss";

export default function ForgetPassword() {
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailToken, setEmailToken] = useState("");
  const [otpData, setOtpData] = useState({
    otp: 0,
    password: "",
  });
  console.log(email, "email");

  const emailSubmitQuery = useQuery({
    queryKey: ["auth", "send-otp"],
    refetchOnWindowFocus: false,
    enabled: false,
    queryFn: async () => {
      setError("");
      setShowOTP(false);
      try {
        // send otp to email
        const res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/auth/send-email-to-recover-password`,
          {
            email: email,
          }
        );
        setEmailToken(res.data.token);
        setShowOTP(true);
        return res.data;
      } catch (error) {
        console.log(error);
        setError("Something went wrong please try again");
        if (error instanceof AxiosError && error.response?.data.message) {
          setError(error.response?.data.message);
        }

        throw error;
      }
    },
  });

  const handelEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //get email value from form
    const email = (e.currentTarget[0] as HTMLInputElement).value;
    setEmail(email);
  };

  useEffect(() => {
    if (email !== "") {
      emailSubmitQuery.refetch();
    }
  }, [email]);

  const otpSubmitQuery = useQuery({
    queryKey: ["auth", "verify-otp"],
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
    queryFn: async () => {
      setError("");
      try {
        // verify otp
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/recover-password`,
          {
            emailToken,
            otp: otpData.otp,
            password: otpData.password,
          }
        );
        navigate("/auth/login");
        return res.data;
      } catch (error) {
        console.log(error);
        setError("Something went wrong please try again");
        if (error instanceof AxiosError && error.response?.data.message) {
          setError(error.response?.data.message);
        }
        if (
          error instanceof AxiosError &&
          error.response?.data.message === "EMAIL_TOKEN_EXPIRED"
        ) {
          emailSubmitQuery.refetch();
        }
        throw error;
      }
    },
  });

  const handelOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (otp === "" || password === "" || confirmPassword === "") {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password does not match");
      return;
    }
    console.log(otp);

    setOtpData({
      otp: Number(otp),
      password: password as string,
    });
  };

  useEffect(() => {
    if (otpData.otp !== 0) {
      otpSubmitQuery.refetch();
    }
  }, [otpData]);

  return (
    <MiddleSectionContainer
      containerClass="forgetPasswordContainer"
      wrapperClass="forgetPasswordWrapper"
    >
      {(emailSubmitQuery.isFetching || otpSubmitQuery.isFetching) && (
        <LoadingComponent />
      )}
      <h1>Forget Password</h1>
      {error === "" ? null : <p className="error">{error}</p>}

      <div className="emailContainer">
        <p>Enter your email address below to reset your password</p>
        <form className="emailForm" onSubmit={handelEmailSubmit}>
          <TextField label="Email" variant="outlined" fullWidth required />

          <Button type="submit" color="primary" variant="contained">
            Send OTP
          </Button>
        </form>
      </div>
      {showOTP && (
        <div className="otpContainer">
          <p>We have sent an OTP to your email address please enter it below</p>
          <form className="otpForm" onSubmit={handelOtpSubmit}>
            <TextField
              label="OTP"
              variant="outlined"
              fullWidth
              required
              name="otp"
            />
            <TextField
              label="New Password"
              variant="outlined"
              name="password"
              fullWidth
              required
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              name="confirmPassword"
              fullWidth
              required
            />
            <Button type="submit" color="secondary" variant="contained">
              Verify OTP
            </Button>
          </form>
        </div>
      )}
    </MiddleSectionContainer>
  );
}
