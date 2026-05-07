import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  if (isEmpty(user)) {
    return <Navigate to="/login" />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  if (user) {
    return <Navigate to="/" />;
  }
  return children;
};

export { PrivateRoute, PublicRoute };

