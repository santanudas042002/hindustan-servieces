import Layout from "../../components/layout/layout";
import PrimaryButton from "../../components/buttons/primaryButton";
import "./about.scss"

export default function About() {
  return (
    <div className="aboutUsPage">
      <Layout>
        <div className="banner">
          <h2>About Us</h2>
          <p>
            Bharat bazzar is a Local Search engine that provides local search
            related services to users across India. The Company provides
            listings of business across various categories such as restaurants,
            hospitals, fitness centres electronics sellers and repair service
            provider, education institutes, entertainment, pet care and more.
            Business interested in being listed on the company's platform can do
            so by furnishing their business details online.
          </p>
          <PrimaryButton text="Contact Us" link="/contact-us" />
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h2 className="section-heading line my-4">Our Core Values</h2>
              <h4>RESPECT</h4>
              <p>We treat others the way we want to be treated.</p>
              <h4>INTEGRITY</h4>
              <p>We put honesty, accountability, and ethics first.</p>
              <h4>INCLUSION</h4>
              <p>
                We strive to create an environment where all feel included,
                regardless of our differences.
              </p>
              <h4>INNOVATION</h4>
              <p>
                We constantly seek to develop, improve and sustainably grow.
              </p>
              <h4>EXCELLENCE</h4>
              <p>
                We deliver on the merits of our products and services, with
                urgency and flawless execution.
              </p>
            </div>
            <div className="col-md-5 justify-content-center">
              <div className="img-blocks-container">
                <div>
                  <img src="https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                </div>
                <div>
                  <img src="https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                </div>
                <div>
                  <img src="https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="background-section">
                <img src="https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"></img>
                <div className="text-wrapper">
                  <h2 className="section-heading line my-4">Our Mission</h2>
                  <p>
                    To provide fast, free, reliable, and comprehensive
                    information to our users. . Users can find the services they
                    want & can contact the dealer.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row">
          <div className="col-md-12">
            <div className="quote">
              <h3 className="text-center">Our Core Value</h3>
              <blockquote>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Cupiditate odio doloribus eum culpa quae? Et labore est dolorem
                sapiente amet, sed illo itaque rem hic adipisci voluptate sunt
                voluptates doloremque! Cupiditate odio doloribus eum culpa quae?
                Et labore est dolorem sapiente amet, sed illo itaque rem hic
                adipisci voluptate sunt voluptates doloremque! Et labore est
                dpisci voluptate sunt voluptates doloremque!
              </blockquote>
            </div>
          </div>
        </div> */}
        </div>
      </Layout>
    </div>
  );
}
