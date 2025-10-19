import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginPage } from "./pages/LoginPage";
import { useEffect } from "react";
import socket from "./components/Socket";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const App = () => {
  useEffect(() => {
    console.log("Socket instance", socket);
    const onConnect = () => {
      console.log("Connected to socket.io server");
    };
    const onError = (err) => {
      console.error("Connection error:", err.message);
    };

    // Attach listeners (guard against duplicates on re-render)
    socket.off("connect", onConnect);
    socket.off("connect_error", onError);
    socket.on("connect", onConnect);
    socket.on("connect_error", onError);

    // Do not disconnect the global socket on App unmount; just clean listeners
    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
    };
  }, []);
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "/signUp",
          element: <RegisterPage />,
        },
        {
          path: "/signIn",
          element: <LoginPage />,
        },
      ],
    },
  ]);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
      />
      <DndProvider backend={HTML5Backend}>
        <RouterProvider router={routes} />
      </DndProvider>
    </>
  );
};
