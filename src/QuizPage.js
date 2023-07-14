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
    console.log("separate useeffect");
  }, []);
  useEffect(() => {
    console.log("useeffect");
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
    setCurrentQuestion((prevQuestion) => {
      const newQuestion = prevQuestion - 1;
      return newQuestion >= 0 ? newQuestion : prevQuestion;
    });
  };

  const goToNextQuestion = () => {
    setCurrentQuestion((prevQuestion) => {
      const newQuestion = prevQuestion + 1;
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
    return resultObj;
  };

  // Render quiz question and options
  const renderQuestion = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (fetchError) {
      return (
        <div>
          <div className="alert alert-danger" role="alert">
            Failed to fetch quiz data. Please try again later.
          </div>
          <Link to="/">Go home</Link>
        </div>
      );
    }

    const question = quizData[currentQuestion];

    return (
      <div>
        <div class="card">
          <div class="card-header">
            <h2>Question {currentQuestion + 1}</h2>
            <p>{atob(question.question)}</p>
          </div>
          <div class="card-body">
            <ul className="list-group">
              {question.options.map((option, index) => (
                <li key={index} className="list-group-item">
                  <label>
                    <input
                      className="form-check-input me-1"
                      type="radio"
                      name="answer"
                      value={atob(option)}
                      checked={userAnswers[currentQuestion] === option}
                      onClick={() =>
                        handleAnswerSelect(option, currentQuestion)
                      }
                    />
                    {atob(option)}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div class="card-footer">{renderNavigationButtons()}</div>
        </div>
      </div>
    );
  };

  // Render previous and next buttons based on current question index
  const renderNavigationButtons = () => {
    return (
      <div className="container">
        <div className="row">
          {currentQuestion > 0 && (
            <div className="col-3">
              <button
                className="btn btn-secondary"
                onClick={goToPreviousQuestion}
              >
                <i class="bi bi-star me-1"></i>Previous
              </button>
            </div>
          )}
          {currentQuestion < quizData.length - 1 && (
            <div className="col-3">
              <button className="btn btn-secondary" onClick={goToNextQuestion}>
                <i class="bi bi-star me-1"></i>Next
              </button>
            </div>
          )}
          {currentQuestion === quizData.length - 1 && (
            <div className="col-3">
              <button className="btn btn-warning" onClick={handleSubmit}>
                <i class="bi bi-star me-1"></i>Submit
              </button>
            </div>
          )}
        </div>
        <div class="row" role="group" aria-label="Basic outlined example">
          {quizData.map((question, index) => {
            return (
              <div className="col-2">
                <button
                  className={`btn btn-${btnColors[index]}`}
                  onClick={() => goToSpecificQuestion(index)}
                >
                  {index + 1}
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 37) {
        // Left arrow key
        goToPreviousQuestion();
      } else if (event.keyCode === 39) {
        // Right arrow key
        goToNextQuestion();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <Navbar />
      {renderQuestion()}
    </div>
  );
}

export default QuizPage;
