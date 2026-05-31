import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { GetDashboard } from "../services/userservice";

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProject: 0,
      totalTodo: 0,
      completedTodo: 0,
      pendingTodo: 0,
    },

    recentProjects: [],

    recentTodos: [],
  });

  const GetDashboardData = async () => {
    try {
      let res = await GetDashboard();

      if (+res?.EC === 0) {
        setDashboardData(res.DT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetDashboardData();
  }, []);

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">Welcome back 👋</h2>

        <p className="">Manage your projects and tasks</p>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <h3 className="fw-bold">{dashboardData.stats.totalProject}</h3>

            <p className="mb-0">Total Projects</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <h3 className="fw-bold">{dashboardData.stats.totalTodo}</h3>

            <p className="mb-0">Total Tasks</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <h3 className="fw-bold">{dashboardData.stats.completedTodo}</h3>

            <p className="mb-0">Completed</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <h3 className="fw-bold">{dashboardData.stats.pendingTodo}</h3>

            <p className="mb-0">Pending</p>
          </div>
        </div>
      </div>

      <div className="row">
        {/* TODOS */}
        <div className="col-lg-7 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">My Tasks</h4>

                <button className="btn btn-primary btn-sm">Add Task</button>
              </div>

              {dashboardData.recentTodos.length > 0 ? (
                dashboardData.recentTodos.map((todo) => (
                  <div key={todo.id} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6
                          className={`mb-1 ${
                            todo.status === "Completed"
                              ? "text-decoration-line-through"
                              : ""
                          }`}
                        >
                          {todo.title}
                        </h6>

                        <small className="">
                          Deadline: {todo.endDate || "No deadline"}
                        </small>
                      </div>

                      <span
                        className={`badge ${
                          todo.status === "Completed"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {todo.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <h5>No tasks yet</h5>

                  <p className="">Create your first todo</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="col-lg-5 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Recent Projects</h4>

                <button className="btn btn-outline-dark btn-sm">
                  View All
                </button>
              </div>

              {dashboardData.recentProjects.length > 0 ? (
                dashboardData.recentProjects.map((project) => (
                  <div key={project.id} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">{project.name}</h6>

                      <span className="badge bg-primary">
                        {project.status || "Active"}
                      </span>
                    </div>

                    <p className="small mb-3">
                      {project.description || "No description"}
                    </p>

                    <div className="progress mb-2">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${project.progress || 50}%`,
                        }}
                      ></div>
                    </div>

                    <small className="">
                      Progress: {project.progress || 50}%
                    </small>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <h5>No projects yet</h5>

                  <p className="">Create your first project</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
