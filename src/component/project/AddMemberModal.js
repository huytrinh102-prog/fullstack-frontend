import { useState } from "react";
import { AddMember, DeleteMember } from "../services/userservice";
import { useSelector } from "react-redux";
import "./AddMemberModal.scss";
const AddMemberModal = (props) => {
  const {
    show,
    setShow,
    id,
    searchUser,
    userList,
    memberIds,
    setSearchUser,
    getMember,
  } = props;

  const [memberFilter, setMemberFilter] = useState("ALL");
  const mode = useSelector((state) => state.theme.mode);

  // add member
  const handleAddMember = async (userId) => {
    try {
      let res = await AddMember(id, userId);
      if (res && +res.EC === 0) {
        await getMember();
      }
    } catch (error) {}
  };
  const handleDeleteMember = async (userId) => {
    try {
      let res = await DeleteMember(id, userId);
      if (res?.EC === 0) {
        await getMember();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // filter search
  const filterUsers = userList.filter((u) => {
    const matchSearch =
      u.username?.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUser.toLowerCase());
    if (!matchSearch) return false;
    if (memberFilter === "MEMBER") {
      return memberIds.includes(u.id);
    }
    if (memberFilter === "NOT_MEMBER") {
      return !memberIds.includes(u.id);
    }
    return true;
  });

  return (
    <>
      {show && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "var(--amm-backdrop)",
            zIndex: 9999,
          }}
        >
          <div
            className="add-member-modal p-4 rounded shadow"
            style={{
              width: "500px",
              maxHeight: "90vh",
              overflow: "visible",
            }}
          >
            {/* header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="m-0">Add Member</h4>

              <button
                className={`btn-close ${mode === "dark" ? "btn-close-white" : ""}`}
                onClick={() => setShow(false)}
              ></button>
            </div>

            {/* search */}
            <div className="mb-3">
              <label className="form-label">Search User</label>

              <input
                type="text"
                className="form-control add-member-modal__input"
                placeholder="Enter username or email"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2 mb-3">
              <button
                className={`btn btn-sm ${
                  memberFilter === "ALL" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setMemberFilter("ALL")}
              >
                All
              </button>

              <button
                className={`btn btn-sm ${
                  memberFilter === "MEMBER"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setMemberFilter("MEMBER")}
              >
                Members
              </button>

              <button
                className={`btn btn-sm ${
                  memberFilter === "NOT_MEMBER"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setMemberFilter("NOT_MEMBER")}
              >
                Not Members
              </button>
            </div>
            {/* user list */}
            <div
              className="add-member-modal__list"
              style={{
                minHeight: "150px",
                maxHeight: "330px",
                overflowY: "auto",
                overscrollBehavior: "contain",
              }}
            >
              {filterUsers.length > 0 ? (
                filterUsers.map((user) => (
                  <div
                    key={user.id}
                    className="user-item d-flex justify-content-between align-items-center p-3 border-bottom"
                  >
                    <div>
                      <div className="fw-bold">{user.username}</div>

                      <div
                        className="user-email add-member-modal__muted"
                        style={{
                          fontSize: "13px",
                        }}
                      >
                        {user.email}
                      </div>
                    </div>
                    {memberIds.includes(user.id) ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleDeleteMember(user.id)}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddMember(user.id)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center p-4">No users found</div>
              )}
            </div>
            {/* footer */}
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => setShow(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddMemberModal;
