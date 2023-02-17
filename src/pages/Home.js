import axios from "axios";
import React, { useState } from "react";
import Meal from "../components/Meal";

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [areas, setAreas] = useState([]);
  const [textInput, setTextInput] = useState(0);
  const [areaFilter, setAreaFilter] = useState([]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setTextInput(text.length);
    if (!text) {
      setMeals([]);
      setAreas([]);
      return;
    }
    axios
      .get("https://www.themealdb.com/api/json/v1/1/search.php?s=" + text)
      .then((res) => {
        res.data.meals
          ? setMeals(
              res.data.meals.filter((meal) => meal.strArea !== "Unknown")
            )
          : setMeals([]);
        res.data.meals
          ? setAreas([
              ...new Set(
                res.data.meals
                  .map((meal) => meal.strArea)
                  .filter((area) => area !== "Unknown")
              ),
            ])
          : setAreas([]);
      });
  };

  return (
    <main>
      <div className="inputs-container">
        <h1>Recherchez une recette</h1>
        <input
          type="text"
          name="meal-input"
          id="meal-input"
          placeholder="Saisir une recette"
          onChange={handleTextChange}
        />
        {areas && (
          <div className="filter-container">
            <ul className="country-radio">
              {areas.map((area) => {
                return (
                  <div className="country-radio-element">
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
            <input
              type="button"
              value="Reset filters"
              className="reset-filters"
              onClick={() => {
                setAreaFilter([]);
                document
                  .querySelectorAll(".country-radio-card")
                  .forEach((item) => {
                    item.classList.remove("active");
                  });
              }}
            />
          </div>
        )}
      </div>
      <div className="main-container">
        {meals[0] ? (
          <div className="recipe-cards-container">
            {areaFilter[0]
              ? meals
                  .filter((meal) => areaFilter.includes(meal.strArea))
                  .map((meal) => {
                    return <Meal key={meal.idMeal} recipe={meal} />;
                  })
              : meals.map((meal) => {
                  return <Meal key={meal.idMeal} recipe={meal} />;
                })}
          </div>
        ) : (
          <h2>
            {textInput === 0
              ? "Saisissez un nom de recette"
              : "Aucune recette trouvee"}
          </h2>
        )}
      </div>
    </main>
  );
};

export default Home;
