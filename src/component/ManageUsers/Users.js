import { useEffect, useState } from "react";
import { GetAllUsers, DeleteUser, GetAllGroups } from "../services/userservice";
import ReactPaginate from "react-paginate";
import "./Users.scss";
import { toast } from "react-toastify";
import ModalCreateUpdateUser from "./ModalCreateUpdateUser";
import { useSearchParams } from "react-router-dom";

const User = () => {
  const [listUser, setListUser] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [ModalData, setModalData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [listGroups, setListGroups] = useState([]);
  const [modal, setModal] = useState("");

  const userData = {
    email: "",
    password: "",
    username: "",
    phone: "",
    sex: "MALE",
    groupId: 1,
    // avatarUrl: "",
    // avatarPublicId: "",
  };
  const [userDataSubmit, setUserDataSubmit] = useState(userData);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = +searchParams.get("page") || 1;
  const keyword = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "id,desc";

  const fetchAllGroups = async () => {
    const res = await GetAllGroups();
    if (res && +res?.EC === 0) {
      setListGroups(res.DT);
    }
  };

  useEffect(() => {
    fetchAllGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchListUsers = async () => {
    try {
      let res = await GetAllUsers(currentPage, 5, keyword, sort);
      if (res && +res.EC === 0) {
        setListUser(res.DT.users);
        console.log(res);
        setTotalPages(res.DT.totalPages);
      }
    } catch (error) {
      // axios interceptor will toast
    }
  };

  const handlePageClick = (e) => {
    setSearchParams({ page: +e.selected + 1, search: keyword, sort: sort });
  };

  const handleRefresh = async () => {
    setSearchParams({ page: 1, search: "", sort: "id,asc" });
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

  const handleDeleteUser = async (id, email) => {
    const confirmDelete = window.confirm(`Delete this user? : ${email}`);
    if (!confirmDelete) return;
    let res = await DeleteUser(id);
    if (res && +res?.EC === 0) {
      toast.success(res.EM);
      fetchListUsers(currentPage);
    } else {
      toast.error(res.EM);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchListUsers();
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, currentPage, sort]);

  return (
    <>
      <div>
        <h1 className="text-center mt-5">Users List</h1>
      </div>
      <div className="container">
        <div className="row g-2 align-items-center mb-3">
          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Search email/username..."
              value={keyword}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-end">
            <button className="btn btn-outline-secondary" onClick={handleToggleSortId}>
              Sort ID ({sort})
            </button>
            <button className="btn btn-success" onClick={handleRefresh}>
              Reset
            </button>
          </div>
        </div>

        <button
          className="btn btn-primary m-3"
          onClick={() => {
            setShowModal(true);
            setModal("CREATE");
          }}
        >
          Create
        </button>
        <button className="btn btn-success" onClick={() => fetchListUsers()}>
          Refresh
        </button>
      </div>
      <div className="user-table col-11 container ml-3">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr className="">
              <th scope="col">ID</th>
              <th scope="col">EMAIL</th>
              <th scope="col">UserName</th>
              <th scope="col">Group</th>
              <th scope="col" className="col-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {listUser &&
              listUser.length > 0 &&
              listUser.map((item, index) => (
                <tr key={`key${index + 1}`}>
                  <th scope="row">{item.id}</th>
                  <td>{item.email}</td>
                  <td>{item.username ? item.username : ""}</td>
                  <td>{item.Group ? item.Group.name : ""}</td>
                  <td className="user-action">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setShowModal(true);
                        setModalData(item);
                        setModal("UPDATE");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(item.id, item.email)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="listUser-footer container">
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={totalPages > 5 ? +totalPages : 5}
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
      <ModalCreateUpdateUser
        listGroups={listGroups}
        setShow={setShowModal}
        ModalData={ModalData}
        show={showModal}
        userDataSubmit={userDataSubmit}
        setUserDataSubmit={setUserDataSubmit}
        modal={modal}
        userData={userData}
      />
    </>
  );
};

export default User;
