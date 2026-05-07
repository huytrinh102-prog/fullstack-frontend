import "./register.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { CreateNewUser } from "../services/userservice";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  const checkIsValid = {
    isValidemail: true,
    isValidpassword: true,
    isValidphone: true,
    isValidusername: true,
  };

  const [isValid, setIsValid] = useState(checkIsValid);
  const navigate = useNavigate();

  const handleRegister = async (email, password, username, phone) => {
    try {
      let data = { email, password, username, phone };
      setIsValid(checkIsValid);
      const validateEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!email) {
        setIsValid({ ...checkIsValid, isValidemail: false });
        toast.error("Please fill the form");
        return;
      }
      if (!validateEmail.test(email)) {
        toast.error("Email not work");
        return;
      }
      if (!password) {
        toast.error("Please fill the form");
        setIsValid({ ...checkIsValid, isValidpassword: false });
        return;
      }
      if (!username) {
        setIsValid({ ...checkIsValid, isValidusername: false });
        toast.error("Please fill the form");
        return;
      }
      if (!phone) {
        setIsValid({ ...checkIsValid, isValidphone: false });
        toast.error("Please fill the form");
        return;
      }

      const res = await CreateNewUser(data);
      if (res && +res?.EC === 0) {
        toast.success(res.EM);
        navigate("/login");
      } else {
        toast.error(res.EM);
      }
    } catch (error) {
      toast.error(error?.response?.data?.EM || error?.message || "Error");
    }
  };

  const handlegotoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="Register-container row mt-3 ">
      <div className="Register-right d-none d-sm-block col-sm-6 mt-5">
        <div className="Register-right-content d-none d-sm-block mt-5">
          <div className="brand text-center mt-5">YU-H8129</div>
          <div className="brand-content text-center">
            wellcome to my wedsite
          </div>
        </div>
      </div>
      <div className="Register-left col-12 col-sm-6 mt-sm-5 ">
        <div className="Register-left-wrap mt-sm-5 px-sm-5 col-sm-11">
          <div className="brand text-center d-sm-none">YU-H8129</div>
          <form
            className="Register-left-content row p-4 gy-4 mt-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister(email, password, username, phone);
            }}
          >
            <div className="form-group">
              <label>Email address</label>
              <input
                type="text"
                placeholder="Email"
                className={
                  isValid.isValidemail
                    ? "form-control"
                    : "form-control is-invalid"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                className={
                  isValid.isValidpassword
                    ? "form-control"
                    : "form-control  is-invalid"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div className="form-group">
              <label>User name</label>
              <input
                type="text"
                placeholder="Your Name"
                className={
                  isValid.isValidusername
                    ? "form-control"
                    : "form-control is-invalid"
                }
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></input>
            </div>
            <div className="form-group">
              <label>Phone number</label>
              <input
                type="number"
                placeholder="Phone number"
                className={
                  isValid.isValidphone
                    ? "form-control"
                    : "form-control is-invalid"
                }
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></input>
            </div>
            <button type="submit" className="btn btn-primary">
              Register
            </button>
            <hr></hr>
            <div className="text-center">
              <button
                onClick={() => handlegotoLogin()}
                className="btn btn-success"
              >
                Already have an account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

