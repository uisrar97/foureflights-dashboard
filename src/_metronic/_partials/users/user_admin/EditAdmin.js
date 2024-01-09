import React, { useState } from "react";
import { Plane } from "react-loader-spinner";
import { Button, Modal } from "react-bootstrap";
import { TextCapitalizeFirst } from "../../../../_metronic/_helpers/HelperFunctions";

export default function EditAdmin({
  user,
  roles,
  showModal,
  handleShow,
  loader,
  setLoader,
  setSubmitAdmin,
  creditLimit,
  setCreditLimit,
  fName,
  lName,
  email,
  contact,
  selectedRole,
  setFName,
  setLName,
  setEmail,
  setContact,
  setSelectedRole,
}) {
  const [disBtn, setDisBtn] = useState(true);

  let fNameCount = 0;
  let lNameCount = 0;
  let emailCount = 0;
  let contactCount = 0;
  let roleCount = 0;

  const [fNameLabel, setFNameLabel] = useState(false);
  const [lNameLabel, setLNameLabel] = useState(false);
  const [emailLabel, setEmailLabel] = useState(false);
  const [contactLabel, setContactLabel] = useState(false);
  const [roleLabel, setRoleLabel] = useState(false);
  const [creditLabel, setCreditLabel] = useState("");

  function toggleBtn(check) {
    if (check) {
      setDisBtn(true);
    } else {
      setDisBtn(false);
    }
  }

  function formValidation() {
    let fieldVals = [];

    fieldVals.push({
      fieldName: "fNameField",
      val: document.getElementById("first-name").value,
    });
    fieldVals.push({
      fieldName: "lNameField",
      val: document.getElementById("last-name").value,
    });
    fieldVals.push({
      fieldName: "emailField",
      val: document.getElementById("email").value,
    });
    fieldVals.push({
      fieldName: "contactField",
      val: document.getElementById("contact").value,
    });
    fieldVals.push({
      fieldName: "roleField",
      val: document.getElementById("role").value,
    });
    fieldVals.push({
      fieldName: "credit_limit",
      val: document.getElementById("credit_limit").value,
    });

    fieldVals.map((field) => {
      if (field.fieldName === "fNameField") {
        if (field.val !== "" && field.val.length > 0) {
          fNameCount = 1;
          setFNameLabel(false);
        } else if (field.val === "" || field.val.length === 0) {
          fNameCount = 0;
          setFNameLabel(true);
        }
      }

      if (field.fieldName === "lNameField") {
        if (field.val !== "" && field.val.length > 0) {
          lNameCount = 1;
          setLNameLabel(false);
        } else if (field.val === "" || field.val.length === 0) {
          lNameCount = 0;
          setLNameLabel(true);
        }
      }

      if (field.fieldName === "emailField") {
        if (
          field.val !== "" &&
          field.val.length > 0 &&
          field.val.indexOf("@") > -1
        ) {
          emailCount = 1;
          setEmailLabel(false);
        } else if (
          field.val === "" ||
          field.val.length === 0 ||
          field.val.indexOf("@") === -1
        ) {
          emailCount = 0;
          setEmailLabel(true);
        }
      }

      if (field.fieldName === "contactField") {
        if (field.val !== "" && field.val.length > 0) {
          contactCount = 1;
          setContactLabel(false);
        } else if (field.val === "" || field.val.length === 0) {
          contactCount = 0;
          setContactLabel(true);
        }
      }

      if (field.fieldName === "roleField") {
        if (field.val !== "Select Admin Role" && field.val.length > 0) {
          roleCount = 1;
          setRoleLabel(false);
        } else if (
          field.val === "Select Admin Role" ||
          field.val.length === 0
        ) {
          roleCount = 0;
          setRoleLabel(true);
        }
      }
      return "";
    });
    if (
      fNameCount === 0 ||
      lNameCount === 0 ||
      emailCount === 0 ||
      contactCount === 0 ||
      roleCount === 0
    ) {
      toggleBtn(true);
    } else {
      toggleBtn(false);
    }
  }
  return (
    <Modal
      show={showModal}
      onHide={handleShow}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title className="text-center">Edit Admin</Modal.Title>
        {!loader && (
          <Button variant="normal" onClick={handleShow}>
            <i className="fas fa-times p-0" />
          </Button>
        )}
      </Modal.Header>
      <Modal.Body>
        {!loader ? (
          <form autoComplete="off">
            <div className="d-flex flex-column mb-2">
              <div className="d-flex flex-row text-left mt-3">
                <div className="col-md-6">
                  <label className="font-weight-bold" htmlFor="first-name">
                    First Name
                  </label>
                  <input
                    type="search"
                    className="form-control "
                    id="first-name"
                    placeholder="Enter First Name"
                    onChange={(e) => {
                      setFName(TextCapitalizeFirst(e.target.value));
                      formValidation();
                    }}
                    defaultValue={fName}
                  />
                  {fNameLabel && fName.length === 0 && (
                    <p className="text-danger font-weight-bold">
                      * Provide First Name
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="font-weight-bold" htmlFor="last-name">
                    Last Name
                  </label>
                  <input
                    type="search"
                    className="form-control "
                    id="last-name"
                    placeholder="Enter Last Name"
                    onChange={(e) => {
                      setLName(TextCapitalizeFirst(e.target.value));
                      formValidation();
                    }}
                    defaultValue={lName}
                  />
                  {lNameLabel && lName.length === 0 && (
                    <p className="text-danger font-weight-bold">
                      * Provide Last Name
                    </p>
                  )}
                </div>
              </div>
              <div className="d-flex flex-row text-left mt-3">
                <div className="col-md-6">
                  <label className="font-weight-bold" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control "
                    id="email"
                    readOnly
                    onFocus={() =>
                      document
                        .getElementById("email")
                        .removeAttribute("readOnly")
                    }
                    placeholder="Enter Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      formValidation();
                    }}
                    defaultValue={email}
                    autoComplete={"off"}
                  />
                  {emailLabel && email.length === 0 ? (
                    <p className="text-danger font-weight-bold">
                      * Provide Email Address
                    </p>
                  ) : (
                    emailLabel &&
                    email.length !== 0 &&
                    email.indexOf("@") === -1 && (
                      <p className="text-danger font-weight-bold">
                        * Provide Valid Email Address
                      </p>
                    )
                  )}
                </div>
                <div className="col-md-6">
                  <label className="font-weight-bold" htmlFor="contact">
                    Contact #
                  </label>
                  <input
                    type="number"
                    className="form-control  remove-input-number-arrows"
                    id="contact"
                    placeholder="Enter Contact #"
                    onChange={(e) => {
                      setContact(e.target.value);
                      formValidation();
                    }}
                    defaultValue={contact}
                  />
                  {contactLabel && contact.length === 0 && (
                    <p className="text-danger font-weight-bold">
                      * Provide Contact Number
                    </p>
                  )}
                </div>
              </div>
              <div className="d-flex flex-row text-left mt-3">
                <div className="col-md-6">
                  {user.role_code && user.role_code === "super-admin" ? (
                    <div className="row text-left mt-3">
                      <div className="col-md-12">
                        <label className="font-weight-bold" htmlFor="role">
                          Role
                        </label>
                        {roles && roles.length > 0 && (
                          <>
                            <select
                              className="form-control "
                              id="role"
                              defaultValue={selectedRole}
                              onChange={(e) => {
                                setSelectedRole(e.target.value);
                                formValidation();
                              }}
                            >
                              <option value="">Select Admin Role</option>
                              {roles.map((role, index) => {
                                if (
                                  role.role_code === "developer" ||
                                  role.role_code.indexOf("sub-vendor") > -1
                                ) {
                                  return "";
                                } else {
                                  return (
                                    <option key={index} value={role.id}>
                                      {role.role_name}
                                    </option>
                                  );
                                }
                              })}
                            </select>
                            {roleLabel && selectedRole === "" && (
                              <p className="text-danger font-weight-bold">
                                * Select Admin Role
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <input type="hidden" defaultValue={" "} id="role" />
                  )}
                </div>
                <div className="col-md-6 mt-4">
                  <label htmlFor="credit_limit"> Credits Limit</label>
                  <input
                    min={0}
                    className="form-control "
                    type="number"
                    name={creditLabel}
                    id="credit_limit"
                    onChange={(e) => {
                      setCreditLimit(e.target.value);
                      formValidation();
                    }}
                    defaultValue={creditLimit}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 text-center mt-2">
                <Button
                  variant="primary"
                  className="submit-btn"
                  onClick={() => {
                    setSubmitAdmin(true);
                    setLoader(!loader);
                  }}
                  disabled={disBtn}
                >
                  Edit Admin
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="d-flex flex-column text-center plane-loader">
            <Plane secondaryColor="#378edd" color="#378edd" />
            <h3>Please Wait... We are Updating Admin Details</h3>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
