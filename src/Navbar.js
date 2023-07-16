import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary rounded"
      aria-label="Eleventh navbar example"
    >
      <div
        className="container-fluid justify-content-center"
        bis_skin_checked="1"
      >
        {/* <i className="bi bi-patch-question me-2"></i> */}
        <Link to="/" className="navbar-brand text-decoration-none">
          <h2 className="d-lg-block m-0">Quizzaroo</h2>
        </Link>
      </div>
    </nav>
  );
}
export default Navbar;
