import { useContext, useState } from "react";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import "./profile.scss";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Layout from "../../../components/layout/layout";
import queryClient from "../../../main";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";

export default function Profile() {
  const userDetails = useContext(userDetailsContext);
  const [loading, setLoading] = useState(false);

  const Logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    queryClient.invalidateQueries({
      queryKey: ["authLog"],
    });
    queryClient.invalidateQueries({
      queryKey: ["auth"],
    });

    userDetails.updateUserData(null);
    setLoading(true);

    //delete token from cookie
  };

  return (
    <div className="profilePageWrapper">
      <Layout>
        <div className="profileWrapper">
          {/* <Nav /> */}
          <div className="profile">
            {loading && <LoadingComponent />}
            <div className="infoContainer">
              {/* <h1>Hello {userDetails.userData?.name}</h1> */}
              <div className="infoContainer">
                <h1 className="text-primary-color">Profile Settings</h1>
                <h4 className="text-primary-color">
                  Hello {userDetails.userData?.name.split(" ")[0]}
                </h4>

                <div className="widgetContainer">
                  <div className="info">
                    <p>
                      <span className="fw-bold">Name:</span>{" "}
                      {userDetails.userData?.name}
                    </p>
                    <p>
                      <span className="fw-bold">Email:</span>{" "}
                      {userDetails.userData?.email}
                    </p>
                    <p>
                      <span className="fw-bold">Phone:</span>{" "}
                      {userDetails.userData?.phone
                      
                      ||
                      "No Phone number Provided"
                      }
                    </p>
                    <p>
                      <span className="fw-bold">Address:</span>{" "}
                      {userDetails.userData?.address
                       || 

                       "No Address Provided"
                      }
                    </p>
                  </div>
                  <div className="actionButtons">
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/auth/edit-personal-details"
                    >
                      Edit Personal Details
                    </Button>
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/business-admin/"
                    >
                      Business Admin
                    </Button>
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/auth/change-password"
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/auth/change-email"
                    >
                      Change Email
                    </Button>
                    <Button variant="contained" color="error" onClick={Logout}>
                      Logout
                    </Button>
                  </div>
                  {userDetails.userData && userDetails.userData.role === 2 && (
                    <div className="actionButtons">
                      <Button
                        variant="outlined"
                        component={Link}
                        to="/super-admin/get-sellers"
                      >
                        Search Sellers
                      </Button>
                      {/* //searchBusiness */}
                      <Button
                        variant="outlined"
                        component={Link}
                        to="/super-admin/search-business"
                      >
                        Search Business
                      </Button>
                      <Button
                        variant="outlined"
                        component={Link}
                        to="/super-admin/add-sellers"
                      >
                        Add Sellers
                      </Button>
                      <Button
                        variant="outlined"
                        color="warning"
                        component={Link}
                        to="/super-admin/update-site-data"
                      >
                        Update Site Data
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
