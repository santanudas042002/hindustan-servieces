import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Navigate, useParams } from "react-router-dom";
import Nav from "../../components/layout/nav/nav";
import FullLoadingComponent from "../../components/loadingContainer/fullLoadingScreen";
import ListingSlider from "./listingSlider/listingSlider";
import VerifiedIcon from "@mui/icons-material/Verified";
import "./singleListing.scss";
import StarIcon from "@mui/icons-material/Star";
import Faq from "./faq/faq";
import Reviews from "./reviews/reviews";
import { useContext, useState } from "react";
import userDetailsContext from "../../contexts/userDeatailsContext/userDetailsContext";
import { Button, IconButton,  Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RatingContainer from "./giveRating/rating";

export default function SingleListing() {
  const { businessId } = useParams();
  const { userData } = useContext(userDetailsContext);

  if (!businessId) {
    return <Navigate to="/" />;
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ["singleBusinessDatas", businessId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/business/get-single-business",
          {
            params: {
              businessId: businessId,
            },
          }
        );

        return res.data.listing;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response && error.response.data.error) {
            throw new Error(error.response.data.error);
          }
        }
        throw new Error("An Error occurred");
      }
    },
  });

  //super admin

  const [superAdminLoading, setSuperAdminLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  console.log(data);

  const verifyBusiness = async () => {
    setSuperAdminLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/super-admin/verify-business",
        {
          listingId: businessId,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      console.log(res);

      window.location.reload();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.data.error) {
          setErrorMessage(error.response.data.error);
          return;
        }
      }
      setErrorMessage("An Error occurred");
    } finally {
      setSuperAdminLoading(false);
    }
  };

  return (
    <div className="listing">
      <Nav />
      <div className="page">
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
        {isLoading && <FullLoadingComponent />}
        {error && <div className="errorMessage">{error.message}</div>}

        {data && (
          <>
            <ListingSlider images={data.otherPictures} />
            <div className="pageContent">
              <div className="tittle">
                <h1>{data.BusinessName}</h1>
                {data.isVerified && (
                  <div className="verified">
                    <div className="icon">
                      <VerifiedIcon />
                    </div>
                    <p>Verified</p>
                  </div>
                )}
                {userData && userData.role === 2 && (
                  <div className="superAdminVerificationButton">
                    <Button
                      variant="contained"
                      color="primary"
                      className="addButton"
                      onClick={verifyBusiness}
                    >
                      {superAdminLoading
                        ? "Loading..."
                        : data.isVerified
                        ? "Cancel Verification"
                        : "Verify the business"}
                    </Button>
                  </div>
                )}
              </div>
              <div className="ratingPriceContainer">
                {data.BusinessAvgPrice && (
                  <div className="price">
                    <p>{data.BusinessAvgPrice}</p>
                  </div>
                )}
                {data.rating !== undefined && (
                  <div className="rating">
                    <p>{data.rating}</p>
                    <StarIcon />
                  </div>
                )}
              </div>
              {data.BusinessLocation && data.BusinessLocation.address && (
                <div className="location">
                  <p>Location:</p>
                  <p>{`${data.BusinessLocation.address}, ${data.BusinessLocation.city}, ${data.BusinessLocation.state}, ${data.BusinessLocation.country}, ${data.BusinessLocation.zip}`}</p>
                </div>
              )}
              <div className="filters">
                {data.BusinessFilters &&
                  data.BusinessFilters.length > 0 &&
                  data.BusinessFilters.map((filter: String) => {
                    return (
                      <div className="filterItem">
                        {filter
                          .replace(/([a-z])([A-Z])/g, "$1 $2")
                          .split(" ")
                          .join(" ")}
                      </div>
                    );
                  })}
              </div>
              {data.BusinessDescription && (
                <div className="description">
                  <p>{data.BusinessDescription}</p>
                </div>
              )}

              <div className="cardContainer">
                <div className="contacts">
                  <h3>Contact</h3>
                  <div className="contactsContainer">
                    <div className="email">
                      <p>Email: </p>
                      <p>
                        {data.BusinessEmail
                          ? data.BusinessEmail
                          : "Not Available"}
                      </p>
                    </div>
                    <div className="phone">
                      <p>Phone: </p>
                      <p>
                        {data.BusinessPhone
                          ? data.BusinessPhone
                          : "Not Available"}
                      </p>
                    </div>
                    <div className="website">
                      <p>Website: </p>
                      <p>
                        {data.BusinessWebsite
                          ? data.BusinessWebsite
                          : "Not Available"}
                      </p>
                    </div>
                  </div>

                  {data.BusinessSocial && (
                    <div className="social">
                      {/* <h2>Social Links</h2> */}
                      <div className="socialContainer">
                        {data.BusinessSocial.facebook && (
                          <a
                            href={data.BusinessSocial.facebook}
                            target="_blank"
                          >
                            <div className="socialItem">
                              <img
                                src="https://img.icons8.com/color/48/facebook.png"
                                alt="facebook"
                              />
                            </div>
                          </a>
                        )}
                        {data.BusinessSocial.instagram && (
                          <a
                            href={data.BusinessSocial.instagram}
                            target="_blank"
                          >
                            <div className="socialItem">
                              <img
                                src="https://img.icons8.com/color/48/instagram-new--v1.png"
                                alt="instagram"
                              />
                            </div>
                          </a>
                        )}
                        {data.BusinessSocial.twitter && (
                          <a href={data.BusinessSocial.twitter} target="_blank">
                            <div className="socialItem">
                              <img
                                src="https://img.icons8.com/color/48/twitter--v1.png"
                                alt="twitter"
                              />
                            </div>
                          </a>
                        )}
                        {data.BusinessSocial.linkedin && (
                          <a
                            href={data.BusinessSocial.linkedin}
                            target="_blank"
                          >
                            <div className="socialItem">
                              <img
                                src="https://img.icons8.com/color/48/linkedin.png"
                                alt="linkedin"
                              />
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {data.BusinessHours && (
                  <div className="hours">
                    <h3>Business Timing</h3>
                    <div className="hoursContainer">
                      {Object.keys(data.BusinessHours).map((day: any) => {
                        return (
                          <div className="hourItem">
                            <p className="day">{day.toString()}</p>
                            <p>
                              {data.BusinessHours[day].openTime}
                              {" - "}
                              {data.BusinessHours[day].closeTime}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {<Faq />}
              <RatingContainer />
              {<Reviews />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
