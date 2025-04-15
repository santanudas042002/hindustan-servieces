import React from "react";
import "./buttons.scss";
import { Link } from "react-router-dom";

interface PrimaryButtonProps {
  text?: string;
  size?: "sm" | "m" | "lg"; // Make size optional and provide a default value
  link?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text = "Contact Now",
  size = "m",
  link,
}) => {
  // Assign 'm' as default size
  let padding: string;

  // Type the padding to ensure type safety
  switch (size) {
    case "sm":
      padding = "5px 10px";
      break;
    case "m":
      padding = "10px 20px";
      break;
    case "lg":
      padding = "15px 30px";
      break;
    default:
      padding = "10px 20px"; // Default padding for unknown size
  }

  const buttonStyle: React.CSSProperties = {
    padding: padding,
    fontWeight: "500",
  };

  if (link) {
    return (
      <Link className="primary-button" style={buttonStyle} to={link}>
        {text}
      </Link>
    );
  }

  return (
    <button className="primary-button" style={buttonStyle}>
      {text}
    </button>
  );
};

export default PrimaryButton;
