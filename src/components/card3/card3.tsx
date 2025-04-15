import "./card3.scss"

export default function Card3({
  tittle,
  image,
  bottomTittle,
  bottomDescription,
}: {
  tittle: string;
  image: string;
  bottomTittle: string;
  bottomDescription: string;
}) {
  return (
    <div className="card3Wrapper">
      <div className="card3">
        <div className="image">
          <img src={image} alt="business Pic" />
        </div>
        <div className="content">
          <div className="top">
            <h5 className="tittle">{tittle}</h5>
          </div>
          <div className="bottom">
            <h5 className="bottomTittle">{bottomTittle}</h5>
            <p className="bottomDescription">{bottomDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
