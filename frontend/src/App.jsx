// src/App.jsx
import { Navigate } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { SignIn } from "./component/SignIn";
import { LogIn } from "./component/LogIn";
import { Home } from "./component/Home";
import { Profile } from "./component/Profile";
import { AdminDashboard } from "./component/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";

// -------------------- PrivateRoute Component --------------------
const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />; // not logged in
  if (role && user.role !== role) return <Navigate to="/" />; // role not allowed

  return children;
};

// -------------------- Router --------------------
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/login", element: <LogIn /> },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

// -------------------- App Component --------------------
const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
