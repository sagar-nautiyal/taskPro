import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../reducer/authReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Register form submitted");
    
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    console.log("Registration data:", userData);

    try {
      const result = await dispatch(registerThunk(userData)).unwrap();
      console.log("Registration successful:", result);
      toast.success("Registration successful!");
      navigate("/signIn"); // Redirect to login page
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(`Registration failed: ${err}`);
      return;
    }
  };

  return (
    <div className="text-center">
      <h1>Register Page</h1>
      <p>Please fill out the form to register.</p>
      <div className="card w-50 mx-auto p-4">
        <form className="form-group" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            name="name"
            className="form-control mb-3"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="form-control mb-3"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="form-control mb-3"
            required
          />
          <label className="form-label mt-3">Select your role</label>
          <select className="form-select mb-3" name="role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="btn btn-primary mt-4">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
