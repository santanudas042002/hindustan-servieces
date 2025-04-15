//featuredCitiesResponseType.ts

export type FeaturedCitiesResponseType = {
  totalResults: string;
  data: {
    featuredCities: {
      totalPlaces: string;
      state: string;
      country: string;
      image: string;
    }[];
  };
};
