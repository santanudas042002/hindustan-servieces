import axios, { AxiosError } from "axios";
import { useContext, useLayoutEffect, useState } from "react";
import Layout from "../../../components/layout/layout";
import { Button, IconButton, Snackbar, TextField } from "@mui/material";
import "./updateSiteStaticData.scss";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import CloseIcon from "@mui/icons-material/Close";

export default function UpdateSiteStaticData() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(userDetailsContext);

  const api = import.meta.env.VITE_BACKEND_URL;

  const [initialSiteData, setInitialSiteData] = useState({
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    googleMap: "",
  });

  async function handelFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    //list all data

    const backendData: { [key: string]: any } = {};

    formData.forEach((value, key) => {
      backendData[key] = value;
    });

    console.log(backendData);
    try {
      setLoading(false);
      setErrorMessage("");
      setSuccessMessage("");
      await axios.post(
        api + "/hosting/add-site-data/",
        {
          ...backendData,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      setSuccessMessage("Updating site data it will take 2-3 minutes");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.message) {
        setErrorMessage(error.response?.data.message);
        return;
      }
      setErrorMessage("Failed to update site data!! Please try again latter");
    }
  }

  useLayoutEffect(() => {
    const fetchSiteData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(api + "/hosting/get-site-static-data");

        setInitialSiteData(res.data.siteStaticData[0]);
      } catch (error) {
        setErrorMessage("Failed to fetch site data");
      } finally {
        setLoading(false);
      }
    };
    fetchSiteData();
  }, []);

  console.log(errorMessage);

  return (
    <Layout>
      <div className="updateStaticSiteData">
        {loading && <LoadingComponent />}
        <Snackbar
          open={successMessage !== ""}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
          action={
            <>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setSuccessMessage("")}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
        <div className="heading">
          <h1>Update Site Data</h1>
          <p>Update the site data here</p>
        </div>
        <div className="formContainer">
          {errorMessage !== "" && <p className="error">{errorMessage}</p>}
          <form onSubmit={handelFormSubmit} className="form">
            <TextField
              label="Contact Email"
              name="contactEmail"
              variant="outlined"
              fullWidth
              required
              value={initialSiteData.contactEmail}
              onChange={(e) => {
                setInitialSiteData({
                  ...initialSiteData,
                  contactEmail: e.target.value,
                });
              }}
            />
            <TextField
              label="Contact Phone"
              name="contactPhone"
              variant="outlined"
              fullWidth
              required
              value={initialSiteData.contactPhone}
              onChange={(e) => {
                setInitialSiteData({
                  ...initialSiteData,
                  contactPhone: e.target.value,
                });
              }}
            />
            {/* contactAddress */}
            <TextField
              label="Contact Address"
              name="contactAddress"
              variant="outlined"
              fullWidth
              required
              value={initialSiteData.contactAddress}
              onChange={(e) => {
                setInitialSiteData({
                  ...initialSiteData,
                  contactAddress: e.target.value,
                });
              }}
            />

            {/* googleMap */}

            <TextField
              label="Google Map Link"
              name="googleMap"
              variant="outlined"
              fullWidth
              required
              value={initialSiteData.googleMap}
              onChange={(e) => {
                setInitialSiteData({
                  ...initialSiteData,
                  googleMap: e.target.value,
                });
              }}
            />
            <div className="buttonContainer">
              <Button type="submit" variant="contained" color="primary">
                Deploy
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
