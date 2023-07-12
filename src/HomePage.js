//import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function HomePage() {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section>
        <h2>Welcome to the Quiz App!</h2>
        <p>Test your knowledge with our challenging quizzes.</p>
        <Link to="/quiz">
          <button>Start Quiz</button>
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
