import "./App.scss";
import NAV from "./component/nav/Navition";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import Layout from "./component/PrivateRoute/Routes.js";
import { useSelector } from "react-redux";
import { GetAccountData } from "./component/services/userservice.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./component/redux/slices/authSlice.js";
import LoadingPage from "./component/PrivateRoute/LoadingPage.js";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.isLoading);

  useEffect(() => {
    const accountData = async () => {
      try {
        let res = await GetAccountData();
        if (res && +res.EC === 0) {
          dispatch(loginSuccess({ user: res.DT }));
        } else {
          dispatch(loginSuccess({ user: null }));
        }
      } catch (error) {
        dispatch(loginSuccess({ user: null }));
      }
    };
    accountData();
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div>
          {(location.pathname === "/" || user) && <NAV />}
          <Layout />
          <ToastContainer
            autoClose={1500}
            pauseOnHover={false}
            closeOnClick
            draggable={false}
          />
        </div>
      )}
    </>
  );
};

export default App;
