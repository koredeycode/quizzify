//import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";

function HomePage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    amount: 10,
    category: "",
    difficulty: "",
    type: "",
  });

  const categories = [
    { value: "9", name: "General Knowledge" },
    { value: "10", name: "Entertainment: Books" },
    { value: "11", name: "Entertainment: Film" },
    { value: "12", name: "Entertainment: Music" },
    { value: "13", name: "Entertainment: Musicals & Theatres" },
    { value: "14", name: "Entertainment: Television" },
    { value: "15", name: "Entertainment: Video Games" },
    { value: "16", name: "Entertainment: Board Games" },
    { value: "17", name: "Science & Nature" },
    { value: "18", name: "Science: Computers" },
    { value: "19", name: "Science: Mathematics" },
    { value: "20", name: "Mythology" },
    { value: "21", name: "Sports" },
    { value: "22", name: "Geography" },
    { value: "23", name: "History" },
    { value: "24", name: "Politics" },
    { value: "25", name: "Art" },
    { value: "26", name: "Celebrities" },
    { value: "27", name: "Animals" },
    { value: "28", name: "Vehicles" },
    { value: "29", name: "Entertainment: Comics" },
    { value: "30", name: "Science: Gadgets" },
    { value: "31", name: "Entertainment: Japanese Anime & Manga" },
    { value: "32", name: "Entertainment: Cartoon & Animations" },
  ];
  const difficulties = ["easy", "medium", "hard"];
  const types = ["multiple", "boolean"];

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    if (name === "numberOfQuestions") {
      let newValue = Number(value);

      // Apply minimum and maximum limits
      newValue = Math.max(10, Math.min(50, newValue));

      setFilter((prevFilter) => ({
        ...prevFilter,
        [name]: newValue,
      }));
    } else {
      setFilter((prevFilter) => ({
        ...prevFilter,
        [name]: value,
      }));
    }
  };
  const handleSubmit = () => {
    navigate("/quiz", { state: { ...filter } });
  };

  return (
    <>
      <Navbar />
      <div class="container">
        <div class="">
          <div class="text-center">
            <h2 class="card-title m-3">Welcome to the Quiz App!</h2>
            <p>Test your knowledge with challenging quizzes.</p>
          </div>
          <div className="mx-auto">
            <div class="row g-3">
              <div class="col-md-3">
                <label for="number" class="form-label">
                  Questions
                </label>
                <input
                  className="form-control"
                  id="number"
                  type="number"
                  name="amount"
                  value={filter.amount}
                  onChange={handleFilterChange}
                />
              </div>
              <div class="col-md-3">
                <label for="category" class="form-label">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={filter.category}
                  onChange={handleFilterChange}
                  className="form-select text-capitalize"
                >
                  <option value="">Any Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div class="col-md-3">
                <label for="difficulty" class="form-label">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  id="difficulty"
                  value={filter.difficulty}
                  onChange={handleFilterChange}
                  className="form-select text-capitalize"
                >
                  <option value="">Any Difficulty</option>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
              <div class="col-md-3">
                <label for="type" class="form-label">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={filter.type}
                  onChange={handleFilterChange}
                  className="form-select text-capitalize"
                >
                  <option value="">Any Type</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === "boolean" ? "True/False" : "Multiple Choice"}
                    </option>
                  ))}
                </select>
              </div>
              <div class="text-center mx-auto">
                <button onClick={handleSubmit} className="btn btn-primary">
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
