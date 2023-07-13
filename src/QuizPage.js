import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function QuizPage() {
  const [quizData, setQuizData] = useState([]);
  const [btnColors, setBtnColors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/questions?_limit=2"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        const data = await response.json();
        setQuizData(data);
        setIsLoading(false);
        setBtnColors(Object.fromEntries(data.map((e, idx) => [idx, "danger"])));
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

  const [resultData, setResultData] = useState({});
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
    let score = 0;
    quizData.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        score++;
      }
    });
    return score;
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
        <div className="alert alert-danger" role="alert">
          Failed to fetch quiz data. Please try again later.
        </div>
      );
    }

    const question = quizData[currentQuestion];

    return (
      <div>
        <h2>Question {currentQuestion + 1}</h2>
        <p>{question.question}</p>
        <ul>
          {question.options.map((option, index) => (
            <li key={index}>
              <label>
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={userAnswers[currentQuestion] === option}
                  onChange={() => handleAnswerSelect(option, currentQuestion)}
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render previous and next buttons based on current question index
  const renderNavigationButtons = () => {
    return (
      <>
        <div>
          {currentQuestion > 0 && (
            <button onClick={goToPreviousQuestion}>Previous</button>
          )}
          {currentQuestion < quizData.length - 1 && (
            <button onClick={goToNextQuestion}>Next</button>
          )}
          {currentQuestion === quizData.length - 1 && (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
        <div>
          {quizData.map((question, index) => {
            return (
              <button
                className={`btn btn-${btnColors[index]}`}
                onClick={() => goToSpecificQuestion(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  // Function to handle quiz submission
  const handleSubmit = () => {
    const score = calculateScore();
    setResultData({ score: score, overall: quizData.length });
    navigate("/result", { state: { score: score, overall: quizData.length } });
    // alert(`Your score: ${score}/${quizData.length}`);
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
      {renderNavigationButtons()}
    </div>
  );
}

export default QuizPage;
