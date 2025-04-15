import { useEffect, useState } from "react";
import Card4 from "../../../components/card4/card4";
import Slider1 from "../../../components/slider1/slider1";
import { dummySearchByTypeListResult } from "../../../data/dummySearchByTypeListResult";
import searchByCategoryListResponseType from "../../../interface/searchByCategoryListResponseType";
import "./searchByType.scss";
import axios from "axios";
export default function SearchByType() {
  const [data, setData] = useState<searchByCategoryListResponseType["results"]>(
    dummySearchByTypeListResult.results
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
    <div className="searchByTypeWrapper">
      <h1>Search By Type</h1>
      <p>Search by type the top business around You</p>

      <Slider1>
        {(data as searchByCategoryListResponseType["results"]).map(
          (item, index) => (
            <Card4
              key={index}
              image={item.image}
              tittle={item.name}
              link={item.link === "" ? "" : `/listing/all/${item.name}`}
            />
          )
        )}
      </Slider1>
    </div>
  );
}
