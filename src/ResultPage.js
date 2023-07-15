import { useLocation, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

function ResultPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const location = useLocation();
  const { score, overall, data } = location.state || {};
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
  const renderQuestion = () => {
    const question = data[currentQuestion];

    return (
      <div>
        <div class="card">
          <div class="card-header">
            <h2>Question {currentQuestion + 1}</h2>
            <p>{atob(question.question)}</p>
          </div>
          <div class="card-body">
            <ul className="list-group list-unstyled">
              {question.options.map((option, index) => (
                <li
                  key={index}
                  className={`list-group-item${
                    question.chosen_answer === option
                      ? question.gotten
                        ? " bg-success"
                        : " bg-danger"
                      : question.answer === option
                      ? " bg-success"
                      : ""
                  }`}
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
          <div class="card-footer">{renderNavigationButtons()}</div>
        </div>
      </div>
    );
  };
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
                <i class="bi bi-caret-left-fill me-1"></i>Previous
              </button>
            </div>
          )}
          {currentQuestion < data.length - 1 && (
            <div className="col-3">
              <button className="btn btn-secondary" onClick={goToNextQuestion}>
                Next<i class="bi bi-caret-right-fill me-1"></i>
              </button>
            </div>
          )}
          {currentQuestion === data.length - 1 && (
            <div className="col-3">
              <button className="btn btn-warning" onClick={() => {}} disabled>
                <i class="bi bi-check-circle-fill me-1"></i>Submit
              </button>
            </div>
          )}
        </div>
        <div class="row" role="group" aria-label="Basic outlined example">
          {data.map((question, index) => {
            return (
              <div className="col-2">
                <button
                  className={`btn btn-${
                    question.gotten ? "success" : "danger"
                  }`}
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
  const goToPreviousQuestion = () => {
    setCurrentQuestion((prevQuestion) => {
      const newQuestion = prevQuestion - 1;
      return newQuestion >= 0 ? newQuestion : prevQuestion;
    });
  };

  const goToNextQuestion = () => {
    setCurrentQuestion((prevQuestion) => {
      const newQuestion = prevQuestion + 1;
      return newQuestion < data.length ? newQuestion : prevQuestion;
    });
  };

  // Function to handle going to a specific question
  const goToSpecificQuestion = (index) => {
    setCurrentQuestion(index);
  };

  return (
    <div>
      <Navbar />
      {location.state ? (
        <p>
          You scored {score} over {overall}
        </p>
      ) : (
        <p>
          No result Data found Go <Link to="/">Home</Link>
        </p>
      )}
      {renderQuestion()}
    </div>
  );
}

export default ResultPage;
