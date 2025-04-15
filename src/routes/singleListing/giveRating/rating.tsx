import { IconButton, Rating, Snackbar } from "@mui/material";
import { useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios, { AxiosError } from "axios";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import { useParams } from "react-router-dom";

export default function RatingContainer() {
  const [errorMessage, setErrorMessage] = useState<String | null>(null);
  const { userData } = useContext(userDetailsContext);
  const { businessId } = useParams();

  const ratingChange = async (_:any, newValue: Number | null) => {
    console.log(newValue);

    // return;
    try {
      const backendURL =
        import.meta.env.VITE_BACKEND_URL + "/business/add-rating";

      if (!userData?.token) {
        setErrorMessage("You must be logged in to add a rating");
        return;
      }

      await axios.post(
        backendURL,
        {
          businessId: businessId,
          rating: newValue,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`, // Added null check for userData
          },
        }
      );

      setErrorMessage("Rating added successfully");
    } catch (error) {
      console.log(error);
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data.error
      ) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred");
      }
    }
  };
  return (
    <div className="giveRatingContainer">
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
      <div className="ratingContainer">
        <div className="ratingTitle">
          <h1>Give rating to this business</h1>
        </div>
        <div className="ratingStars">
          <Rating
            onChange={(_, newVal) => {
              ratingChange(_, newVal);
            }}
          />
        </div>
      </div>
    </div>
  );
}
