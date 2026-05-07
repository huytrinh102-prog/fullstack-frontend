import axios from "../../utils/axiosCustomize";

const CreateNewUser = (data) => {
  return axios.post("api/v1/register", data);
};

const LoginUser = (input, password) => {
  return axios.post("api/v1/login", { input, password });
};

const LoginwGoogle = (token) => {
  return axios.post("api/v1/auth/google", { token });
};

const GetAccountData = () => {
  return axios.get("api/v1/account");
};

const Logout = () => {
  return axios.post("api/v1/logout");
};

const GetAllUsers = (page, limit, keyword, sort) => {
  return axios.get(
    `api/v1/read?page=${page}&limit=${limit}&search=${keyword || ""}&sort=${
      sort || "id,desc"
    }`,
  );
};

const DeleteUser = (id) => {
  return axios.delete(`api/v1/delete/${id}`);
};

const UpdateUser = (data, id) => {
  return axios.put(`api/v1/update/${id}`, data);
};

const GetAllGroups = () => {
  return axios.get(`api/v1/group`);
};

const CreateUser = (data) => {
  return axios.post("api/v1/create", data);
};

const CreateRoles = (data) => {
  return axios.post("api/v1/role-create", data);
};

const GetAllRoles = (page, limit, keyword, sort) => {
  return axios.get(
    `api/v1/role-read?page=${page}&limit=${limit}&search=${keyword || ""}&sort=${
      sort || "id,desc"
    }`,
  );
};

const DeleteRoles = (id) => {
  return axios.delete(`api/v1/role-delete/${id}`);
};

const UpdateRoles = (data, id) => {
  return axios.put(`api/v1/role-update/${id}`, data);
};

const GetRoles = () => {
  return axios.get(`api/v1/group-role/read`);
};

const GetRolesbyGroup = (id) => {
  return axios.get(`api/v1/role-by-group/${id}`);
};

const UpdateRolesbyGroup = (data) => {
  return axios.post("api/v1/group-role/update", data);
};
const GetSignAvatar = () => {
  return axios.post("api/v1/cloudinary/sign-avatar");
};
const uploadToCloudinary = (data, file) => {
  const { cloudName, apiKey, timestamp, folder, signature } = data;
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);
  return axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    form,
    { withCredentials: false },
  );
};
export {
  uploadToCloudinary,
  CreateNewUser,
  GetSignAvatar,
  LoginUser,
  LoginwGoogle,
  GetAccountData,
  Logout,
  GetAllUsers,
  DeleteUser,
  UpdateUser,
  GetAllGroups,
  CreateUser,
  CreateRoles,
  GetAllRoles,
  DeleteRoles,
  UpdateRoles,
  GetRoles,
  GetRolesbyGroup,
  UpdateRolesbyGroup,
};
