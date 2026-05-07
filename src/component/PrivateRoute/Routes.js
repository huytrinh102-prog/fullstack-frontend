import { Route, Routes } from "react-router-dom";
import Login from "../login/login.js";
import Register from "../register/register.js";
import User from "../ManageUsers/Users.js";
import { PrivateRoute, PublicRoute } from "./PrivateRoute.jsx";
import Roles from "../Roles/Roles.js";
import GroupRole from "../group-role/group-role.js";
const Layout = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<h1>home</h1>} />
        <Route path="/Project" element={<h1>contatc</h1>} />
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
        />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
};

export default Layout;
