import { Route, Routes } from "react-router-dom";
import Login from "../login/login.js";
import Register from "../register/register.js";
import User from "../ManageUsers/Users.js";
import { PrivateRoute, PublicRoute } from "./PrivateRoute.jsx";
import Roles from "../roles/Roles.js";
import GroupRole from "../group-role/group-role.js";
import Project from "../project/Project.js";
import ProjectDetail from "../project/ProjectView.js";
import HomePage from "../home/home.js";
const Layout = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/project"
          element={
            <PrivateRoute>
              <Project />
            </PrivateRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <Roles />
            </PrivateRoute>
          }
        />
        <Route
          path="/group-role"
          element={
            <PrivateRoute>
              <GroupRole />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <User />
            </PrivateRoute>
          }
        />{" "}
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
};

export default Layout;
