import Nav from "../../components/layout/nav/nav";
import BusinessCatagories from "./businessCatagories/businessCatagories";
import SearchByCategory from "./searchByCategory/searchByCategory";
import SearchSection from "./searchSection/searchSection";
import TrendingBusinessSection from "./trendingBusinessPlaces/trendingBusinessSection";
import "./listingHome.scss";
// import Requisites from "./requisites/requisites";
// import { FeaturedCities } from "./featuredCities/featuredCities";
import SearchByType from "./searchByType/SearchByType";
// import FromOurBlog from "./fromOurBlog/fromOurBlog";
import Footer from "../../components/layout/footer/footer";
export default function ListingHome() {
  return (
    <div className="listingHome">
      <Nav showSearchBar={true} />
      <SearchSection />
      <SearchByCategory />
      <TrendingBusinessSection />

      <BusinessCatagories />
      {/* <Requisites /> */}
      {/* <FeaturedCities /> */}
      <SearchByType />
      {/* <FromOurBlog /> */}
      <Footer />
    </div>
  );
}
