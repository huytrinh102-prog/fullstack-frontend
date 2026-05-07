import { GoogleLogin } from "@react-oauth/google";
import { LoginwGoogle } from "../services/userservice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/slices/authSlice";

const LoginwithGoogle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const token = credentialResponse.credential;
            const res = await LoginwGoogle(token);
            if (res && +res.EC === 0) {
              dispatch(loginSuccess({ user: res.DT.user }));
              toast.success(res.EM);
              navigate("/users");
            } else {
              toast.error(res?.EM || "Login failed");
            }
          } catch (error) {
            toast.error(
              error?.response?.data?.EM ||
                error?.message ||
                "Login failed (network/server error)",
            );
          }
        }}
        onError={() => {
          toast.error("Login Failed");
        }}
      />
    </div>
  );
};

export default LoginwithGoogle;

