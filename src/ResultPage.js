import { useLocation, Link } from "react-router-dom";
import Navbar from "./Navbar";

function ResultPage() {
  const location = useLocation();
  const { score, overall, data } = location.state || {};
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
    </div>
  );
}

export default ResultPage;
