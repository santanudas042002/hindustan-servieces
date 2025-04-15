import { dummyRequisitesResult } from "../../../data/dummyRequisitesResult";
import "./requisites.scss";

export default function Requisites() {
  return (
    <div className="requisitesWrapper">
      <div className="container">
        {dummyRequisitesResult.results.map((requisite, index) => {
          return (
            <a href={requisite.url} className="requisite" key={index}>
              <h3>{requisite.name}</h3>
              <div className="requisiteImages">
                {requisite.image.map((image, index) => {
                  return (
                    <div className="requisiteImage" key={index}>
                      <img src={image.image} alt={image.name} />
                      <p>{image.name}</p>
                    </div>
                  );
                })}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
