import { Slider } from "@mui/material";
import FilterCards from "./filterCards";
import "./filterContainer.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useRef } from "react";
import showFilterIconContext from "../../../contexts/showFilterIconContext/showFilterIconContext";
import searchFilterContext from "../../../contexts/searchFilterContext/searchFilterContext";

export default function FilterContainer() {
  const filterContainerRef = useRef<HTMLDivElement | null>(null);
  const { show, updateShow } = useContext(showFilterIconContext);
  const { filter } = useContext(searchFilterContext);

  return (
    <AnimatePresence>
      {!show && (
        <motion.div
          className="filterContainer"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.2 }}
          ref={filterContainerRef}
        >
          <FilterCards>
            <div className="heading">
              <h2>Filter</h2>
              <ClearIcon
                onClick={() => {
                  updateShow(true);
                }}
              />
            </div>
          </FilterCards>
          {filter.quickFilter && filter.quickFilter.length > 0 && (
            <FilterCards
              tittle="Quick Filters"
              capsuleOptions={filter.quickFilter}
            />
          )}
          {filter.priceRange && (
            <FilterCards tittle="Price Range">
              <Slider
                marks={[
                  {
                    value: filter.priceRange[0],
                    label: `Rs.${filter.priceRange[0]}`,
                  },
                  {
                    value: filter.priceRange[1],
                    label: `Rs.${filter.priceRange[1]}`,
                  },
                ]}
              />
            </FilterCards>
          )}
          {filter.filters && filter.filters.length > 0 && (
            <FilterCards
              tittle="Other Filters"
              capsuleOptions={filter.filters}
            />
          )}

          {/* <div className="FilterActionButtonContainer">
            <Button variant="contained" color="primary">
              Apply
            </Button>
            <Button variant="outlined" color="secondary">
              Clear
            </Button>
          </div> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
