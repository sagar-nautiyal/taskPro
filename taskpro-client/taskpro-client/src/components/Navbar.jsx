import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { authSelector } from "../reducer/authReducer";
import { logOut } from "../reducer/authReducer";
import { toast } from "react-toastify";

export const Navbar = () => {
  const { isAuthenticated } = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
    toast.success("Logged Out Successfully");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div className="d-flex">
            {isAuthenticated ? (
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link className="btn btn-outline-success" to="/signUp">
                  SignUp
                </Link>
                <Link className="btn btn-outline-success" to="/signIn">
                  SignIn
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};
