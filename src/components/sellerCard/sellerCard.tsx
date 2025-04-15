import { Button } from "@mui/material";
import axios from "axios";
import userDetailsContext from "../../contexts/userDeatailsContext/userDetailsContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

export default function SellerCard({
  listing,
  listingResult,
  lastElementRef,
  index,
  setErrorMessage,
}: {
  listing: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    userName: string;
    activeStatus: boolean;
  };
  listingResult: String[];
  lastElementRef: any;
  index: number;
  setErrorMessage: any;
}) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const { userData } = useContext(userDetailsContext);

  const [activeStatus, setActiveStatus] = useState(listing.activeStatus);
  const [statusLoading, setStatusLoading] = useState(false);

  const toggleSellerStatus = async () => {
    try {
      setStatusLoading(true);
      await axios.post(
        `${backendUrl}/super-admin/activate-or-deactivate-seller`,
        {
          sellerId: listing._id,
          activeStatus: !activeStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      setActiveStatus(!activeStatus);

      return true;
    } catch (error) {
      setErrorMessage("Error updating seller status");
      return false;
    } finally {
      setStatusLoading(false);
    }
  };
  return (
    <div
      key={listing._id}
      className="listing"
      ref={listingResult.length === index + 1 ? lastElementRef : undefined}
    >
      <div className="top">
        <div className="name">{listing.name}</div>
      </div>
      <div className="middle">
        <div className="contactDetails">
          <div className="email">
            <span>Email:</span>
            <span>{listing.email ? listing.email : "NA"}</span>
          </div>
          <div className="phone">
            <span>Phone:</span>
            <span>{listing.phone ? listing.phone : "NA"}</span>
          </div>
          <div className="address">
            <span>Address:</span>
            <span>{listing.address ? listing.address : "NA"}</span>
          </div>
        </div>
        <div className="impDetails">
          <div className="username">
            <p>Referral Code</p>
            <div className="referralCodeContainer">
              <p>{listing.userName}</p>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  //copy the username into clipboard
                  navigator.clipboard.writeText(listing.userName);
                  alert("username copied to clipboard");
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom">
        <Button
          variant="contained"
          component={Link}
          to={`/super-admin/get-seller/${listing._id}`}
          color="primary"
          
          className="editButton"
        >
          Edit
        </Button>

        {/* view performance */}
        <Button
          variant="contained"
          component={Link}
          to={`/super-admin/seller-performance/${listing._id}`}
          color="primary"
          
          className="viewPerformanceButton"
        >
          View Performance
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={toggleSellerStatus}
          className="deleteButton"
        >
          {statusLoading
            ? "Loading..."
            : activeStatus
            ? "Deactivate"
            : "Activate"}
        </Button>
      </div>
    </div>
  );
}
