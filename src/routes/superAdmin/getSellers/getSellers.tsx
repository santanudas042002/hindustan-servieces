import { Button, IconButton, Snackbar, TextField } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import queryClient from "../../../main";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import "./getSeller.scss";
import CloseIcon from "@mui/icons-material/Close";
import SellerCard from "../../../components/sellerCard/sellerCard";
import LoadingComponent from "../../../components/loadingContainer/loadingContainer";
// import Nav from "../../../components/layout/nav/nav";
// import Footer from "../../../components/layout/footer/footer";
import Layout from "../../../components/layout/layout";

const MAX_RESULT_PER_PAGE = 1;
export default function GetSellers() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const [search, setSearch] = useState("");
  const observer = useRef<IntersectionObserver>();
  const { userData } = useContext(userDetailsContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery(

  const listingResultUseQuery = useInfiniteQuery({
    queryKey: ["getSellers"],
    refetchOnWindowFocus: false,
    initialPageParam: 1, // Add initialPageParam property with a value of 1
    queryFn: async ({ pageParam }) => {
      try {
        const response = await axios.post(
          `${backendUrl}/super-admin/get-sellers`,
          {
            search,
            lowerLimit: pageParam * MAX_RESULT_PER_PAGE - MAX_RESULT_PER_PAGE,
            upperLimit: pageParam * MAX_RESULT_PER_PAGE,
          },
          {
            headers: {
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        );
        return response.data.sellers;
      } catch (error) {
        throw new Error("Error fetching data");
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < MAX_RESULT_PER_PAGE) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (listingResultUseQuery.hasNextPage) {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            listingResultUseQuery.fetchNextPage();
          }
        });
        if (node) observer.current.observe(node);
      }
    },
    [
      listingResultUseQuery.hasNextPage,
      listingResultUseQuery.fetchNextPage,
      listingResultUseQuery.isFetching,
      listingResultUseQuery.isLoading,
    ]
  );
  const listingResult = useMemo(() => {
    return listingResultUseQuery.data?.pages.reduce((acc, val) => {
      return [...acc, ...val];
    }, []);
  }, [listingResultUseQuery.data]);

  const searchSeller = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setSearch(search);
    queryClient.invalidateQueries({
      queryKey: ["getSellers"],
    });
  };

  console.log(listingResultUseQuery.data);

  //activate or deactivate seller

  return (
    <Layout>
      <div className="getSellers">
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
        <form className="sellerSearchContainer" onSubmit={searchSeller}>
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Button variant="contained" color="primary" type="submit">
            Search
          </Button>
        </form>
        <div className="resultContainer">
          {listingResultUseQuery.isFetching &&
            !listingResultUseQuery.isFetchingNextPage && <LoadingComponent />}

          {listingResultUseQuery.isError && <p>Error</p>}
          {listingResultUseQuery.isSuccess &&
          listingResultUseQuery.data &&
          listingResult.length > 0 ? (
            <>
              {listingResult.map(
                (
                  listing: {
                    _id: string;
                    name: string;

                    email?: string;

                    phone?: string;

                    address?: string;
                    userName: string;
                    activeStatus: boolean;
                  },
                  index: number
                ) => {
                  return (
                    <SellerCard
                      listing={listing}
                      index={index}
                      lastElementRef={lastElementRef}
                      key={listing._id}
                      setErrorMessage={setErrorMessage}
                      listingResult={listingResult}
                    />
                  );
                }
              )}
            </>
          ) : (
            <div>No sellers found</div>
          )}
        </div>
        <div className="bottom">
          {listingResultUseQuery.hasNextPage &&
          listingResultUseQuery.isFetchingNextPage ? (
            <div>Loading...</div>
          ) : (
            <p>No more results</p>
          )}

          {}
        </div>
      </div>
    </Layout>
  );
}
