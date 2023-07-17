import { useLocation, Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

function ResultPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const location = useLocation();
  const { score, overall, data, quizfilters } = location.state || {};
  const navigate = useNavigate();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 37 || event.keyCode === 80) {
        // Left arrow key
        goToPreviousQuestion();
      } else if (event.keyCode === 39 || event.keyCode === 78) {
        // Right arrow key
        goToNextQuestion();
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
        } else {
          // Swipe left
          goToNextQuestion();
        }
      }
    });

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 37 || event.keyCode === 80) {
        // Left arrow key
        goToPreviousQuestion();
      } else if (event.keyCode === 39 || event.keyCode === 78) {
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
                  className="btn btn-warning btn-sm"
                  onClick={() => {
                    navigate("/quiz", { state: quizfilters });
                  }}
                >
                  <span>Redo </span>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
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
          <div className="card-footer">{renderNavigationButtons()}</div>
        </div>
      </div>
    );
  };
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
          {currentQuestion < data.length - 1 && (
            <div className="m-1">
              <button className="btn btn-secondary" onClick={goToNextQuestion}>
                <span>Next</span>
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
          {data.map((question, index) => {
            return (
              <div className="">
                <button
                  className={`btn btn-${
                    question.gotten ? "success" : "danger"
                  } no-radius`}
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
        <div className="mt-2">
          <h5 className="text-center">
            Score: {score}/{overall}
          </h5>
          <div className="score-bar">
            <div
              className="score-bar-fill"
              style={{ width: `${(score / overall) * 100}%` }}
            ></div>
          </div>
        </div>
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
