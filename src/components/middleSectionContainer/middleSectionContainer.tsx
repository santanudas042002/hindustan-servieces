//middleSectionContainer.tsx
import React from "react";
import "./middleSectionContainer.scss";
import Nav from "../layout/nav/nav";
import Footer from "../layout/footer/footer";

export default function MiddleSectionContainer({
  children,
  wrapperClass,
  containerClass,
}: {
  children: React.ReactNode;
  wrapperClass?: string;
  containerClass?: string;
}) {
  return (
    <>
      <Nav />
      <div className={wrapperClass + " middleContainerWrapper"}>
        <div className={containerClass + " middleContainer"}>{children}</div>
      </div>
      <Footer />
    </>
  );
}
