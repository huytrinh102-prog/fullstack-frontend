import { useEffect, useState } from "react";
import { ImSpinner } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
import {
  CreateProject,
  UpdateProject,
  GetSignAvatar,
  uploadToCloudinary,
} from "../services/userservice";

import { toast } from "react-toastify";
// import "./Users.scss";
const ModalCreateUpdateProject = (props) => {
  const {
    onSuccess,
    show,
    setShow,
    ModalData,
    ProjectDataSubmit,
    ProjectData,
    modal,
    setProjectDataSubmit,
  } = props;

  const checkIsValid = {
    isValidname: true,
    isValidstartDate: true,
    isValidendDate: true,
    isValidstatus: true,
  };

  const [isValid, setIsValid] = useState(checkIsValid);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const handleSubmitCreateUpdateUser = async (e) => {
    e.preventDefault();
    let { name, startDate, endDate } = ProjectDataSubmit;
    setIsValid(checkIsValid);
    if (!name) {
      toast.error("Please fill the form");
      setIsValid({ ...checkIsValid, isValidname: false });
      return;
    }
    if (!startDate) {
      setIsValid({ ...checkIsValid, isValidusername: false });
      toast.error("Please fill the form");
      return;
    }
    if (
      !endDate ||
      new Date(ProjectDataSubmit.endDate) <
        new Date(ProjectDataSubmit.startDate)
    ) {
      setIsValid({ ...checkIsValid, isValidendDate: false });
      toast.error("Invalid DATE");
      return;
    }
    if (modal === "CREATE") {
      const res = await CreateProject(ProjectDataSubmit);
      if (res && +res.EC === 0) {
        onSuccess?.();
        toast.success(res.EM);
        setProjectDataSubmit(ProjectData);
        setShow(false);
        setPreview();
      } else {
        toast.error(res.EM);
      }
    }
    if (modal === "UPDATE") {
      const res = await UpdateProject(ProjectDataSubmit, ModalData.id);
      if (res && +res.EC === 0) {
        onSuccess?.();
        toast.success(res.EM);
        setShow(false);
      } else {
        toast.error(res.EM);
      }
    }
  };

  useEffect(() => {
    if (modal === "UPDATE" && ModalData) {
      setProjectDataSubmit({
        name: ModalData.name,
        description: ModalData.description,
        startDate: ModalData.startDate,
        endDate: ModalData.endDate,
        status: ModalData.status,
      });
      setPreview(ModalData.avatarUrl);
    } else if (modal === "CREATE") {
      setProjectDataSubmit(ProjectData);
      setPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModalData, modal]);
  const handleOnchangeAvatar = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setFileName(
        file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name,
      );
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, WEBP allowed");
        return;
      }
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB

      if (file.size > MAX_SIZE) {
        toast.error("File too large (max 2MB)");
        return;
      }
      if (file.name.length > 100) {
        toast.error("File name too long");
        return;
      }
      setPreview(URL.createObjectURL(file));
      let res = await GetSignAvatar();
      if (res && res.EC === 0) {
        setIsUploading(true);
        let resp = await uploadToCloudinary(res.DT, file);
        setProjectDataSubmit((prev) => ({
          ...prev,
          avatarUrl: resp?.data?.secure_url,
          avatarPublicId: resp?.data?.public_id,
        }));
      }
    } catch (error) {
      console.log("CLOUD ERR:", error?.response?.data || error.message);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <>
      {show && (
        <div className="modal show d-block modal-xl" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modal === "CREATE"
                    ? "Create new Project"
                    : "Update the Project"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShow(false);
                    setPreview("");
                    setFileName("");
                  }}
                ></button>
              </div>
              <div className="modal-body row">
                <form className="row" onSubmit={handleSubmitCreateUpdateUser}>
                  <div className="mb-3 col-6">
                    <label className="form-label">Project name</label>
                    <input
                      type="text"
                      className={
                        isValid.isValidname
                          ? "form-control"
                          : "form-control is-invalid"
                      }
                      value={ProjectDataSubmit.name}
                      onChange={(e) =>
                        setProjectDataSubmit({
                          ...ProjectDataSubmit,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3 col-6">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className={"form-control"}
                      value={ProjectDataSubmit.description}
                      onChange={(e) =>
                        setProjectDataSubmit({
                          ...ProjectDataSubmit,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3 col-6">
                    <label className="form-label">startDate</label>

                    <input
                      type="date"
                      className={
                        isValid.isValidstartDate
                          ? "form-control"
                          : "form-control is-invalid"
                      }
                      value={ProjectDataSubmit.startDate?.split(" ")[0] || ""}
                      onChange={(e) =>
                        setProjectDataSubmit({
                          ...ProjectDataSubmit,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3 col-6">
                    <label className="form-label">endDate</label>

                    <input
                      type="date"
                      className={
                        isValid.isValidendDate
                          ? "form-control"
                          : "form-control is-invalid"
                      }
                      value={ProjectDataSubmit.endDate?.split("T")[0] || ""}
                      onChange={(e) =>
                        setProjectDataSubmit({
                          ...ProjectDataSubmit,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="avatar mb-3 col-4">
                    <label className="form-label">Project Avatar</label>
                    <div className="avatar-container">
                      <label htmlFor="add-avatar" className="upload-label">
                        <div className="icon-box">
                          <FaPlus className="add-icon" />
                        </div>
                        <span className="file-name">
                          {fileName || "Choose your avatar"}
                        </span>
                      </label>

                      <input
                        id="add-avatar"
                        type="file"
                        hidden
                        onChange={handleOnchangeAvatar}
                      />
                    </div>
                  </div>
                  <div className="preview col-2 text-center">
                    {isUploading && (
                      <div>
                        <ImSpinner className="spin" />
                      </div>
                    )}
                    {preview && !isUploading && (
                      <img className="image" src={preview} alt="avatar" />
                    )}
                  </div>
                  <div className="container">
                    <button
                      disabled={isUploading}
                      type="submit"
                      className="btn btn-primary"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCreateUpdateProject;
