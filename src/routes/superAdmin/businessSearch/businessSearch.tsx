import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./businessSearch.scss";
import queryClient from "../../../main";
import Layout from "../../../components/layout/layout";

export default function SuperAdminBusinessSearch() {
  const RESULT_PER_PAGE = 10;

  const { userData } = useContext(userDetailsContext);

  const [searchString, setSearchString] = useState("");

  const { isFetching, data, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["super-admin", "search-business"],
      refetchOnWindowFocus: false,
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.post(
          `${backendUrl}/super-admin/super-admin-search-business`,
          {
            searchString,
            lowerLimit: pageParam * RESULT_PER_PAGE - RESULT_PER_PAGE,
            upperLimit: pageParam * RESULT_PER_PAGE,
          },
          {
            headers: {
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        );
        return res.data;
      },

      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < RESULT_PER_PAGE) {
          return undefined;
        }
        return allPages.length + 1;
      },
    });
  const observer = useRef<IntersectionObserver>();

  const lastElementRef = React.useCallback((node: HTMLDivElement) => {
    if (hasNextPage) {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    }
  }, []);

  const listingResult = useMemo(() => {
    return data?.pages.reduce((acc, val) => {
      return [...acc, ...val];
    }, []);
  }, [data]);

  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchString(
      (
        e.currentTarget.querySelector(
          'input[name="search"]'
        ) as HTMLInputElement
      )?.value || ""
    );
  };

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["super-admin", "search-business"],
    });
  }, [searchString]);

  console.log(listingResult);
  return (
    <Layout>
      <div className="superAdminBusinessSearch">
        <div className="searchPage">
          <div className="superAdminBusinessSearchContainer">
            <form className="searchForm" onSubmit={formSubmit}>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search for a business"
              />
              <button type="submit">Search</button>
            </form>
          </div>
          <div className="resultContainerWrapper">
            <div className="resultContainer">
              {error && <div>Error fetching data</div>}
              {listingResult && listingResult.length === 0 && (
                <div>No results found</div>
              )}
              {listingResult &&
                listingResult?.map((business: any, index: any) => {
                  return (
                    <div
                      key={index}
                      className="resultCard"
                      ref={
                        index === listingResult.length - 1
                          ? lastElementRef
                          : undefined
                      }
                    >
                      <div className="top">
                        <div className="logoContainer">
                          <img src={business.picture} alt="logo" />
                        </div>
                        <div className="otherDetails">
                          <h2 className="businessName">
                            {business.BusinessName}
                          </h2>
                        </div>
                      </div>
                      <div className="middle">
                        <p>
                          Status: {business.status ? "active" : "not active"}
                        </p>
                        <p>
                          verified:{" "}
                          {business.isVerified ? "Verified" : "Not verified"}
                        </p>
                      </div>
                      <div className="bottom">
                        <Button
                          variant="contained"
                          color="primary"
                          component={Link}
                          to={`/business/${business._id}`}
                        >
                          View Business
                        </Button>
                      </div>
                    </div>
                  );
                })}
              {isFetching && <div>Loading...</div>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
