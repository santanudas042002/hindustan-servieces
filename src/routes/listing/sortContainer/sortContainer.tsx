import { Sort } from "@mui/icons-material";
import "./sortContainer.scss";
import { useContext, useRef } from "react";
import searchSortContext, {
  sortsStringType,
} from "../../../contexts/searchSortContext/sortContext";

export default function sortContainer() {
  const sortDropdown = useRef<HTMLUListElement | null>(null);
  const { updateSort } = useContext(searchSortContext);

  const listSubmit = (e: React.MouseEvent<HTMLLIElement>) => {
    const value = e.currentTarget.getAttribute("value");
    let sortString: sortsStringType = undefined;

    switch (value) {
      case "relevance":
        sortString = undefined;

        break;
      case "BusinessAvgPrice":
        sortString = "BusinessAvgPrice";
        break;
      case "Rating":
        sortString = "rating";
        break;

      case "Distance":
        //get current location

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            updateSort({
              type: "dist",
              long: pos.coords.longitude,
              lat: pos.coords.latitude,
            });
          });
        } else {
          alert("Location not supported");
        }

        break;

      default:
        sortString = undefined;
        break;
    }

    updateSort(sortString);
    //remove active class from all li elements

    const sortItems =
      sortDropdown.current === null
        ? []
        : sortDropdown.current.querySelectorAll(".sortItem");
    sortItems.forEach((item) => {
      item.classList.remove("itemActive");
    });

    //add active class to clicked li element
    e.currentTarget.classList.add("itemActive");
  };

  return (
    <div className="sortContainer">
      <Sort
        onClick={() => {
          sortDropdown.current?.classList.toggle("active");
        }}
      />
      <ul className="sortDropdown" ref={sortDropdown}>
        <li className="sortItem" value="relevance" onClick={listSubmit}>
          Relevance
        </li>
        <li className="sortItem" value="BusinessAvgPrice" onClick={listSubmit}>
          Price
        </li>
        <li className="sortItem" value="Rating" onClick={listSubmit}>
          Rating
        </li>
        <li className="sortItem" value="Distance" onClick={listSubmit}>
          Distance
        </li>
      </ul>
    </div>
  );
}
