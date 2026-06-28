import axios from "axios";
import { toast } from "react-toastify";

const normalizeBaseUrl = (value) => {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
};

const envBaseUrl = normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL);
const baseURL =
  process.env.NODE_ENV === "development"
    ? envBaseUrl || "http://localhost:8080/"
    : "https://yt-language-backend.onrender.com/";

const instance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

// set Authorization
instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    const status = error.response?.status;
    const originalConfig = error.config || {};

    if (!error.response) {
      toast.error("Network error: backend unreachable");
      return Promise.reject(error);
    }

    if (
      status === 401 &&
      !originalConfig._retry &&
      !String(originalConfig.url || "").includes("api/v1/refresh-token")
    ) {
      originalConfig._retry = true;
      try {
        const refreshRes = await axios
          .post(`${baseURL}api/v1/refresh-token`, {}, { withCredentials: true })
          .then((r) => r.data);
        console.log("aaaa", refreshRes);
        if (refreshRes && +refreshRes.EC === 0) {
          console.log("aaaa", refreshRes);
          localStorage.setItem("access_token", refreshRes.DT.access_token);
          originalConfig.headers = originalConfig.headers || {};
          originalConfig.headers.Authorization = `Bearer ${refreshRes.DT.access_token}`;
          return instance(originalConfig);
        }
      } catch (e) {
        // fall through to normal error handling
      }
    }

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
