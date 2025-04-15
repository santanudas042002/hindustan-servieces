// import { useQuery } from "@tanstack/react-query";
import ResultDataType from "../../../interface/resultResponseType";
import Card2 from "../../../components/card2/card2";
import "./trendingBusinessSection.scss";
import Slider1 from "../../../components/slider1/slider1";
import axios from "axios";
import { useEffect, useState } from "react";

export default function TrendingBusinessSection() {
  const [data, setData] = useState<ResultDataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const response = await axios.get(
              import.meta.env.VITE_BACKEND_URL + "/home/new-business-around",
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
              import.meta.env.VITE_BACKEND_URL + "/home/new-business-around",
              {}
            );
            setData(response.data);
          }
        );
        return;
      }
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/home/new-business-around",
        {}
      );
      setData(response.data);
    };
    fetchData();
  }, []);

  return (
    <div className="trendingBusinessSection">
      <h1>New business around you</h1>
      {data.length < 1 && <p>Loading...</p>}
      {data.length > 0 && (
        <>
          <Slider1>
            {(data as ResultDataType[]).map((result) => (
              <Card2
                key={result._id}
                image={result.picture}
                keywords={result.BusinessKeywords}
                isFeatured={false}
                title={result.BusinessName}
                location={`${result.BusinessLocation.address}, ${result.BusinessLocation.city}, ${result.BusinessLocation.state}`}
                rating={{
                  reviewRating: result.rating,
                  reviewCount: result.ratingCount,
                }}
                price={result.BusinessAvgPrice}
                link={"business/" + result._id}
              />
            ))}
          </Slider1>
        </>
      )}
    </div>
  );
}
