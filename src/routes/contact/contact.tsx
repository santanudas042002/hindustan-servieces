import Layout from "../../components/layout/layout";
import PlaceIcon from "@mui/icons-material/Place";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import staticData from "./../../../staticData.json";

export default function Contact() {
  return (
    <Layout>
      <div className="banner">
        <h2>Contact Us</h2>
        <p>
          Our platform serves as a bridge between businesses and customers,
          making it easier than ever to find exactly what you're looking for.
        </p>
        {/* <PrimaryButton /> */}
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <div className="contact-wrapper">
              <h2 className="section-heading line my-4">Connect with Us</h2>
              <div className="d-flex">
                <div className="links-wrapper">
                  <p className="flex">
                    <CorporateFareIcon /> Miglani Retail
                  </p>
                  <p className="flex">
                    <PlaceIcon /> {staticData.contactAddress}
                  </p>
                  <p>
                    <LocalPhoneIcon /> {staticData.contactPhone}
                  </p>
                  <p>
                    <EmailIcon /> {staticData.contactEmail}
                  </p>
                  {/* <p className="footer-icons mb-0">
                    <FacebookTwoToneIcon />
                    <TwitterIcon />
                    <InstagramIcon />
                    <LinkedInIcon />{" "}
                  </p> */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-5 ">
            <div className=" my-4">
              <div className="img-wrapper">
                <img
                  src="https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Contact Image"
                />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <iframe
              src={staticData.googleMap}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </Layout>
  );
}
