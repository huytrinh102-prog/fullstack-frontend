import { useState } from "react";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginUser } from "../services/userservice";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import LoginwithGoogle from "./googlelogin";
const Login = () => {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handlegotoRegister = () => {
    navigate("/register");
  };

  const handleLogin = async () => {
    if (!input || !password) {
      toast.error("Please fill the form!");
      return;
    }
    let res = await LoginUser(input, password);
    if (res && +res?.EC === 0) {
      dispatch(loginSuccess({ user: res.DT.user }));
      toast.success(res.EM);
      navigate("/users");
    } else {
      toast.error(res?.EM || "Login failed");
    }
  };

  return (
    <div className="login-container row mt-3 ">
      <div className="login-right d-none d-sm-block col-sm-6 mt-5">
        <div className="login-right-content d-none d-sm-block mt-5">
          <div className="brand text-center mt-5">YU-H8129</div>
          <div className="brand-content text-center">
            wellcome to my wedsite
          </div>
        </div>
      </div>
      <div className="login-left col-12 col-sm-6 mt-sm-5 ">
        <div className="login-left-wrap mt-sm-5 px-sm-5 col-sm-11">
          <div className="brand text-center d-sm-none">YU-H8129</div>
          <form
            className="login-left-content row p-4 gy-4 mt-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input
              name="inputs"
              type="text"
              placeholder="Email or Phone number"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              className="form-control"
            ></input>{" "}
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            ></input>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <Link className="forgot-password text-center" to="#">
              Forgot your password?
            </Link>
            <hr></hr>
            <div>
              <LoginwithGoogle />
            </div>
            <div className="text-center">
              <button
                onClick={() => handlegotoRegister()}
                className="btn btn-success"
              >
                Create new account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
