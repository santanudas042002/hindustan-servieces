// import FilterContainer from "./filterContainer/FilterContainer";
import ResultContainer from "./resultContainer/ResultContainer";

import "./listing.scss";
// import ShowFilterIconContextProvider from "../../contexts/showFilterIconContext/showFilterIconContextProvider";
import SortContextProvider from "../../contexts/searchSortContext/sortContextProvider";
import Layout from "../../components/layout/layout";
// import SearchFilterContextProvider from "../../contexts/searchFilterContext/searchFilterContextProvider";

export default function Listing() {
  return (
    // <ShowFilterIconContextProvider>
    <SortContextProvider>
      <Layout>
        <div className="listingSection">
          <div className="resultSection">
            {/* <FilterContainer /> */}

            <ResultContainer />
          </div>
        </div>
      </Layout>
    </SortContextProvider>
    // </ShowFilterIconContextProvider>
  );
}
