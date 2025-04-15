import "./resultContainer.scss";
import SortContainer from "../sortContainer/sortContainer";

import { useInfiniteQuery } from "@tanstack/react-query";
import ResultDataType from "../../../interface/resultResponseType";

// import FilterListIcon from "@mui/icons-material/FilterList";
import Cards from "../cards/cards";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import showFilterIconContext from "../../../contexts/showFilterIconContext/showFilterIconContext";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import searchSortContext from "../../../contexts/searchSortContext/sortContext";
import FullLoadingComponent from "../../../components/loadingContainer/fullLoadingScreen";
import queryClient from "../../../main";
import { CircularProgress } from "@mui/material";
import searchFilterContext from "../../../contexts/searchFilterContext/searchFilterContext";

export default function ResultContainer() {
  // const { show, updateShow } = useContext(showFilterIconContext);
  const { sort } = useContext(searchSortContext);
  const cardsContainer = useRef<HTMLDivElement | null>(null);
  const { city, category } = useParams();
  if (!city) {
    return <Navigate to="/" />;
  }
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const [filters] = useState({});
  const { selectedFilter } = useContext(searchFilterContext);
  console.log(selectedFilter);
  const MAX_RESULT_PER_PAGE = 1;
  const observer = useRef<IntersectionObserver>();

  const listingResultUseQuery = useInfiniteQuery({
    queryKey: ["listingResults1", city, category],
    refetchOnWindowFocus: false,
    initialPageParam: 1, // Add initialPageParam property with a value of 1
    queryFn: async ({ pageParam }) => {
      try {
        const response = await axios.get(
          `${backendUrl}/business/search-business`,
          {
            params: {
              city: city === "all" ? undefined : city,
              category,
              lowerLimit: pageParam * MAX_RESULT_PER_PAGE - MAX_RESULT_PER_PAGE,
              upperLimit: pageParam * MAX_RESULT_PER_PAGE,
              ...Object.fromEntries(
                selectedFilter.map((item) => {
                  return [item, true];
                })
              ),

              ...//check if sort is a object
              (typeof sort === "object"
                ? {
                    sortNearby: {
                      lat: sort.lat,
                      lang: sort.long,
                    },
                  }
                : { sort }),
              ...filters,
            },
          }
        );
        return response.data.listings;
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

  const listingResult: ResultDataType[] = useMemo(() => {
    return listingResultUseQuery.data?.pages.reduce((acc, val) => {
      return [...acc, ...val];
    }, []);
  }, [listingResultUseQuery.data]);
  useEffect(() => {
    //reset the query
    queryClient.resetQueries({
      queryKey: ["listingResults1"],
    });
  }, [sort, selectedFilter]);

  if (
    (listingResultUseQuery.isFetching &&
      !listingResultUseQuery.isFetchingNextPage) ||
    listingResultUseQuery.isLoading
  ) {
    return <FullLoadingComponent />;
  }

  return (
    <div className="resultContainer">
      {/* {listingResultUseQuery.isLoading && <p>Loading...</p>} */}
      {listingResultUseQuery.isError && <p>Error</p>}
      {listingResultUseQuery.isSuccess && listingResultUseQuery.data && (
        <>
          <div className="resultInfo">
            <p>
              {listingResult.length > 0
                ? `Showing ${listingResult.length} results`
                : "No results found"}
              {/* Results */}
            </p>
            {/* {show && (
              <FilterListIcon
                onClick={() => {
                  updateShow(false);
                }}
              />
            )} */}

            <SortContainer />
          </div>
          <div className="cardsContainer" ref={cardsContainer}>
            {listingResult &&
              listingResult.map((result) => (
                <Cards
                  refVar={lastElementRef}
                  key={result._id}
                  image={result.otherPictures[0]}
                  keywords={result.BusinessKeywords}
                  isFeatured={false}
                  title={result.BusinessName}
                  location={
                    result.BusinessLocation.address +
                    ", " +
                    result.BusinessLocation.city +
                    ", " +
                    result.BusinessLocation.state +
                    ", " +
                    result.BusinessLocation.country
                  }
                  rating={{
                    reviewRating: parseInt(
                      (Math.floor(result.rating * 100) / 100).toFixed(1)
                    ),
                    reviewCount: result.ratingCount,
                  }}
                  price={result.BusinessAvgPrice}
                  id={result._id}
                />
              ))}
          </div>
          {listingResultUseQuery.isFetchingNextPage &&
            listingResultUseQuery.hasNextPage && (
              <div className="loadingContainer">
                <CircularProgress />
                <p>Loading...</p>
              </div>
            )}

          {!listingResultUseQuery.hasNextPage && (
            <div className="loadingContainer">
              <p>No more results</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
