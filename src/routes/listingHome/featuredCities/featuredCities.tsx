//featuredCities.tsx


import "./featuredCities.scss"
import Slider1 from "../../../components/slider1/slider1";
import Card3 from "../../../components/card3/card3";
import { dummyFeaturedCitiesData } from "../../../data/dummyFeaturedCitiesData";

export const FeaturedCities = () => {
  return (
    <div className="featuredCitiesWrapper">
      <div className="container">
        <h1>Featured Cities</h1>
        <p>Choose the city You will be living next</p>

        <Slider1>
          {dummyFeaturedCitiesData.data.featuredCities.map((city) => {
            return (
              <Card3
                tittle={city.state}
                image={city.image}
                bottomTittle={city.country}
                bottomDescription={`${city.totalPlaces} Places`}
                key={city.state}
              />
            );
          })}
        </Slider1>
      </div>
    </div>
  );
};
