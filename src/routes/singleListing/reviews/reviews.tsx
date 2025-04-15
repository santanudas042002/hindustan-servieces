import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  FormEvent,
  useContext,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./reviews.scss";

export default function Reviews() {
  const { businessId } = useParams();
  const { userData } = useContext(userDetailsContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["reviewsData", businessId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/business/get-reviews",
          {
            params: {
              businessId: businessId,
            },
          }
        );

        return res.data.reviews;
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

  const addCommentQuery = async (comment: string) => {
    setIsFetching(true);
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/business/add-review",
        {
          businessId: businessId,
          review: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`, // Added null check for userData
          },
        }
      );
      await refetch();
      setErrorMessage("Comment added successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.data.error) {
          setErrorMessage(error.response.data.error);
        }
      }
      setErrorMessage("An Error occurred");
    } finally {
      setIsFetching(false);
    }
  };

  const commentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comment = e.currentTarget.comment.value.trim();
    //check if user is logged in or not

    if (userData === null || userData === undefined) {
      setErrorMessage("You need to be logged in to add a review");
      return;
    }
    if (comment === "") {
      setErrorMessage("You need to write a review");
      return;
    }

    await addCommentQuery(comment);
    e.currentTarget.comment.value = "";
  };

  return (
    <div className="reviews">
      <h1>Comments</h1>
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
      <form className="addReview" onSubmit={commentSubmit}>
        <TextField
          id="standard-basic"
          label="Add comment"
          variant="standard"
          inputProps={{ name: "comment" }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isFetching}
        >
          {isFetching ? "Adding Comment..." : "Add Comment"}
        </Button>
      </form>
      <div className="reviewContainer">
        {isLoading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {data &&
          data.map((reviewData: any) => {
            return (
              <div className="review" key={reviewData._id}>
                <div className="reviewUser">
                  <div className="pic">
                    <AccountCircleIcon style={{ fontSize: 50 }} />
                  </div>
                  <div className="details">
                    <div className="name">{reviewData.user.name}</div>
                    <div className="date">
                      {new Date(reviewData.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="comment">{reviewData.review}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
