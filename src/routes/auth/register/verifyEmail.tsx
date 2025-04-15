import { useContext, useEffect, useRef, useState } from "react";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import OTPInput from "../../../components/otpInput/otpInput";
import "./verifyEmail.scss";
import { Button } from "@mui/material";

import FullLoadingComponent from "../../../components/loadingContainer/fullLoadingScreen";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";

export default function VerifyEmail() {
  const userDetails = useContext(userDetailsContext);
  const navigate = useNavigate()
  const [resendOTP, setResendOTP] = useState(false);
  const timerRef = useRef<HTMLSpanElement>(null);
  const timerInterval = useRef<number | null>(null);
  const [emailToken, setEmailToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  //create a 60s timer to resend otp

  const email = userDetails.userData?.email;

  const token = userDetails.userData?.token;

  if (!email || !token) {
    return <Navigate to="/auth/register" />;
  }

  const sendOTPQuery = useQuery({
    queryKey: ["auth", "send-otp"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      setResendOTP(false);
      clearInterval(timerInterval.current as number);
      setError("");
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth//send-otp-to-verify-email`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.CODE === "EMAIL_ALREADY_VERIFIED") {
          return <Navigate to="/auth" />;
        }
        setResendOTP(false);
        timerInterval.current = setInterval(() => {
          if (timerRef.current) {
            const time = parseInt(
              timerRef.current.innerText.split(" ")[3].split("S")[0]
            );
            if (time > 0) {
              timerRef.current.innerText = `Resend OTP in ${time - 1}s`;
              return;
            }
            setResendOTP(time === 0);
          }
        }, 1000);

        console.log(res.data.token);

        setEmailToken(res.data.token);

        return res;
      } catch (error) {
        setResendOTP(true);
        clearInterval(timerInterval.current as number);
        setError("Error sending OTP please try after some time");
        throw error;
      }
    },
  });

  const verifyOtpQuery = useQuery({
    queryKey: ["auth", "verify-otp"],
    enabled: false,
    queryFn: async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth//verify-email`,
          {
            emailToken: emailToken,
            otp: parseInt(otp),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        navigate("/auth");
        
        return res;
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.response?.data.message);
          if (error.response?.data.CODE === "EMAIL_TOKEN_REQUIRED") {
            sendOTPQuery.refetch();
          }
          throw error;
        }
        setError("Error verifying OTP please try after some time");
        throw error;
      }
    },
  });

  useEffect(() => {
    return () => {
      clearInterval(timerInterval.current as number);
    };
  }, []);

  if (sendOTPQuery.isFetching) {
    return <FullLoadingComponent />;
  }

  return (
    <div className="verifyEmailWrapper">
      <div className="verifyEmail">
        {verifyOtpQuery.isFetching && <LoadingComponent />}
        <h1>Verify Email</h1>
        {error && <p className="error">{error}</p>}
        <p>
          Hello {userDetails.userData?.name} we have send you an otp on{" "}
          {userDetails.userData?.email} please enter it below to verify email
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtpQuery.refetch();
          }}
        >
          <OTPInput
            onComplete={(otp) => {
              setOtp(otp);
            }}
            length={6}
          />
          <div className="buttonContainer">
            <Button
              onClick={() => {
                sendOTPQuery.refetch();
              }}
              color="primary"
              variant="contained"
              disabled={!resendOTP}
            >
              {resendOTP ? (
                "Resend OTP"
              ) : (
                <span ref={timerRef}>Resend OTP in 60s</span>
              )}
            </Button>

            <Button type="submit" color="secondary" variant="contained">
              Verify Email
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
