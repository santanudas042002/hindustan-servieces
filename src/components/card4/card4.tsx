import "./card4.scss";
export default function Card4({
  image,
  tittle,
  link,
}: {
  image: string;
  tittle: string;
  link: string;
}) {
  return (
    <a className="card4Wrapper" href={link}>
      <div className="card4Image">
        <img src={image} alt={tittle} />
      </div>
      <div className="card4Tittle">
        <h5>{tittle}</h5>
      </div>
    </a>
  );
}
