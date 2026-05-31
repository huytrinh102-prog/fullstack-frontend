import { useEffect, useState } from "react";
import AddMemberModal from "./AddMemberModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";
import {
  DeleteProject,
  CreateTodo,
  DeleteTodo,
  GetProjectsbyId,
  GetTodoofProject,
  UpdateTodo,
  GetAllUsers,
  GetMember,
} from "../services/userservice";
import ModalCreateUpdateProject from "./ProjectModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProjectView.scss";
import { useSelector } from "react-redux";

const ProjectView = (props) => {
  const navigate = useNavigate();
  // ================= STATE =================
  const [projectDetail, setProjectDetail] = useState(null);
  const [todoList, setTodoList] = useState([]);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const { id } = useParams();
  const [selectedTodo, setSelectedTodo] = useState({
    id: "",
    title: "",
    description: "",
    priority: 1,
    status: "PENDING",
    projectId: id,
  });
  const [searchUser, setSearchUser] = useState("");
  const [userList, setUserList] = useState([]);
  const [memberIds, setMemberIds] = useState([]);
  // state update project
  const [modal] = useState("UPDATE");

  const [projectDataSubmit, setProjectDataSubmit] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    avatarUrl: "",
    avatarPublicId: "",
  });
  //  SEARCH PARAMS¥
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "";
  const priority = searchParams.get("priority") || "";
  const mode = useSelector((state) => state.theme.mode);

  //  FETCH PROJECT
  const getProjectDetail = async () => {
    try {
      let res = await GetProjectsbyId(id);

      if (res && +res?.EC === 0) {
        setProjectDetail(res.DT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH TODO
  const getTodoList = async () => {
    try {
      let res = await GetTodoofProject(keyword, filter, priority, id);

      if (res && +res.EC === 0) {
        setTodoList(res.DT || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    try {
      let res = await GetAllUsers();

      if (res && +res.EC === 0) {
        setUserList(res.DT.users || []);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getMember = async () => {
    try {
      let res = await GetMember(id);
      if (res && +res.EC === 0) {
        const ids = res.DT.map((i) => i.id);
        setMemberIds(ids);
      }
    } catch (error) {}
  };
  // CRUD TODO
  const handleUpdateTodo = async () => {
    try {
      let res = await UpdateTodo(selectedTodo);
      if (res && +res.EC === 0) {
        getTodoList();
      }
      setSelectedTodo({
        id: "",
        title: "",
        description: "",
        priority: 1,
        status: "PENDING",
        projectId: id,
      });
      setShowTodoModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreateTodo = async () => {
    try {
      let res = await CreateTodo(selectedTodo);
      if (res && +res.EC === 0) {
        getTodoList();
      }
      setSelectedTodo({
        id: "",
        title: "",
        description: "",
        priority: 1,
        status: "PENDING",
        projectId: id,
      });
      setShowTodoModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteTodo = async (id) => {
    try {
      console.log(id);
      let res = await DeleteTodo(id);
      if (res && +res.EC === 0) {
        getTodoList();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleTooggleTodo = async (todo) => {
    try {
      const newStatus = todo.status === "PENDING" ? "COMPLETED" : "PENDING";

      let res = await UpdateTodo({
        ...todo,
        status: newStatus,
      });

      if (res && +res.EC === 0) {
        setTodoList((prev) =>
          prev.map((item) =>
            item.id === todo.id ? { ...item, status: newStatus } : item,
          ),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteProject = async () => {
    try {
      const confirmDelete = window.confirm(
        `Delete this project? : ${projectDetail.name}`,
      );

      if (!confirmDelete) return;

      const res = await DeleteProject(id);

      if (res && +res.EC === 0) {
        toast.success(res.EM);
        navigate("/project");
      } else {
        toast.error(res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ================= LOAD =================
  useEffect(() => {
    getProjectDetail(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // get user members
  useEffect(() => {
    getUsers();
    getMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getTodoList(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, filter, priority]);

  // ================= STATS =================
  const totalTodos = todoList.filter((todo) => todo).length;
  const completedTodos = todoList.filter(
    (todo) => todo.status === "COMPLETED",
  ).length;

  const pendingTodos = totalTodos - completedTodos;
  const totalPriority = todoList.reduce(
    (sum, todo) => sum + Number(todo.priority),
    0,
  );
  const completedPriority = todoList
    .filter((todo) => todo.status === "COMPLETED")
    .reduce((sum, todo) => sum + Number(todo.priority), 0);
  const progress =
    totalPriority > 0 ? (completedPriority / totalPriority) * 100 : 0;

  //  STATUS COLOR
  if (!projectDetail) return <div>Loading...</div>;
  const statusColor =
    projectDetail.status === "COMPLETED"
      ? "#22c55e"
      : projectDetail.status === "PENDING"
        ? "#facc15"
        : "#3b82f6";

  return (
    <div className={`project-view project-view--${mode}`}>
      <div className="project-view__page container-fluid py-4">
        <div className="project-view__shell shadow-lg overflow-hidden">
          {/* ================= HERO ================= */}
          <div
            style={{
              height: "200px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* background image */}
            <img
              src={projectDetail.avatarUrl}
              alt="project"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--pv-hero-overlay)",
                zIndex: 1,
              }}
            ></div>

            {/* status */}
            <div
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                border: "1px solid var(--pv-border)",
                borderRadius: "999px",
                padding: "10px 16px",
                zIndex: 2,
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: statusColor,
                    boxShadow: `0 0 10px ${statusColor}`,
                  }}
                ></span>

                <span className="fw-semibold">{projectDetail.status}</span>
              </div>
            </div>

            {/* content */}
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                left: "30px",
                zIndex: 2,
              }}
            >
              {/* title */}
              <h1
                className="fw-bold project-view__hero-title"
                style={{
                  fontSize: "60px",
                  lineHeight: 1.1,
                }}
              >
                {projectDetail.name}
              </h1>

              {/* description */}
              <p className="project-view__hero-desc">
                {projectDetail.description}
              </p>

              {/* members */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="project-view__hero-meta">TEAM MEMBERS :</div>
                <div className="d-flex align-items-center">
                  {projectDetail?.users?.length > 0 ? (
                    <>
                      {projectDetail.users.slice(0, 5).map((u) => (
                        <div
                          key={u.id}
                          className="member-avatar position-relative p-1"
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <div
                            className="d-flex justify-content-center align-items-center fw-bold"
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                              color: "white",
                              fontSize: "13px",
                            }}
                          >
                            {u.username?.charAt(0).toUpperCase()}
                          </div>

                          {/* tooltip */}
                          <span
                            className="member-name"
                            style={{
                              position: "absolute",
                              bottom: "-33px",
                              left: "50%",
                              transform: "translateX(-50%) translateY(-240%)",
                              background: "#111827",
                              color: "white",
                              padding: "5px 12px",
                              borderRadius: "10px",
                              fontSize: "13px",
                              whiteSpace: "nowrap",
                              opacity: 0,
                              visibility: "hidden",
                              transition: "0.4s",
                              zIndex: 100,
                            }}
                          >
                            {u.username ? u.username : "NONAME"}
                          </span>
                        </div>
                      ))}

                      {projectDetail.users.length > 5 && (
                        <div
                          className="d-flex justify-content-center align-items-center fw-bold"
                          style={{
                            width: "46px",
                            height: "46px",
                            borderRadius: "50%",
                            background: "var(--pv-card-2)",
                            color: "var(--pv-muted)",
                            marginLeft: "-12px",
                            border: "3px solid var(--pv-page-bg)",
                            fontSize: "13px",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                          }}
                        >
                          +{projectDetail.users.length - 5}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="project-view__muted">No members yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* ================= BODY ================= */}
          <div className="p-4">
            <div className="row g-4">
              {/* ================= LEFT ================= */}
              <div className="col-lg-8">
                {/* INFO */}
                <div className="project-view__card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold m-0">Project Information</h4>

                    <button
                      onClick={() => setShowProjectModal(true)}
                      className={`btn rounded-pill px-4 ${
                        mode === "dark"
                          ? "btn-outline-light"
                          : "btn-outline-dark"
                      }`}
                    >
                      Edit Project
                    </button>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <div className="text-secondary small mb-2">
                        Start Date
                      </div>

                      <div className="fw-semibold">
                        {projectDetail.startDate?.split("T")[0]}
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="text-secondary small mb-2">End Date</div>

                      <div className="fw-semibold">
                        {projectDetail.endDate?.split("T")[0]}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-secondary small mb-2">
                        Created By
                      </div>

                      <div className="fw-semibold">
                        {projectDetail.createdBy || "Unknown"}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-secondary small mb-2">
                        Project ID
                      </div>

                      <div className="fw-semibold">#{projectDetail.id}</div>
                    </div>{" "}
                    <div className="col-md-4">
                      <div className="text-secondary small mb-2">
                        Total Members
                      </div>

                      <div className="fw-semibold">#{memberIds.length}</div>
                    </div>
                  </div>
                </div>

                {/* ================= TODO ================= */}
                <div className="project-view__card p-4 mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold m-0">Todo List</h4>

                    <button
                      className="btn"
                      onClick={(e) => setShowTodoModal(true)}
                      style={{
                        background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                        border: "none",
                        color: "white",
                        borderRadius: "14px",
                        padding: "10px 18px",
                        fontWeight: "600",
                      }}
                    >
                      + Add Todo
                    </button>
                  </div>

                  <div
                    style={{
                      maxHeight: "500px",
                      overflowY: "auto",
                      paddingRight: "4px",
                    }}
                  >
                    {todoList.length > 0 ? (
                      todoList.map((t) => (
                        <div
                          key={t.id}
                          className="d-flex align-items-center justify-content-between mb-3 p-3"
                          style={{
                            background: "var(--pv-card-2)",
                            borderRadius: "18px",
                            border: "1px solid var(--pv-border)",
                            transition: "0.25s",
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={t.status === "COMPLETED"}
                              onClick={() => handleTooggleTodo(t)}
                              style={{
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                              }}
                              readOnly
                            />

                            <div>
                              <div
                                className="fw-semibold"
                                style={{
                                  fontSize: "16px",
                                  textDecoration:
                                    t.status?.toUpperCase() === "COMPLETED"
                                      ? "line-through"
                                      : "none",
                                  opacity:
                                    t.status?.toUpperCase() === "COMPLETED"
                                      ? 0.6
                                      : 1,
                                }}
                              >
                                {t.title.toUpperCase()}
                              </div>

                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "var(--pv-muted)",
                                  maxWidth: "450px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {t.description}
                              </div>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-3">
                            <span
                              className={`badge ${
                                t.priority === "3"
                                  ? "bg-danger"
                                  : t.priority === "2"
                                    ? "bg-warning text-dark"
                                    : "bg-info text-dark"
                              }`}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "999px",
                              }}
                            >
                              {t.priority === "3"
                                ? "HIGH"
                                : t.priority === "2"
                                  ? "MEDIUM"
                                  : "LOW"}
                            </span>
                            <button
                              className={`btn btn-sm rounded-pill px-3 ${
                                mode === "dark"
                                  ? "btn-outline-light"
                                  : "btn-outline-dark"
                              }`}
                              onClick={() => {
                                setSelectedTodo(t);
                                setShowTodoModal(true);
                              }}
                            >
                              Edit
                            </button>{" "}
                            <button
                              className={`btn btn-sm rounded-pill px-3 ${
                                mode === "dark"
                                  ? "btn-outline-light"
                                  : "btn-outline-dark"
                              }`}
                              onClick={() => {
                                handleDeleteTodo(t.id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className="text-center py-5"
                        style={{ color: "var(--pv-muted)" }}
                      >
                        No todos yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ================= RIGHT ================= */}
              <div className="col-lg-4">
                {/* STATS */}
                <div className="project-view__card p-4">
                  <h4 className="fw-bold mb-4">Statistics</h4>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary small">Progress</span>

                      <span className="small">{Math.round(progress)}%</span>
                    </div>

                    <div
                      className="progress"
                      style={{
                        height: "12px",
                        borderRadius: "999px",
                        background: "var(--pv-progress-track)",
                      }}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          width: `${progress}%`,
                          background: "linear-gradient(90deg,#3b82f6,#8b5cf6)",
                          borderRadius: "999px",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div
                    className="d-flex justify-content-between mb-3 p-3"
                    style={{
                      background: "var(--pv-card-2)",
                      borderRadius: "16px",
                    }}
                  >
                    <span>Total Todos</span>

                    <strong>{totalTodos}</strong>
                  </div>

                  <div
                    className="d-flex justify-content-between mb-3 p-3"
                    style={{
                      background: "var(--pv-card-2)",
                      borderRadius: "16px",
                    }}
                  >
                    <span>Completed</span>

                    <strong>{completedTodos}</strong>
                  </div>

                  <div
                    className="d-flex justify-content-between p-3"
                    style={{
                      background: "var(--pv-card-2)",
                      borderRadius: "16px",
                    }}
                  >
                    <span>Pending</span>

                    <strong>{pendingTodos}</strong>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="project-view__card p-4 mt-4">
                  <h4 className="fw-bold mb-4">Quick Actions</h4>

                  <div className="d-grid gap-3">
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="btn btn-warning rounded-pill py-2 fw-semibold"
                    >
                      Add member
                    </button>

                    <button
                      onClick={() => handleDeleteProject()}
                      className="btn btn-danger rounded-pill py-2 fw-semibold"
                    >
                      Delete Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ================= MODAL ================= */}
      {showTodoModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "var(--pv-modal-backdrop)",
            zIndex: 9999,
            backdropFilter: "blur(5px)",
          }}
        >
          <div className="project-view__modal p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="m-0 fw-bold">
                {" "}
                {selectedTodo?.id ? "Edit Todo" : "Add Todo"}
              </h4>

              <button
                className="btn-close btn-close-white"
                onClick={() => setShowTodoModal(false)}
              ></button>
            </div>

            {/* title */}
            <div className="mb-3">
              <label className="form-label">Title</label>

              <input
                type="text"
                className="form-control project-view__input border-0"
                style={{
                  borderRadius: "14px",
                  padding: "12px",
                }}
                value={selectedTodo.title}
                onChange={(e) =>
                  setSelectedTodo({
                    ...selectedTodo,
                    title: e.target.value,
                  })
                }
              />
            </div>

            {/* description */}
            <div className="mb-3">
              <label className="form-label">Description</label>

              <textarea
                rows="4"
                className="form-control project-view__input border-0"
                style={{
                  borderRadius: "14px",
                  padding: "12px",
                }}
                value={selectedTodo.description}
                onChange={(e) =>
                  setSelectedTodo({
                    ...selectedTodo,
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>

            {/* priority */}
            <div className="mb-3">
              <label className="form-label">Priority</label>

              <select
                className="form-select project-view__input border-0"
                style={{
                  borderRadius: "14px",
                  padding: "12px",
                }}
                value={selectedTodo.priority}
                onChange={(e) =>
                  setSelectedTodo({
                    ...selectedTodo,
                    priority: +e.target.value,
                  })
                }
              >
                <option value={1}>LOW</option>

                <option value={2}>MEDIUM</option>

                <option value={3}>HIGH</option>
              </select>
            </div>
            {/* buttons */}
            <div className="d-flex justify-content-end gap-3">
              <button
                className="btn btn-secondary rounded-pill px-4"
                onClick={() => setShowTodoModal(false)}
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  selectedTodo?.id ? handleUpdateTodo() : handleCreateTodo()
                }
                className="btn rounded-pill px-4"
                style={{
                  background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                  color: "white",
                  border: "none",
                }}
              >
                {selectedTodo?.id ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
      <AddMemberModal
        searchUser={searchUser}
        show={showAddMemberModal}
        setShow={setShowAddMemberModal}
        id={id}
        userList={userList}
        memberIds={memberIds}
        setUserList={setUserList}
        setMemberIds={setMemberIds}
        setSearchUser={setSearchUser}
        getMember={getMember}
      />
      <ModalCreateUpdateProject
        show={showProjectModal}
        setShow={setShowProjectModal}
        modal={modal}
        ModalData={projectDetail}
        ProjectDataSubmit={projectDataSubmit}
        setProjectDataSubmit={setProjectDataSubmit}
        onSuccess={getProjectDetail}
      />
    </div>
  );
};

export default ProjectView;
