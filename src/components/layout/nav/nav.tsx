import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import "./nav.scss";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import SearchContainer from "../../searchContainer/searchContainer";
import { Link } from "react-router-dom";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import { useContext, useEffect, useRef, useState } from "react";
// import logo from "../../../assets/bharat-bazzar-logo.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import searchByCategoryListResponseType from "../../../interface/searchByCategoryListResponseType";
import axios from "axios";

export default function Nav({ showSearchBar }: { showSearchBar?: boolean }) {
  showSearchBar = showSearchBar ? showSearchBar : true;
  const sideNavRef = useRef<HTMLDivElement>(null);
  const { userData } = useContext(userDetailsContext);

  const [data, setData] = useState<searchByCategoryListResponseType["results"]>(
    // dummySearchByTypeListResult.results
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const response = await axios.get(
              import.meta.env.VITE_BACKEND_URL + "/home/get-all-catagories",
              {
                params: {
                  lat: position.coords.latitude,
                  long: position.coords.longitude,
                },
              }
            );
            setData(response.data);
          },
          async () => {
            const response = await axios.get(
              import.meta.env.VITE_BACKEND_URL + "/home/get-all-catagories",
              {}
            );
            setData(response.data);
          }
        );
        return;
      }
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/home/get-all-catagories",
        {}
      );
      setData(response.data);
    };
    fetchData();
  }, []);
  return (
    <header>
      <div className="sideNavMenu" ref={sideNavRef}>
        <div className="right">
          <Link
            to="/"
            className={window.location.pathname === "/" ? "active" : ""}
          >
            <div className="text">Home</div>
          </Link>

          <Link
            to="/about-us"
            className={window.location.pathname === "/about-us" ? "active" : ""}
          >
            <div className="text">About Us</div>
          </Link>

          <Link
            to="/contact-us"
            className={
              window.location.pathname === "/contact-us" ? "active" : ""
            }
          >
            <div className="text">Contact Us</div>
          </Link>

          <div className="dropdown show">
            <Link className="" to="#">
              Categories
            </Link>
            <KeyboardArrowDownIcon />

            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              {data.map((item, index) => (
                <Link
                  key={index}
                  className="dropdown-item"
                  to={`/listing/all/${item.name}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* login */}

          {userData === null ? (
            <Link className="loginButton" to={"/auth"}>
              login
            </Link>
          ) : (
            <Link className="profileSectionLink" to={"/auth"}>
              <div className="profilePicture">
                <PersonIcon />
              </div>
              <div className="text">{userData.name.split(" ")[0]}</div>
            </Link>
          )}

          {/* /////// */}

          <a href="/new-business-listing" className="addPlaceButton">
            <AddIcon />
            <div className="text">Add Place</div>
          </a>
        </div>
      </div>
      <nav>
        <div className="left">
          <div
            className="navIcon"
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.currentTarget.classList.toggle("active");
              sideNavRef.current?.classList.toggle("active");
            }}
          >
            <DensityMediumIcon />
          </div>
          <Link className="logoContainer" to={"/"}>
            <img
              src={import.meta.env.VITE_BUSINESS_LOGO}
              alt="bharat bazar logo"
            />
          </Link>
          <div className="navSearchContainer">
            {showSearchBar && <SearchContainer />}
          </div>
        </div>
        <div className="right">
          <Link
            to="/"
            className={window.location.pathname === "/" ? "active" : ""}
          >
            <div className="text">Home</div>
          </Link>

          <Link
            to="/about-us"
            className={window.location.pathname === "/about-us" ? "active" : ""}
          >
            <div className="text">About Us</div>
          </Link>

          <Link
            to="/contact-us"
            className={
              window.location.pathname === "/contact-us" ? "active" : ""
            }
          >
            <div className="text">Contact Us</div>
          </Link>

          <div className="dropdown show">
            <Link className="" to="#">
              Categories
            </Link>
            <KeyboardArrowDownIcon />

            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              {data.map((item, index) => (
                <Link
                  key={index}
                  className="dropdown-item"
                  to={`/listing/all/${item.name}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* login */}

          {userData === null ? (
            <Link className="loginButton" to={"/auth"}>
              login
            </Link>
          ) : (
            <Link className="profileSectionLink" to={"/auth"}>
              <div className="profilePicture">
                <PersonIcon />
              </div>
              <div className="text">{userData.name.split(" ")[0]}</div>
            </Link>
          )}

          {/* /////// */}

          <a href="/new-business-listing" className="addPlaceButton">
            <AddIcon />
            <div className="text">Add Place</div>
          </a>
        </div>
      </nav>
    </header>
  );
}
