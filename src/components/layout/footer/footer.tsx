import "./footer.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import PlaceIcon from "@mui/icons-material/Place";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CorporateFare from "@mui/icons-material/CorporateFare";
import staticData from "./../../../../staticData.json";

export default function Footer() {
  const [errorMessage, setErrorMessage] = useState("");
  const handleMouseDown = async () => {
    const subscriptionElement = document.querySelector(".subscription");
    if (subscriptionElement) {
      subscriptionElement.classList.add("onAction");

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const emailInput = document.querySelector(
          ".add-email"
        ) as HTMLInputElement;
        await axios.post(
          `${backendUrl}/collectNewsLetterEmail/collect-news-letter-email`,
          {
            email: emailInput.value,
          }
        );
        subscriptionElement.classList.add("done");
      } catch (error) {
        if (error instanceof AxiosError && error.response?.data.message) {
          setErrorMessage(error.response.data.message);
          return;
        }
        setErrorMessage("Something went wrong, please try again later.");
      }
    }
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: Use smooth scrolling
    });
    // Add any additional logic for handling footer link clicks
  };

  return (
    <footer>
      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setErrorMessage("")}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <div className="d-flex  flex-wrap footer-wrapper">
        <div>
          <p className="footer-heading">Quick Links</p>
          <div className="d-flex">
            <div className="links-wrapper">
              <Link onClick={handleClick} to="/">
                Home
              </Link>
              <Link onClick={handleClick} to="/about-us">
                About
              </Link>
              <Link onClick={handleClick} to="/contact-us">
                Contact
              </Link>
              {/* <Link onClick={handleClick} to="#">
                Services
              </Link> */}
              <Link onClick={handleClick} to="/privacy-policy">
                Privacy Policy
              </Link>
              <Link onClick={handleClick} to="/terms">
                Terms of use
              </Link>
              <Link onClick={handleClick} to="/refund-policy">
                Refund Policy
              </Link>
              <Link onClick={handleClick} to="/shipping-policy">
                Shipping Policy
              </Link>
            </div>
            <div className="links-wrapper">
              {/* <Link onClick={handleClick} to="#">
                Home
              </Link>
              <Link onClick={handleClick} to="#">
                About
              </Link> */}
            </div>
          </div>
        </div>

        <div>
          <p className="footer-heading">Contact Us</p>
          <div className="d-flex">
            <div className="links-wrapper">
              <p>
                <CorporateFare /> Miglani Retail
              </p>
              <p>
                <PlaceIcon /> {staticData.contactAddress}
              </p>
              <p>
                <LocalPhoneIcon /> {staticData.contactPhone}
              </p>
              <p>
                <EmailIcon /> {staticData.contactEmail}
              </p>
              <p className="footer-icons mb-0">
                <FacebookTwoToneIcon />
                <TwitterIcon />
                <InstagramIcon />
                <LinkedInIcon />{" "}
              </p>
            </div>
          </div>
        </div>

        {/* <div>
          <p className="footer-heading">Other Verticals</p>
          <div className="d-flex">
            <div className="links-wrapper">
              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Services</a>
            </div>
            <div className="links-wrapper">
              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Services</a>
            </div>
            <div className="links-wrapper">
              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Services</a>
            </div>
            <div className="links-wrapper">
              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Services</a>
            </div>
         
          </div>
        </div> */}
        <div style={{ position: "relative" }}>
          <p className="footer-heading p-0 m-0">Subscribe to Us!</p>
          <div className="footer-container flex-column subscribe p-0">
            <p>Subscribe to us for daily news and updates.</p>
            <div className="content">
              <form
                className="subscription"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                }}
              >
                <input
                  className="add-email"
                  type="email"
                  placeholder="subscribe@me.now"
                />
                <button
                  className="submit-email"
                  type="button"
                  onMouseDown={handleMouseDown}
                >
                  <span className="before-submit">Subscribe</span>
                  <span className="after-submit">
                    Thank you for subscribing!
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="credit">
        Copyright © 2024 bharatbazzar (Miglani Retail), All rights reserved |
        Designed & Developed by{" "}
        <a href="https://therankshell.com/" className="creditLink">
          Rankshell
        </a>
      </div>
    </footer>
  );
}
