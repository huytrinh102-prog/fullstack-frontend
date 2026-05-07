import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  GetAllGroups,
  GetRoles,
  GetRolesbyGroup,
  UpdateRolesbyGroup,
} from "../services/userservice";

const GroupRole = () => {
  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [checkedRoleIds, setCheckedRoleIds] = useState(new Set());

  const selectedGroup = useMemo(() => {
    return groups.find((g) => String(g.id) === String(selectedGroupId));
  }, [groups, selectedGroupId]);

  const loadGroups = async () => {
    const res = await GetAllGroups();
    if (res && +res.EC === 0) setGroups(res.DT || []);
    else toast.error(res?.EM || "Load groups failed");
  };

  const loadRoles = async () => {
    const res = await GetRoles();
    if (res && +res.EC === 0) {
      // support either {roles: []} or []
      setRoles(res.DT?.roles || res.DT || []);
    } else toast.error(res?.EM || "Load roles failed");
  };

  const loadGroupRoles = async (groupId) => {
    if (!groupId) return;
    const res = await GetRolesbyGroup(groupId);
    if (res && +res.EC === 0) {
      const roleList = res.DT?.roles || res.DT || [];
      setCheckedRoleIds(new Set(roleList.map((r) => r.id)));
    } else toast.error(res?.EM || "Load group roles failed");
  };

  useEffect(() => {
    loadGroups();
    loadRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadGroupRoles(selectedGroupId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId]);

  const toggleRole = (roleId) => {
    setCheckedRoleIds((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedGroupId) {
      toast.error("Please choose a group");
      return;
    }
    const payload = {
      groupId: +selectedGroupId,
      roleId: Array.from(checkedRoleIds),
    };
    const res = await UpdateRolesbyGroup(payload);
    if (res && +res.EC === 0) toast.success(res.EM || "Updated");
    else toast.error(res?.EM || "Update failed");
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Group - Role</h1>

      <div className="card p-3 shadow-sm mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <label className="form-label">Select group</label>
            <select
              className="form-select"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              <option value="">-- choose group --</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name || g.id}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Info</label>
            <div className="form-control bg-light">
              {selectedGroup
                ? `${selectedGroup.name || ""}`
                : "No group selected"}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-3 shadow-sm">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="fw-bold">Roles</div>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>

        <div className="row">
          {roles?.length ? (
            roles.map((r) => (
              <div className="col-12 col-md-6" key={r.id}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkedRoleIds.has(r.id)}
                    onChange={() => toggleRole(r.id)}
                    id={`role-${r.id}`}
                  />
                  <label className="form-check-label" htmlFor={`role-${r.id}`}>
                    {r.url || r.description || `Role ${r.id}`}
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted">No roles</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupRole;
