import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <div>
        {/* Your logo */}
        <h1>Quiz App</h1>
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/quiz">Start Quiz</Link>
        </li>
      </ul>
    </nav>
  );
}
export default Navbar;
