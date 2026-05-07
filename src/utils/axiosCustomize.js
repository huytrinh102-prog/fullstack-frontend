import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 10000,
  withCredentials: true,
});

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    const status = error.response?.status;
    switch (status) {
      case 400:
        toast.error("Bad request");
        break;
      case 401:
        toast.error("Please login");
        break;
      case 403:
        toast.error("No permission");
        break;
      case 404:
        toast.error("Not found");
        break;
      case 500:
        toast.error("Server error");
        break;
      default:
        toast.error(error?.response?.data?.EM || "Unknown error");
    }
    return Promise.reject(error);
  },
);

export default instance;

