import { ReactNode, useEffect, useRef } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import "./slider1.scss";

export default function Slider1({ children }: { children: ReactNode }) {
  const slider1Container = useRef<HTMLDivElement>(null);
  const actionButtonContainer = useRef<HTMLDivElement>(null);

  const gap = 20;

  function moveLeftSlider() {
    if (
      !slider1Container.current ||
      !actionButtonContainer.current ||
      !slider1Container.current.parentElement
    )
      return;

    const slider1ContainerChildren = slider1Container.current.children;

    // width of a card

    const cardWidth = slider1ContainerChildren[0].clientWidth + gap;

    const viewWidth = slider1Container.current.parentElement.clientWidth;

    const totalCardViewCanTake = Math.floor(viewWidth / cardWidth);

    const currentTranslateX = slider1Container.current.style.transform
      ? parseInt(
          slider1Container.current.style.transform.split("(")[1].split("px")[0]
        )
      : 0;

    //calculate current index
    const currentIndex = Math.floor(Math.abs(currentTranslateX / cardWidth));

    //check if there is enough card to move left

    if (currentIndex - totalCardViewCanTake < 0) {
      //move all the way to the left
      slider1Container.current.style.transform = `translateX(0px)`;
      return;
    }

    //move left

    slider1Container.current.style.transform = `translateX(${
      currentTranslateX + cardWidth * totalCardViewCanTake
    }px)`;
  }
  function moveRightSlider() {
    if (
      !slider1Container.current ||
      !actionButtonContainer.current ||
      !slider1Container.current.children ||
      !actionButtonContainer.current.children ||
      !slider1Container.current.parentElement
    )
      return;

    const slider1ContainerChildren = slider1Container.current.children;
    const viewWidth =
      slider1Container.current.parentElement.clientWidth -
      //remove padding
      (parseInt(
        window.getComputedStyle(slider1Container.current.parentElement)
          .paddingLeft
      ) +
        parseInt(
          window.getComputedStyle(slider1Container.current.parentElement)
            .paddingRight
        ));

    // width of a card

    const cardWidth = slider1ContainerChildren[0].clientWidth + gap;

    const totalCardViewCanTake = Math.floor(viewWidth / cardWidth);

    const currentTranslateX = slider1Container.current.style.transform
      ? parseInt(
          slider1Container.current.style.transform.split("(")[1].split("px")[0]
        )
      : 0;

    //calculate current index
    const currentIndex = Math.floor(Math.abs(currentTranslateX / cardWidth));

    //check if there is enough card to move right

    if (
      currentIndex + totalCardViewCanTake * 2 >=
      slider1ContainerChildren.length
    ) {
      //move all the way to the right
      slider1Container.current.style.transform = `translateX(${-(
        slider1Container.current.clientWidth - viewWidth
      )}px)`;
      return;
    }

    //move right

    slider1Container.current.style.transform = `translateX(${
      currentTranslateX - cardWidth * totalCardViewCanTake
    }px)`;
  }
  function hideLeftAndRightArrow() {
    if (
      !slider1Container.current ||
      !actionButtonContainer.current ||
      !slider1Container.current.parentElement
    )
      return;

    const slider1ContainerChildren = slider1Container.current.children;

    // width of a card

    const cardWidth = slider1ContainerChildren[0].clientWidth + gap;

    const viewWidth = slider1Container.current.parentElement.clientWidth;

    const totalCardViewCanTake = Math.floor(viewWidth / cardWidth);

    const currentTranslateX = slider1Container.current.style.transform
      ? parseInt(
          slider1Container.current.style.transform.split("(")[1].split("px")[0]
        )
      : 0;

    //calculate current index
    const currentIndex = Math.ceil(Math.abs(currentTranslateX / cardWidth));

    // show left and right arrow
    (actionButtonContainer.current.children[0] as HTMLElement).style.display =
      "block";
    (actionButtonContainer.current.children[1] as HTMLElement).style.display =
      "block";

    //check if there is enough card to move left

    if (currentIndex <= 0) {
      (actionButtonContainer.current.children[0] as HTMLElement).style.display =
        "none";
    }

    if (
      currentIndex + totalCardViewCanTake >=
      slider1ContainerChildren.length
    ) {
      (actionButtonContainer.current.children[1] as HTMLElement).style.display =
        "none";
    }

    //check if there is enough card to move right
  }

  useEffect(() => {
    hideLeftAndRightArrow();
    //add transition event listener to hide left and right arrow
    if (slider1Container.current) {
      slider1Container.current.addEventListener(
        "transitionend",
        hideLeftAndRightArrow
      );
    }
    return () => {
      if (slider1Container.current) {
        slider1Container.current.removeEventListener(
          "transitionend",
          hideLeftAndRightArrow
        );
      }
    };
  });

  return (
    <div className="slider1Wrapper">
      <div className="actionButton" ref={actionButtonContainer}>
        <div className="leftArrow" onClick={moveLeftSlider}>
          <ArrowLeftIcon />
        </div>
        <div className="rightArrow" onClick={moveRightSlider}>
          <ArrowRightIcon />
        </div>
      </div>
      <div className="slider1Container" ref={slider1Container}>
        {children}
      </div>
    </div>
  );
}
