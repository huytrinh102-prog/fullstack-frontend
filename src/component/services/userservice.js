import axios from "../../utils/axiosCustomize";
import cloudinaryAxios from "../../utils/cloudinaryAxios";
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
    `api/v1/users?page=${page}&limit=${limit}&search=${keyword || ""}&sort=${
      sort || "id,desc"
    }`,
  );
};

const DeleteUser = (id) => {
  return axios.delete(`api/v1/users/${id}`);
};

const UpdateUser = (data, id) => {
  return axios.put(`api/v1/users/${id}`, data);
};

const GetAllGroups = () => {
  return axios.get(`api/v1/group`);
};

const CreateUser = (data) => {
  return axios.post("api/v1/users", data);
};

const CreateRoles = (data) => {
  return axios.post("api/v1/roles", data);
};

const GetAllRoles = (page, limit, keyword, sort) => {
  return axios.get(
    `api/v1/roles?page=${page}&limit=${limit}&search=${keyword || ""}&sort=${
      sort || "id,desc"
    }`,
  );
};

const DeleteRoles = (id) => {
  return axios.delete(`api/v1/roles/${id}`);
};

const UpdateRoles = (data, id) => {
  return axios.put(`api/v1/roles/${id}`, data);
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
const CreateProject = (data) => {
  return axios.post("api/v1/project", data);
};
const GetAllProject = (keyword, filter) => {
  return axios.get(
    `api/v1/project?search=${keyword || ""}&filter=${filter || ""}`,
  );
};
const AddMember = (id, userId) => {
  return axios.post(`api/v1/project/${id}/members`, { userId });
};
const DeleteMember = (id, userId) => {
  return axios.delete(`api/v1/project/${id}/members/${userId}`);
};
const GetMember = (id) => {
  return axios.get(`api/v1/project/${id}/members`);
};
const UpdateProject = (data, id) => {
  return axios.put(`api/v1/project/${id}`, data);
};
const DeleteProject = (id) => {
  return axios.delete(`api/v1/project/${id}`);
};
const GetProjectsbyId = (id) => {
  return axios.get(`api/v1/project/${id}`);
};
const CreateTodo = (data) => {
  return axios.post("api/v1/todos", data);
};
const GetTodoofProject = (keyword, filter, priority, id) => {
  return axios.get(
    `/api/v1/todos/project/${id}?search=${keyword || ""}&filter=${filter || ""}&priority=${priority || ""}`,
  );
};
const UpdateTodo = (data, id) => {
  return axios.put(`api/v1/todos/${id}`, data);
};
const DeleteTodo = (id) => {
  return axios.delete(`api/v1/todos/${id}`);
};
const GetTodosbyUser = (id) => {
  return axios.get(`api/v1/todos/${id}`);
};
const GetDashboard = () => {
  return axios.get("api/v1/dashboard");
};
const uploadToCloudinary = (data, file) => {
  const { cloudName, apiKey, timestamp, folder, signature } = data;
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);
  return cloudinaryAxios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    form,
    { withCredentials: false },
  );
};

export {
  GetDashboard,
  AddMember,
  GetMember,
  DeleteMember,
  GetProjectsbyId,
  GetTodosbyUser,
  DeleteTodo,
  UpdateTodo,
  GetTodoofProject,
  CreateTodo,
  DeleteProject,
  UpdateProject,
  CreateProject,
  GetAllProject,
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
