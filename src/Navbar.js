import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="card-header d-flex align-items-center justify-items-center justify-content-between">
      <div>
        <Link to="/" className="text-decoration-none">
          <h5 className="d-lg-block">Quizzify</h5>
        </Link>
      </div>
    </div>
  );
}
export default Navbar;
