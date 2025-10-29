import { useDispatch } from "react-redux";
import { loginthunk } from "../reducer/authReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlelogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const userData = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      await dispatch(loginthunk(userData)).unwrap();
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error("An error occurred while logging in.");
      return;
    }
  };
  return (
    <div className="text-center">
      <h1>LoginPage</h1>
      <div className="card w-50 mx-auto p-4">
        <p className="text-center">Log In</p>
        <form className="form-group" onSubmit={handlelogin}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="form-control"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="form-control"
          />
          <button type="submit" className="btn btn-primary mt-4">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
