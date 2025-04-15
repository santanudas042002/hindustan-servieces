import SearchIcon from "@mui/icons-material/Search";
import "./searchContainer.scss";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
export default function SearchContainer() {
  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const foodInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  function navigateToListingPage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const city = cityInputRef.current?.value ? cityInputRef.current?.value : "all";
    const food = foodInputRef.current?.value;



    if (city) {
      if (food) {
        navigate(`/listing/${city}/${food}`);
      } else {
        navigate(`/listing/${city}`);
      }
    }
  }

  return (
    <div className="searchContainerWrapper">
      <form className="searchContainer" onSubmit={navigateToListingPage}>
        <div className="citySearch">
          <label htmlFor="citySearch"> Where </label>
          <input
            type="text"
            name="citySearch"
            placeholder="anycity"
            ref={cityInputRef}
          />
        </div>
        <div className="foodSearch">
          <label htmlFor="foodSearch"> Find </label>
          <input
            type="text"
            name="foodSearch"
            placeholder="restaurant"
            ref={foodInputRef}
          />
        </div>
        <button className="searchIcon" type="submit">
          <SearchIcon />
        </button>
      </form>
    </div>
  );
}
