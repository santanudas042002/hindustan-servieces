import Card1 from "../../../components/card1/card1";
import "./searchByCategory.scss";
import searchByCategoryListResponseType from "../../../interface/searchByCategoryListResponseType";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SearchByCategory() {
  const [data, setData] = useState<searchByCategoryListResponseType["results"]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const response = await axios.get(
              import.meta.env.VITE_BACKEND_URL + "/home/get-catagories",
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
              import.meta.env.VITE_BACKEND_URL + "/home/get-catagories",
              {}
            );
            setData(response.data);
          }
        );
        return;
      }
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/home/get-catagories",
        {}
      );
      setData(response.data);
    };
    fetchData();
  }, []);

  return (
    <div className="searchByCategoryWrapper">
      <div className="searchByCategoryContainer">
        <h1>Top Categories </h1>

        <div className="cardContainer">
          {
            //if data is loading
            data && data.length < 1 && <h1>Loading...</h1>
          }

          {data &&
            data.length > 0 &&
            (data as searchByCategoryListResponseType["results"]).map(
              (item, index) => {
                return (
                  <Card1
                    key={index}
                    tittle={item.name}
                    link={`/listing/all/${item.name}`}
                    actionLink="Explore"
                    backgroundImage={item.image}
                  />
                );
              }
            )}
        </div>
      </div>
    </div>
  );
}
