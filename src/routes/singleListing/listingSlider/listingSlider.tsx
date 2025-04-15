import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./listingSlider.scss";

function ListingSlider({ images }: { images: String[] }) {
  return (
    <div className="listingSliderContainer">
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        className=""
        containerClass="container"
        customTransition="all 1s linear"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        autoPlay
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 1,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 1,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 1,
          },
        }}
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image.toString()}
            alt="listing"
            className="listingSliderImage"
          />
        ))}
      </Carousel>
    </div>
  );
}

export default ListingSlider;
