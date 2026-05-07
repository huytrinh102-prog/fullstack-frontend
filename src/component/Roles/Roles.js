import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { CreateRoles, DeleteRoles, GetAllRoles, UpdateRoles } from "../services/userservice";
import { useSearchParams } from "react-router-dom";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = +searchParams.get("page") || 1;
  const keyword = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "id,desc";

  const [form, setForm] = useState({ url: "", description: "" });
  const [editingRoleId, setEditingRoleId] = useState(null);

  const fetchRoles = async () => {
    const res = await GetAllRoles(currentPage, 10, keyword, sort);
    if (res && +res.EC === 0) {
      setRoles(res.DT?.roles || res.DT || []);
      setTotalPages(res.DT?.totalPages || 1);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchRoles(), 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, keyword, sort]);

  const handlePageClick = (e) => {
    setSearchParams({ page: +e.selected + 1, search: keyword, sort });
  };

  const handleSearchChange = (e) => {
    setSearchParams({ page: 1, search: e.target.value, sort });
  };

  const handleToggleSortId = () => {
    const [field, direction] = sort.split(",");
    if (field !== "id") {
      setSearchParams({ page: 1, search: keyword, sort: "id,asc" });
      return;
    }
    const next = direction === "asc" ? "desc" : "asc";
    setSearchParams({ page: 1, search: keyword, sort: `id,${next}` });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.url) {
      toast.error("Role url is required");
      return;
    }
    if (editingRoleId) {
      const res = await UpdateRoles(form, editingRoleId);
      if (res && +res.EC === 0) toast.success(res.EM || "Updated");
      else toast.error(res?.EM || "Update failed");
    } else {
      const res = await CreateRoles(form);
      if (res && +res.EC === 0) toast.success(res.EM || "Created");
      else toast.error(res?.EM || "Create failed");
    }
    setForm({ url: "", description: "" });
    setEditingRoleId(null);
    fetchRoles();
  };

  const handleEdit = (r) => {
    setEditingRoleId(r.id);
    setForm({ url: r.url || "", description: r.description || "" });
  };

  const handleDelete = async (roleId) => {
    const ok = window.confirm("Delete this role?");
    if (!ok) return;
    const res = await DeleteRoles(roleId);
    if (res && +res.EC === 0) toast.success(res.EM || "Deleted");
    else toast.error(res?.EM || "Delete failed");
    fetchRoles();
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Roles</h1>

      <div className="row g-2 align-items-center mb-3">
        <div className="col-12 col-md-6">
          <input
            className="form-control"
            placeholder="Search role..."
            value={keyword}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-end">
          <button className="btn btn-outline-secondary" onClick={handleToggleSortId}>
            Sort ID ({sort})
          </button>
          <button
            className="btn btn-success"
            onClick={() => setSearchParams({ page: 1, search: "", sort: "id,desc" })}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="card p-3 shadow-sm mb-3">
        <form className="row g-2" onSubmit={handleSubmit}>
          <div className="col-12 col-md-4">
            <input
              className="form-control"
              placeholder="url (ex: /api/v1/read)"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="col-12 col-md-2 d-grid">
            <button className="btn btn-primary" type="submit">
              {editingRoleId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>URL</th>
              <th>Description</th>
              <th style={{ width: 160 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles?.length ? (
              roles.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.url || ""}</td>
                  <td>{r.description || ""}</td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-sm btn-success" onClick={() => handleEdit(r)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No roles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalPages > 0 ? +totalPages : 1}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default Roles;
