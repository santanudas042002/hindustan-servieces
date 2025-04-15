import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import "./googleLogin.scss";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton({
  setErrorMessage,
  setLoading,
}: {
  setErrorMessage: (message: string) => void;
  setLoading: (loading: boolean) => void;
}) {
  const navigate = useNavigate();
  const googleLoginSuccess = async (tokenResponse: TokenResponse) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/loginWithGoogle`,
        {
          accessToken: tokenResponse.access_token,
        }
      );
      //set token in cookie

      const d = new Date();
      const time = d.getTime() + 7 * 24 * 60 * 60 * 1000;
      d.setTime(time);
      Cookies.set("token", res.data.token, {
        expires: time,
        path: "/",
      });
      navigate("/auth");
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        setErrorMessage(error.response.data.error);
        return;
      }
      setErrorMessage("An error occurred while logging in by google");
    } finally {
      setLoading(false);
    }
  };
  const googleLoginError = () => {
    setErrorMessage("An error occurred while logging in by google");
    setLoading(false);
  };

  const handelGoogleLogin = useGoogleLogin({
    onSuccess: googleLoginSuccess,
    onError: googleLoginError,
  });
  return (
    <div className="googleLoginButton">
      <button
        onClick={async () => {
          setLoading(true);
          handelGoogleLogin();
        }}
        type="button"
      >
        <div className="iconContainer">
          <img
            src="https://img.icons8.com/fluency/48/google-logo.png"
            alt="google-icon"
          />
        </div>

        <p>Continue with google</p>
      </button>
    </div>
  );
}
