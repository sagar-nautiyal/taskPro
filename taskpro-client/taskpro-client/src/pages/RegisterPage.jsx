import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerThunk } from "../reducer/authReducer";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    try {
      const result = await dispatch(registerThunk(userData)).unwrap();
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(`Registration failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="card" style={{ maxWidth: "400px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            TaskPro
          </h1>
          <p className="text-muted">Create your account</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label
              htmlFor="name"
              style={{
                display: "block",
                marginBottom: "0.25rem",
                fontSize: "0.875rem",
              }}
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              className="input"
              required
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "0.25rem",
                fontSize: "0.875rem",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input"
              required
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "0.25rem",
                fontSize: "0.875rem",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              className="input"
              required
              minLength={6}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="role"
              style={{
                display: "block",
                marginBottom: "0.25rem",
                fontSize: "0.875rem",
              }}
            >
              Role
            </label>
            <select id="role" name="role" className="input" defaultValue="user">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginBottom: "1rem" }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
