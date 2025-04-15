import { useEffect, useState } from "react";
import axios from "axios";
import "./businessCategory.scss";
import { resultOfCategory } from "../../../interface/resultOfCatagory";

export default function BusinessCatagories() {
  const [categories, setCategories] = useState<resultOfCategory["results"]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/home/get-catagories."
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // You can handle errors here, like setting an error state
      }
    };
    fetchData();
  }, []);

  return (
    <div className="businessCategoryWrapper">
      <div className="container">
        {categories.map((item, index) => (
          <a href={item.name} key={index}>
            <div className="businessCategory">
              <img src={item.image} alt={item.name} />
              <p>{item.name}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
