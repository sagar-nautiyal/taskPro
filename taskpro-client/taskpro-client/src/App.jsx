import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SimpleLoginPage } from "./pages/SimpleLoginPage";
import RegisterPage from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const token = user?.token;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <ToastContainer position="top-right" />
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={token ? <Navigate to="/" /> : <SimpleLoginPage />}
            />
            <Route
              path="/register"
              element={token ? <Navigate to="/" /> : <RegisterPage />}
            />
            <Route
              path="/"
              element={token ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="*"
              element={<Navigate to={token ? "/" : "/login"} />}
            />
          </Routes>
        </Router>
      </DndProvider>
    </div>
  );
};
