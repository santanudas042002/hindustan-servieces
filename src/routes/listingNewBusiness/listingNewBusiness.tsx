import { useContext, useEffect, useState } from "react";
import userDetailsContext from "../../contexts/userDeatailsContext/userDetailsContext";
import { Navigate } from "react-router-dom";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import "./listingNewBusiness.scss";
import CloseIcon from "@mui/icons-material/Close";

import Nav from "../../components/layout/nav/nav";
import Footer from "../../components/layout/footer/footer";
import axios, { AxiosError } from "axios";
import LoadingComponent from "../../components/loadingContainer/loadingContainer";
import GoogleMapReact from "google-map-react";
import { useNavigate } from "react-router-dom";
export default function ListingNewBusiness() {
  const navigate = useNavigate();
  const { userData } = useContext(userDetailsContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCatagories] = useState<
    {
      _id: string;
      name: string;
      filters: string[];
    }[]
  >([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [subCategoryInput, setSubCategoryInput] = useState("");
  if (!userData) {
    return <Navigate to="/auth" />;
  }

  const [facilities, setFacilities] = useState<string[]>([]);

  const [fetchCategoryLoading, setFetchCategoryLoading] = useState(false);

  const fetchCategories = async (searchCategoryString: String) => {
    setFetchCategoryLoading(true);
    try {
      const backendURL = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(
        `${backendURL}/business-listing//get-business-types`,
        {
          params: {
            category: searchCategoryString,
          },
        }
      );
      setCatagories(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.message);
      }
    } finally {
      setFetchCategoryLoading(false);
    }
  };

  const [subCategory, setSubCategory] = useState<{
    subcategories: {
      _id: string;
      name: string;
    }[];
  } | null>(null);

  const [subCategoryLoading, setSubCategoryLoading] = useState(false);

  const fetchSubCategories = async (searchSubCategoryString: String) => {
    const category = document.querySelector(
      'input[name="category"]'
    ) as HTMLInputElement;

    if (!category.value || category.value === "") {
      setErrorMessage("Please select category first");
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      setSubCategoryLoading(true);
      const res = await axios.get(
        `${backendUrl}/business-listing/get-subcategories`,
        {
          params: {
            category: category.value,
            subCategorySearchString: searchSubCategoryString,
          },
        }
      );
      setSubCategory(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.error);
      }
    } finally {
      setSubCategoryLoading(false);
    }
  };

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    //remove empty string from formData

    const formData = new FormData(form);
    formData.append("facilities", JSON.stringify(facilities));
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await axios.post(
        `${backendURL}/business-listing/register-new-business`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      navigate("/business-admin");

      setSuccessMessage("Business registered successfully");
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data.message
      ) {
        setErrorMessage(error.response?.data.message);
        return;
      }
      setErrorMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //google map api
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const handelMapLoad = (map: any, maps: any) => {
    const { AdvancedMarkerElement } = maps.marker;
    const { Autocomplete } = maps.places;
    const input = document.querySelector(
      'input[name="address-search"]'
    ) as HTMLInputElement;
    const marker = new AdvancedMarkerElement({
      map,
      gmpDraggable: true,
      position: {
        lat: 59.95,
        lng: 30.33,
      },
    });
    setMarker(marker);

    marker.addListener("dragend", () => {
      const position = marker.position;

      setLongitude(position.lng);
      setLatitude(position.lat);
    });

    setMap(map);
    const autocomplete = new Autocomplete(input, {
      fields: ["geometry"],
      // types: ["address"],
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const longitude = place.geometry.location.lng();
      const latitude = place.geometry.location.lat();

      setLongitude(longitude);
      setLatitude(latitude);
    });

    // fill in the form
  };

  useEffect(() => {
    if (!(window as any).google) {
      return;
    }
    if (!longitude || !latitude) {
      return;
    }
    const google = (window as any).google;

    console.log(google.maps.Geocoder);

    const geocoder = new google.maps.Geocoder();

    const latlng = { lat: latitude, lng: longitude };

    geocoder
      .geocode({ location: latlng })
      .then((response: any) => {
        if (response.results[0]) {
          const res = response.results[0];
          console.log(res);
          //extract address components
          const city = res.address_components.find((item: any) =>
            item.types.includes("administrative_area_level_3")
          )?.long_name;
          const state = res.address_components.find((item: any) =>
            item.types.includes("administrative_area_level_1")
          )?.long_name;

          const country = res.address_components.find((item: any) =>
            item.types.includes("country")
          )?.long_name;

          const pinCode = res.address_components.find((item: any) =>
            item.types.includes("postal_code")
          )?.long_name;

          const name = res.address_components.find((item: any) =>
            item.types.includes("locality")
          )?.long_name;

          // const cityInput = document.querySelector(
          //   'input[name="city"]'
          // ) as HTMLInputElement;
          // const stateInput = document.querySelector(
          //   'input[name="state"]'
          // ) as HTMLInputElement;
          // const countryInput = document.querySelector(
          //   'input[name="country"]'
          // ) as HTMLInputElement;
          // const pinCodeInput = document.querySelector(
          //   'input[name="pinCode"]'
          // ) as HTMLInputElement;
          const longitudeInput = document.querySelector(
            'input[name="longitude"]'
          ) as HTMLInputElement;
          const latitudeInput = document.querySelector(
            'input[name="latitude"]'
          ) as HTMLInputElement;

          // const addressInput = document.querySelector(
          //   'input[name="address"]'
          // ) as HTMLInputElement;

          // addressInput.value = name || "";

          // cityInput.value = city || "";
          // stateInput.value = state || "";
          // countryInput.value = country || "";
          // pinCodeInput.value = pinCode || "";
          longitudeInput.value = longitude.toString() || "";
          latitudeInput.value = latitude.toString() || "";

          setAddress(name || "");
          setCity(city || "");
          setState(state || "");
          setCountry(country || "");
          setPinCode(pinCode || "");

          // console.log(city, state, country, pinCode, longitude, latitude);

          //render that in map

          // console.log(marker);
          map.setCenter(latlng);

          marker.position = latlng;
        } else {
          window.alert("No results found");
        }
      })
      .catch((e: Error) => console.log(e));
  }, [longitude, latitude]);

  const imageSizeVAlidate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    console.log(file.size);
    if (file.size > 5000000) {
      e.target.value = "";
      setErrorMessage("Image size should be less than 5mb");
    }
  };

  console.log(errorMessage);

  return (
    <div className="listingNewBusiness">
      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setErrorMessage("")}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
      {loading && <LoadingComponent />}
      <Nav showSearchBar={false} />

      <div className="heading">
        <h1>Enroll your business with us</h1>
        <p>
          {/* Description of why should you enroll your business with us */}
          Enroll your business with us and get access to a wide range of
          customers. We provide a platform for you to showcase your business to
          the world.
        </p>
      </div>
      <form
        className="listingForm"
        onSubmit={formSubmit}
        autoComplete="off"
        noValidate
      >
        {loading && <LoadingComponent />}
        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        {successMessage && <p className="successMessage">{successMessage}</p>}
        <TextField
          label="Business Name"
          variant="outlined"
          name="businessName"
        />
        <TextareaAutosize
          minRows={5}
          placeholder="Business Description"
          name="businessDescription"
        />
        <div className="profileImageContainer">
          <h3>Image</h3>
          <p>PLease choose image under 5mb and in jpg, jpeg, png format</p>
          <label htmlFor="">Business Profile Picture</label>
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg, image/jpg"
            required
            onChange={imageSizeVAlidate}
          />
          <label htmlFor="">
            Other Pictures (Please upload Horizontal picture)
          </label>
          <input
            type="file"
            name="galleryImage1"
            accept="image/png, image/jpeg, image/jpg"
            required
            onChange={imageSizeVAlidate}
          />
          <input
            type="file"
            name="galleryImage2"
            accept="image/png, image/jpeg, image/jpg"
            required
            onChange={imageSizeVAlidate}
          />
          <input
            type="file"
            name="galleryImage3"
            accept="image/png, image/jpeg, image/jpg"
            required
            onChange={imageSizeVAlidate}
          />
        </div>
        <div className="addressContainer">
          <h3>Address</h3>
          <div className="address">
            <TextField
              label="Search Business Address"
              variant="outlined"
              name="address-search"
              className="addressSearchContainer"
              autoComplete="off"
              type="search"
            />
          </div>

          <div
            className="googleMapContainer"
            style={{ height: "100vh", width: "100%" }}
          >
            <GoogleMapReact
              bootstrapURLKeys={{
                key: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
                libraries: ["places", "marker"],
              }}
              defaultCenter={{
                lat: 59.95,
                lng: 30.33,
              }}
              defaultZoom={11}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => {
                handelMapLoad(map, maps);
              }}
              options={{
                mapId: "f3b7b1b3b1b3b1b3",
              }}
            ></GoogleMapReact>
          </div>
          <div className="addressDetails">
            <TextField
              label="Address"
              variant="outlined"
              name="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              label="City"
              variant="outlined"
              name="city"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <TextField
              label="State"
              variant="outlined"
              name="state"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <TextField
              label="Country"
              variant="outlined"
              name="country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <TextField
              label="Pin Code"
              variant="outlined"
              name="pinCode"
              required
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />

            <input name="longitude" type="hidden" />
            <input name="latitude" type="hidden" />
          </div>
        </div>
        <div className="businessTiming">
          <h3>Business Time</h3>
          <div className="timing">
            <div className="dayTiming">
              <div className="day">Monday</div>
              <div className="openCloseTime">
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Opening Time"
                  // variant="outlined"
                  name="mondayOpenTime"
                />
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Closing Time"
                  // variant="outlined"
                  name="mondayCloseTime"
                />
              </div>
            </div>
            <div className="dayTiming">
              <div className="day">Tuesday</div>
              <div className="openCloseTime">
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Opening Time"
                  // variant="outlined"
                  name="tuesdayOpenTime"
                />
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Closing Time"
                  // variant="outlined"
                  name="tuesdayCloseTime"
                />
              </div>
            </div>
            <div className="dayTiming">
              <div className="day">Wednesday</div>
              <div className="openCloseTime">
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Opening Time"
                  // variant="outlined"
                  name="wednesdayOpenTime"
                />
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Closing Time"
                  // variant="outlined"
                  name="wednesdayCloseTime"
                />
              </div>
            </div>
            <div className="dayTiming">
              <div className="day">Thursday</div>
              <div className="openCloseTime">
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Opening Time"
                  // variant="outlined"
                  name="thursdayOpenTime"
                />
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Closing Time"
                  // variant="outlined"
                  name="thursdayCloseTime"
                />
              </div>
            </div>
            <div className="dayTiming">
              <div className="day">Friday</div>
              <div className="openCloseTime">
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Opening Time"
                  // variant="outlined"
                  name="fridayOpenTime"
                />
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Closing Time"
                  // variant="outlined"
                  name="fridayCloseTime"
                />
              </div>
            </div>

            <div className="dayTiming">
              <div className="day">Saturday</div>
              <div className="openCloseTime">
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Opening Time"
                  // variant="outlined"
                  name="saturdayOpenTime"
                />
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Closing Time"
                  // variant="outlined"
                  name="saturdayCloseTime"
                />
              </div>
            </div>

            <div className="dayTiming">
              <div className="day">Sunday</div>
              <div className="openCloseTime">
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Opening Time"
                  // variant="outlined"
                  name="sundayOpenTime"
                />
                <TimePicker
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  ampm={false}
                  label="Closing Time"
                  // variant="outlined"
                  name="sundayCloseTime"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="contactContainer">
          <h3>Contact Details</h3>
          <div className="contact">
            <TextField
              label="Phone Number"
              variant="outlined"
              name="phoneNumber"
            />
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              type="email"
            />
            <TextField label="Website" variant="outlined" name="website" />
          </div>
        </div>
        <div className="socialMediaContainer">
          <h3>Social Media</h3>
          <div className="socialMedia">
            <TextField
              label="Facebook"
              variant="outlined"
              name="facebookLink"
            />
            <TextField
              label="Instagram"
              variant="outlined"
              name="instagramLink"
            />
            <TextField label="Twitter" variant="outlined" name="twitterLink" />
            <TextField
              label="LinkedIn"
              variant="outlined"
              name="linkedinLink"
            />
          </div>
        </div>
        <div className="otherBusinessDetails">
          <div className="categoryContainer">
            <h3>Category</h3>

            <div className="inputs">
              <div className="categorySelector">
                <TextField
                  label="Category"
                  variant="outlined"
                  value={categoryInput}
                  onChange={(e: { target: { value: string } }) => {
                    setCategoryInput(e.target.value);
                    fetchCategories(e.target.value);
                  }}
                  onFocus={(e: { target: { value: string } }) =>
                    fetchCategories(e.target.value)
                  }
                  name="category"
                />
                <div className="categoryList">
                  {fetchCategoryLoading && (
                    <div className="category">
                      <CircularProgress />
                    </div>
                  )}
                  {categories.map((item, index) => (
                    <div
                      key={index}
                      className="category"
                      onClick={() => {
                        setCategoryInput(item.name);
                        setCatagories([]);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="subCategorySelector">
                <TextField
                  label="Sub Category"
                  variant="outlined"
                  value={subCategoryInput}
                  onChange={(e: { target: { value: string } }) => {
                    setSubCategoryInput(e.target.value);

                    fetchSubCategories(e.target.value);
                  }}
                  onFocus={(e: { target: { value: String } }) =>
                    fetchSubCategories(e.target.value)
                  }
                  name="subCategory"
                />
                <div className="subCategoryList">
                  {
                    //sub category loading
                    subCategoryLoading && (
                      <div className="subCategory">
                        <CircularProgress />
                      </div>
                    )
                  }
                  {subCategory &&
                    subCategory.subcategories.map((item, index) => (
                      <div
                        key={index}
                        className="subCategory"
                        onClick={() => {
                          setSubCategoryInput(item.name);
                          setSubCategory(null);
                        }}
                      >
                        {item.name}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          {/* 3 important tags */}
          <div className="TagContainer">
            <TextField label="Tag 1" variant="outlined" name="tag1" />
            <TextField label="Tag 2" variant="outlined" name="tag2" />
            <TextField label="Tag 3" variant="outlined" name="tag3" />
          </div>
          {/* Facilities */}
          <div className="facilityContainer">
            {/* Take all facility how many numbers are unknown */}
            <div className="facilityInput">
              <TextField
                label="Facility"
                name="facility-name"
                variant="outlined"
              />
              <Button
                onClick={() => {
                  const facilityInput = document.querySelector(
                    'input[name="facility-name"]'
                  ) as HTMLInputElement;
                  if (facilityInput.value) {
                    setFacilities((prev) => [...prev, facilityInput.value]);
                    facilityInput.value = "";
                  }
                }}
              >
                Add
              </Button>
            </div>

            <div className="facilityList">
              {/* List of facilities */}
              {facilities.map((item, index) => (
                <div key={index} className="facility">
                  {item}
                  <Button
                    onClick={() => {
                      setFacilities((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="referralContainer">
          <h3>Referral Details</h3>
          <TextField
            label="Referral Code"
            variant="outlined"
            name="referralCode"
          />
        </div>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
      <Footer />
    </div>
  );
}
