import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import "./card.scss";
import { Link } from "react-router-dom";
import { LegacyRef, Ref } from "react";

export default function Cards({
  image,
  keywords,
  isFeatured,
  title,
  location,
  rating,
  price,
  refVar,
  id,
}: {
  image: string;
  keywords: string[];
  isFeatured: boolean;
  title: string;
  location: string;
  rating: { reviewCount: number; reviewRating: number };
  price: String;
  //ref useRef type
  refVar: Ref<HTMLDivElement>;
  id: string;
}) {
  return (
    <Link
      className="cardWrapper"
      ref={refVar as LegacyRef<HTMLAnchorElement>}
      to={`/business/${id}`}
    >
      <div className="card">
        <div className="image">
          <img src={image} alt="business Pic" />
        </div>
        <div className="content">
          <div className="top">
            <div className="keywords">
              {keywords.map((keyword) => (
                <p key={keyword}>{keyword}</p>
              ))}
            </div>

            {isFeatured && <div className="featured">Featured</div>}
          </div>
          <div className="middle">
            <p className="title">{title}</p>
            <div className="locationContainer">
              <LocationOnIcon />
              <p>{location}</p>
            </div>
          </div>
          <div className="bottom">
            <div className="ratingContainer">
              <p>{rating.reviewRating}</p>
              <StarIcon />
              <p>{rating.reviewCount} Reviews</p>
            </div>
            <div className="priceContainer">
              {/* Indian PRice */}
              <p>{price}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
