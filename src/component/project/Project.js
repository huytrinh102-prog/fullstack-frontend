import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Project.scss";
import ProjectView from "./ProjectView";
import { GetAllProject, DeleteProject } from "../services/userservice";

import ModalCreateUpdateProject from "./ProjectModal";

const Project = () => {
  // ================= STATE =================
  const [listProject, setListProject] = useState([]);

  const [ModalData, setModalData] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [modal, setModal] = useState("");

  // ================= DEFAULT FORM =================
  const ProjectData = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    avatarUrl: "",
    avatarPublicId: "",
  };

  const [projectDataSubmit, setProjectDataSubmit] = useState(ProjectData);
  const navigate = useNavigate();
  // ================= SEARCH PARAMS =================
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("search") || "";

  const filter = searchParams.get("filter") || "";

  // ================= FETCH PROJECTS =================
  const fetchListProjects = async () => {
    try {
      const res = await GetAllProject(keyword, filter);
      if (res && +res.EC === 0) {
        setListProject(res.DT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= DELETE =================
  const handleDeleteProject = async (id, name) => {
    try {
      const confirmDelete = window.confirm(`Delete this project? : ${name}`);

      if (!confirmDelete) return;

      const res = await DeleteProject(id);

      if (res && +res.EC === 0) {
        toast.success(res.EM);

        fetchListProjects();
      } else {
        toast.error(res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= VIEW =================
  const handleViewProject = async (id) => {
    navigate(`/project/${id}`);
  };

  // ================= SEARCH =================
  const handleSearchChange = (e) => {
    setSearchParams({
      search: e.target.value,
      filter,
    });
  };

  // ================= FILTER =================
  const filteredProjects = listProject.filter((item) => {
    return (
      item.name?.toLowerCase().includes(keyword.toLowerCase()) ||
      item.description?.toLowerCase().includes(keyword.toLowerCase())
    );
  });

  // ================= FIRST LOAD =================
  useEffect(() => {
    fetchListProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, filter]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-center mt-3">Projects List</h1>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="container mt-3">
        {/* SEARCH + CREATE */}
        <div className="row g-2 align-items-center mb-3">
          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Search Project..."
              value={keyword}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-end">
            <button
              className="btn btn-success"
              onClick={() => {
                setModal("CREATE");
                setProjectDataSubmit(ProjectData);
                setShowModal(true);
              }}
            >
              + Create New Project
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2">
            <button
              onClick={() => setSearchParams({ search: keyword, filter: "" })}
              className={`btn rounded-pill btn-sm ${
                filter === "" ? "btn-dark" : "btn-outline-secondary"
              }`}
            >
              All
            </button>

            <button
              onClick={() =>
                setSearchParams({ search: keyword, filter: "mine" })
              }
              className={`btn rounded-pill btn-sm ${
                filter === "mine" ? "btn-dark" : "btn-outline-secondary"
              }`}
            >
              Mine
            </button>

            <button
              onClick={() =>
                setSearchParams({ search: keyword, filter: "pending" })
              }
              className={`btn rounded-pill btn-sm ${
                filter === "pending" ? "btn-dark" : "btn-outline-secondary"
              }`}
            >
              Pending
            </button>

            <button
              onClick={() =>
                setSearchParams({ search: keyword, filter: "active" })
              }
              className={`btn rounded-pill btn-sm ${
                filter === "active" ? "btn-dark" : "btn-outline-secondary"
              }`}
            >
              Active
            </button>

            <button
              onClick={() =>
                setSearchParams({ search: keyword, filter: "completed" })
              }
              className={`btn rounded-pill btn-sm ${
                filter === "completed" ? "btn-dark" : "btn-outline-secondary"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* PROJECT LIST */}
        <div
          className="p-content"
          style={{
            height: "700px",
            overflowY: "auto",
          }}
        >
          <div className="p-cart row">
            {filteredProjects &&
              filteredProjects.map((item) => (
                <div className="p-cart col-md-3 mb-4" key={item.id}>
                  <div
                    className="card h-100 shadow-sm border-1"
                    style={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      minHeight: "200px",
                    }}
                  >
                    <div>
                      <span
                        className="delete-btn"
                        onClick={() => handleDeleteProject(item.id, item.name)}
                      >
                        X
                      </span>
                    </div>
                    {/* IMAGE */}
                    <img
                      className="card-img-top"
                      src={item.avatarUrl}
                      alt="project"
                      style={{
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <hr className="m-0"></hr>

                    {/* BODY */}
                    <div className="card-body text-center d-flex flex-column">
                      <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <h5 className="card-title fw-bold m-0">{item.name}</h5>

                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            display: "inline-block",
                            backgroundColor:
                              item.status === "COMPLETED"
                                ? "#198754"
                                : item.status === "PENDING"
                                  ? "#ffc107"
                                  : "#0d6efd",

                            boxShadow:
                              item.status === "COMPLETED"
                                ? "0 0 6px #198754"
                                : item.status === "PENDING"
                                  ? "0 0 6px #ffc107"
                                  : "0 0 6px #0d6efd",
                          }}
                        ></span>
                      </div>

                      <p
                        className="project-description card-text"
                        style={{
                          minHeight: "60px",
                        }}
                      >
                        {item.description}
                      </p>

                      {/* DATE */}
                      <div className="mb-3 small text-secondary">
                        <div>Start: {item.startDate?.split("T")[0]}</div>

                        <div>End: {item.endDate?.split("T")[0]}</div>
                      </div>
                      {/* BUTTON */}
                      <div className="d-flex gap-2 justify-content-center mt-auto">
                        <button
                          onClick={() => handleViewProject(item.id)}
                          className="btn btn-dark btn-sm"
                        >
                          View
                        </button>

                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => {
                            setModal("UPDATE");

                            setModalData(item);

                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <ModalCreateUpdateProject
        onSuccess={fetchListProjects}
        setShow={setShowModal}
        ModalData={ModalData}
        show={showModal}
        ProjectDataSubmit={projectDataSubmit}
        setProjectDataSubmit={setProjectDataSubmit}
        modal={modal}
        ProjectData={ProjectData}
      />
      <ProjectView />
    </>
  );
};

export default Project;
