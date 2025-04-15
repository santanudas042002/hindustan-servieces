import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import userDetailsContext from "../../contexts/userDeatailsContext/userDetailsContext";
import LoadingComponent from "../../components/loadingContainer/loadingContainer";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Nav from "../../components/layout/nav/nav";
import Footer from "../../components/layout/footer/footer";
import "./getAllBusinessListing.scss";

export default function GetAllBusinessListing() {
  const { userData } = useContext(userDetailsContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["business-admin", "getAllBusinessListing"],
    queryFn: async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(
        `${backendUrl}/business-listing/get-all-listed-business`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      return res.data.listings;
    },
  });

  console.log(data);

  return (
    <div className="listOfAllBusiness">
      <Nav />
      <div className="listings">
        <div className="header">
          <h1>Business Listing</h1>
          <p>
            Here are the list of all the business that are listed on our
            platform. You can view the payment details of each business by
            clicking on the button below.
          </p>
          <div className="notice">
            <p>
              If you have done the payment but if that business status is not
              active then please wait for some time and if the problem persists
              please contact us
            </p>
          </div>
        </div>
        <div className="businessListContainer">
          {isLoading && <LoadingComponent />}
          {error && (
            <p className="error">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
          )}
          {data && data.length === 0 && <p>No business listed yet</p>}
          {data && (
            <div className="listingContainer">
              {data.map((business: any) => (
                <div className="businessItem" key={business._id}>
                  <div className="top">
                    <div className="logoContainer">
                      <img src={business.picture} alt="logo" />
                    </div>
                    <div className="businessName">
                      <p>{business.BusinessName}</p>
                    </div>
                  </div>
                  <div className="middle">
                    <p className="businessType">
                      {business.businessType} business
                    </p>
                    <div className="businessAddress">
                      <p>{business.BusinessLocation.address}</p>
                    </div>
                    <div className="registeredDate">
                      <p>
                        Registered on :{" "}
                        {new Date(business.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="bottom">
                    <p className="status">
                      Status : {business.status ? "Active" : "Not Active"}
                    </p>
                    <div className="buttonContainer">
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/business-admin/${business._id}/payment-details`}
                      >
                        Payment details
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to={`/business-admin/${business._id}/edit-details`}
                      >
                        Edit Business
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
