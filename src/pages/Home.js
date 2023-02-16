import axios from "axios";
import React, { useState } from "react";
import Meal from "../components/Meal";

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areaFilter, setAreaFilter] = useState([]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (!text) {
      setMeals([]);
      setAreas([]);
      return;
    }
    axios
      .get("https://www.themealdb.com/api/json/v1/1/search.php?s=" + text)
      .then((res) => {
        setMeals(res.data.meals.filter((meal) => meal.strArea !== "Unknown"));
        setAreas([
          ...new Set(
            res.data.meals
              .map((meal) => meal.strArea)
              .filter((area) => area !== "Unknown")
          ),
        ]);
      });
  };

  return (
    <main>
      <div className="title">
        <h1>Recherchez une recette</h1>
      </div>
      <div className="inputs-container">
        <input
          type="text"
          name="meal-input"
          id="meal-input"
          placeholder="Saisir aliment ou recette"
          onChange={handleTextChange}
        />
        {areas && (
          <ul className="country-radio-container">
            {areas.map((area) => {
              return (
                <div className="country-radio-card">
                  <input
                    key={area}
                    type="radio"
                    name="countryRadio"
                    id={area}
                    value={area}
                    onClick={(e) => {
                      const elementClass = e.target.parentElement.classList;
                      if (elementClass.contains("active")) {
                        elementClass.remove("active");
                        setAreaFilter(
                          areaFilter.filter((item) => item !== area)
                        );
                        console.log(areaFilter);
                      } else {
                        elementClass.add("active");
                        setAreaFilter([...areaFilter, area]);
                        console.log(areaFilter);
                      }
                    }}
                  />
                  <label htmlFor={area}>{area}</label>
                </div>
              );
            })}
          </ul>
        )}
        <input
          type="button"
          value="Reset filters"
          onClick={() => {
            setAreaFilter([]);
            document.querySelectorAll(".country-radio-card").forEach((item) => {
              item.classList.remove("active");
            });
          }}
        />
      </div>
      <div className="recipe-cards-container">
        {meals ? (
          areaFilter[0] ? (
            meals
              .filter((meal) => areaFilter.includes(meal.strArea))
              .map((meal) => {
                return <Meal key={meal.idMeal} recipe={meal} />;
              })
          ) : (
            meals.map((meal) => {
              return <Meal key={meal.idMeal} recipe={meal} />;
            })
          )
        ) : (
          <h2>Aucune recette trouvée</h2>
        )}
      </div>
    </main>
  );
};

export default Home;
