import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

function QuizPage() {
  // Sample quiz data
  const quizData = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      question: "What is the largest ocean in the world?",
      options: [
        "Atlantic Ocean",
        "Arctic Ocean",
        "Indian Ocean",
        "Pacific Ocean",
      ],
      answer: "Pacific Ocean",
    },
    {
      question: "Who painted the Mona Lisa?",
      options: [
        "Leonardo da Vinci",
        "Pablo Picasso",
        "Vincent van Gogh",
        "Michelangelo",
      ],
      answer: "Leonardo da Vinci",
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Au", "Ag", "Fe", "Cu"],
      answer: "Au",
    },
    {
      question: "What is the tallest mountain in the world?",
      options: ["Mount Everest", "K2", "Kangchenjunga", "Makalu"],
      answer: "Mount Everest",
    },
    {
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "Japan", "South Korea", "Thailand"],
      answer: "Japan",
    },
    {
      question: "Which year was the first successful manned moon landing?",
      options: ["1969", "1972", "1961", "1975"],
      answer: "1969",
    },
    {
      question: "Who wrote the play 'Romeo and Juliet'?",
      options: [
        "William Shakespeare",
        "Jane Austen",
        "Charles Dickens",
        "Emily Bronte",
      ],
      answer: "William Shakespeare",
    },
    {
      question: "What is the largest mammal on Earth?",
      options: ["Elephant", "Blue whale", "Giraffe", "Hippopotamus"],
      answer: "Blue whale",
    },
  ];

  // State to keep track of current question index and user answers
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  // Function to handle selecting an answer
  const handleAnswerSelect = (selectedAnswer) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestion] = selectedAnswer;
      return updatedAnswers;
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
                  onChange={() => handleAnswerSelect(option)}
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
              <button onClick={() => goToSpecificQuestion(index)}>
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
    alert(`Your score: ${score}/${quizData.length}`);
    // You can perform other actions with the score, like storing it in a database
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 37) {
        // Left arrow key
        if (currentQuestion > 0) {
          goToPreviousQuestion();
        }
      } else if (event.keyCode === 39) {
        // Right arrow key
        if (currentQuestion < quizData.length - 1) {
          goToNextQuestion();
        }
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
