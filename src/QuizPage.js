import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "./Navbar";

function QuizPage() {
  const [quizData, setQuizData] = useState([]);
  const [btnColors, setBtnColors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const location = useLocation();
  const { amount, type, difficulty, category } = location.state || {};
  const typeTxt = type ? `&type=${type}` : "";
  const categoryTxt = category ? `&category=${category}` : "";
  const difficultyTxt = difficulty ? `&difficulty=${difficulty}` : "";

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log(event);
      const optionKeyCodes = [65, 66, 67, 68];
      if (event.keyCode === 37 || event.keyCode === 80) {
        // Left arrow key
        goToPreviousQuestion();
      } else if (event.keyCode === 39 || event.keyCode === 78) {
        // Right arrow key
        goToNextQuestion();
      } else if (event.keyCode === 83) {
        document.getElementById("submit-btn").click();
      } else if (optionKeyCodes.includes(event.keyCode)) {
        const optionsList = document.getElementById("options-list");
        const options = optionsList.getElementsByTagName("li");
        const optionIndex = optionKeyCodes.indexOf(event.keyCode);
        const option = options[optionIndex];
        if (option) {
          option.click();
        }
      }
    };

    // Variables to track touch start and end positions
    let touchStartX = 0;
    let touchEndX = 0;

    // Add touchstart event listener to track the starting position
    document.addEventListener("touchstart", (event) => {
      touchStartX = event.touches[0].clientX;
    });

    // Add touchend event listener to track the ending position
    document.addEventListener("touchend", (event) => {
      touchEndX = event.changedTouches[0].clientX;

      // Calculate the swipe distance
      const swipeDistance = touchEndX - touchStartX;

      // Check if the swipe distance is greater than a threshold value (e.g., 50 pixels)
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          // Swipe right
          goToPreviousQuestion();

          console.log("Swiped right");
        } else {
          // Swipe left
          goToNextQuestion();
          console.log("Swiped left");
        }
      }
    });

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchQuizData = async () => {
      const url = `https://opentdb.com/api.php?amount=${
        amount ? amount : 10
      }${categoryTxt}${typeTxt}${difficultyTxt}&encode=base64`;
      // const url = `http://localhost:3000/data`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        const data = await response.json();
        const realData = data.results.map((q) => {
          const retObj = {
            question: q.question,
            options: [...q.incorrect_answers, q.correct_answer].sort(
              (a, b) => Math.random() - 0.5
            ),
            answer: q.correct_answer,
          };
          return retObj;
        });
        if (realData.length < 1) {
          throw new Error("No questions found");
        }
        setQuizData(realData);
        setIsLoading(false);
        setBtnColors(
          Object.fromEntries(realData.map((e, idx) => [idx, "outline-success"]))
        );
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setFetchError(error.message);
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  // State to keep track of current question index and user answers
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const navigate = useNavigate();

  // Function to handle selecting an answer
  const handleAnswerSelect = (selectedAnswer, index) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestion] = selectedAnswer;
      return updatedAnswers;
    });
    setBtnColors((prev) => {
      const updatedColors = { ...prev };
      updatedColors[index] = "success";
      return updatedColors;
    });
    setTimeout(goToNextQuestion, 500);
  };

  const goToPreviousQuestion = () => {
    console.log("inside prev");
    setCurrentQuestion((prevQuestion) => {
      const newQuestion = prevQuestion - 1;
      return newQuestion >= 0 ? newQuestion : prevQuestion;
    });
  };

  const goToNextQuestion = () => {
    setCurrentQuestion((prevQuestion) => {
      const newQuestion = prevQuestion + 1;
      console.log(newQuestion, quizData.length);
      return newQuestion < quizData.length ? newQuestion : prevQuestion;
    });
  };

  // Function to handle going to a specific question
  const goToSpecificQuestion = (index) => {
    setCurrentQuestion(index);
  };

  // Function to calculate the score based on user answers
  const calculateScore = () => {
    const resultObj = {
      data: [],
    };
    let score = 0;
    quizData.forEach((question, index) => {
      let gotten = false;
      const chosen_answer = userAnswers[index];
      if (chosen_answer === question.answer) {
        gotten = true;
        score++;
      }
      resultObj.data.push({ ...question, gotten, chosen_answer });
    });
    resultObj["score"] = score;
    resultObj["overall"] = quizData.length;
    resultObj["quizfilters"] = { amount, type, difficulty, category };
    return resultObj;
  };

  // Render quiz question and options
  const renderQuestion = () => {
    if (isLoading) {
      return (
        <div className="text-center mt-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="container mt-4">
          <div className="alert alert-danger no-radius" role="alert">
            Failed to fetch quiz data. Please check your internet connection or
            quiz selection and try again later.
            <Link to="/">Go home</Link>
          </div>
        </div>
      );
    }

    const question = quizData[currentQuestion];

    return (
      <div className="appmain mx-auto">
        <div className="card no-radius mt-4">
          <div className="card-header d-flex justify-content-between">
            <div className="col-8">
              <h2>Question {currentQuestion + 1}</h2>
              <p>{atob(question.question)}</p>
            </div>
            <div className="col-4 m-1 d-flex justify-content-end">
              <div>
                <button
                  id="submit-btn"
                  className="btn btn-warning"
                  onClick={handleSubmit}
                  disabled={userAnswers.length < quizData.length}
                >
                  <span>Submit </span>
                  <i className="bi bi-check-circle-fill me-1"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <ul className="list-group list-unstyled" id="options-list">
              {question.options.map((option, index) => (
                <li
                  key={index}
                  className={`list-group-item${
                    userAnswers[currentQuestion] === option ? " bg-primary" : ""
                  }`}
                  onClick={() => handleAnswerSelect(option, currentQuestion)}
                >
                  <label>
                    <input
                      className="form-check-input me-1"
                      type="radio"
                      name="answer"
                      value={atob(option)}
                      disabled
                    />
                    {atob(option)}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-footer">{renderNavigationButtons()}</div>
        </div>
      </div>
    );
  };

  // Render previous and next buttons based on current question index
  const renderNavigationButtons = () => {
    return (
      <div className="">
        <div className="d-flex flex-wrap justify-content-center mt-3">
          {currentQuestion > 0 && (
            <div className="m-1">
              <button
                className="btn btn-secondary"
                onClick={goToPreviousQuestion}
              >
                <i className="bi bi-caret-left-fill me-1"></i>
                <span>Previous</span>
              </button>
            </div>
          )}
          {currentQuestion < quizData.length - 1 && (
            <div className="m-1">
              <button className="btn btn-secondary" onClick={goToNextQuestion}>
                <span>Next </span>
                <i className="bi bi-caret-right-fill me-1"></i>
              </button>
            </div>
          )}
        </div>
        <div
          className="d-flex flex-wrap justify-content-center mt-3"
          role="group"
          aria-label="Basic outlined example"
        >
          {quizData.map((question, index) => {
            return (
              <div className="">
                <button
                  className={`btn btn-${btnColors[index]} no-radius`}
                  onClick={() => goToSpecificQuestion(index)}
                >
                  {(() => {
                    const str = String(index + 1);
                    if (str.length === 1) {
                      return "0" + str;
                    } else if (str.length === 2) {
                      return str;
                    } else if (str.length > 2) {
                      return str.slice(0, 2);
                    }
                  })()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Function to handle quiz submission
  const handleSubmit = () => {
    const scoreData = calculateScore();
    navigate("/result", { state: scoreData });
    // You can perform other actions with the score, like storing it in a database
  };

  return (
    <div>
      <Navbar />
      {renderQuestion()}
    </div>
  );
}

export default QuizPage;
