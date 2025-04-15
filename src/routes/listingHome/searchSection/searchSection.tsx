import SearchContainer from "../../../components/searchContainer/searchContainer";
import "./searchSection.scss";

export default function SearchSection() {
  return (
    <div className="searchSection">
      <div className="bgVideo">
        <video src="https://storage.googleapis.com/hindustan-services-web-assets/main-screen-bg-video.mp4" autoPlay loop muted />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          {" "}
          <path d="M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z"></path>
        </svg>
      </div>
      <div className="content">
        <h1>Discover Your city</h1>
        <p>20 cities, 10 categories, 162 places</p>
        <div className="searchContainerWrapper">
          <SearchContainer />
        </div>
      </div>
    </div>
  );
}
