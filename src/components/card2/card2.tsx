import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import "./card2.scss";

export default function Card2({
  image,
  keywords,
  isFeatured,
  title,
  location,
  rating,
  price,
  link,
}: {
  image: string;
  keywords: string[];
  isFeatured: boolean;
  title: string;
  location: string;
  rating: { reviewCount: number; reviewRating: number };
  price: string;
  link: string;
}) {
  return (
    <a className="card2Wrapper" href={link}>
      <div className="card2">
        <div className="image">
          <img src={image} alt="business Pic" />
        </div>
        <div className="content">
          {isFeatured && <div className="featured">Featured</div>}
          <div className="top">
            <div className="keywords">
              {keywords.map((keyword) => (
                <p key={keyword}>{keyword}</p>
              ))}
            </div>
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
    </a>
  );
}
