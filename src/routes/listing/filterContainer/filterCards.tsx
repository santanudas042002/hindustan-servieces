import { useContext, useEffect, useRef } from "react";
import "./filterCards.scss";
import searchFilterContext from "../../../contexts/searchFilterContext/searchFilterContext";

export default function FilterCards({
  children,
  capsuleOptions,
  tittle,
}: {
  children?: React.ReactNode;
  capsuleOptions?: string[];
  tittle?: string;
}) {
  const { selectedFilter, updateSelectedFilters } =
    useContext(searchFilterContext);
  const capsuleRef = useRef<HTMLDivElement>(null);


  const handleCapsuleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const option = (e.target as HTMLDivElement).innerText;
    updateSelectedFilters((prev) => {
      return [...prev, option];
    });

    if (selectedFilter?.includes(option)) {
      updateSelectedFilters((prev) => {
        return prev.filter((item) => item !== option);
      });
    }
  };

  useEffect(() => {
    if (!capsuleRef.current) return;
    if (!capsuleRef.current.children) return;

    const children = capsuleRef.current.children;

    for (let i = 0; i < children.length; i++) {
      if (selectedFilter.includes(children[i].textContent as string)) {
        children[i].classList.add("selected");
      } else {
        children[i].classList.remove("selected");
      }
    }
  });

  return (
    <div className="filterCards">
      {tittle && <p className="tittle">{tittle}</p>}
      {capsuleOptions && (
        <div className="capsuleOptions" ref={capsuleRef}>
          {capsuleOptions.map((option) => (
            <div
              className="capsuleOption"
              key={option}
              onClick={handleCapsuleClick}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
