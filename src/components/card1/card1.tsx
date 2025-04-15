import "./card1.scss"

export default function Card1({
  tittle,
  link,
  actionLink,
  backgroundImage,
}: {
  tittle: string;
  link: string;
  actionLink: string;
  backgroundImage: string;
}) {
  return (
    <div className="card1">
      <div className="card1__content">
        <p>{tittle}</p>
        <a href={link}>{actionLink}</a>
      </div>
      <div className="card1__background">
        <img src={backgroundImage} alt="background" />
      </div>
    </div>
  );
}
