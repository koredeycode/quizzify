import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function ResultPage() {
  const location = useLocation();
  console.log(location);
  const { score, overall } = location.state;
  return (
    <div>
      <Navbar />
      <p>
        You scored {score} over {overall}
      </p>
    </div>
  );
}

export default ResultPage;
