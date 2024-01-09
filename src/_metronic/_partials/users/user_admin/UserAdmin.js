import React, { useState, useEffect, useCallback } from "react";
import Axios from "../../../../app/service";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Paper,
} from "@material-ui/core";
import AddAdmin from "./AddAdmin";
import EditAdmin from "./EditAdmin";
import SweetAlert from "sweetalert2";
import {
  ShowAlert,
  AuthUserData,
  AuthFunction,
  InnerRightsFilter,
  stableSort,
  getSorting,
  EnhancedTableHead,
  EnhancedTableToolbar,
  useStyles,
} from "../../../_helpers/HelperFunctions";

const headRows = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "Sr. #",
    align: "left",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
    align: "left",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
    align: "left",
  },
  {
    id: "mobile",
    numeric: false,
    disablePadding: false,
    label: "Mobile",
    align: "left",
  },
  {
    id: "role",
    numeric: false,
    disablePadding: false,
    label: "Role",
    align: "left",
  },
  {
    id: "credit_limit",
    numeric: false,
    disablePadding: false,
    label: "Credit Limit",
    align: "left",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    align: "left",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Action",
    align: "left",
  },
];

export function UserAdmin({ admins, fetchadmins }) {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const userData = AuthUserData();
  const options = AuthFunction();

  const [addAdmin, setAddAdmin] = useState(false);
  const [addLoader, setAddLoader] = useState(false);
  const [editAdmin, setEditAdmin] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [editData, setEditData] = useState({});

  const [userRoles, setUserRoles] = useState({});
  const [rolesLoader, setRolesLoader] = useState(true);
  const [submitAdmin, setSubmitAdmin] = useState(false);

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [intialPass, setIntialPass] = useState("");
  const [conPass, setConPass] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [uID, setUID] = useState(0);
  const [uStatus, setUStatus] = useState("");
  const [updateUserStatus, setUpdateUserStatus] = useState(false);
  const [sFilter, setSFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("Flight");
  const [creditLimit, setCreditLimit] = useState();

  let rows = [];
  let count = 1;
  if (admins.data.length > 0) {
    rows = admins.data.map((admin) => {
      if (
        (Number(admin.parent_id) === userData.userId ||
          userData.role_code === "super-admin") &&
        admin.id !== userData.userId
      ) {
        let id = count;
        let dID = admin.id;
        let name = admin.first_name + " " + admin.last_name;
        let email = admin.email;
        let mobile = admin.mobile;
        let role = admin.role_name;
        let status = admin.status;
        let editData = admin;
        count++;
        return { dID, id, name, email, mobile, role, status, editData };
      } else {
        return "";
      }
    });
    rows = rows.filter(Boolean);
  }

  const userStatusUpdate = useCallback(
    async (request) => {
      Axios({})
        .get(request)
        .then((response) => {
          const res = response.data;
          ShowAlert(res.status, res.message);
          setUpdateUserStatus(false);
          setUStatus("");
          setUID(0);
          fetchadmins();
        });
    },
    [fetchadmins]
  );

  const fetchroles = useCallback(async (data) => {
    Axios({})
      .get("admin/getroles")
      .then((response) => {
        const res = response.data;
        setUserRoles(res);
        if (data === "add") {
          setAddAdmin(true);
        } else if (data === "edit") {
          setEditAdmin(true);
        }
        setRolesLoader(false);
      });
  }, []);

  const addUpdateAdmin = useCallback(
    async (request) => {
      Axios(options)
        .get(request)
        .then((response) => {
          const res = response.data;
          ShowAlert(res.status, res.message);
          setSubmitAdmin(false);
          setAddAdmin(false);
          setEditAdmin(false);
          setRolesLoader(true);
          setUID(0);
          fetchadmins();
        });
    },
    [options, fetchadmins]
  );

  useEffect(() => {
    if (updateUserStatus) {
      const req = `/admin/updateuserstatus/${uID}?status=${uStatus}`;
      userStatusUpdate(req);
    }
    if (submitAdmin) {
      const req = `admin/adduser?user_id=${uID}&first_name=${fName}&last_name=${lName}&email=${email}&password=${intialPass}&role_id=${selectedRole}&mobile_no=${contact}&credit_limit=${creditLimit}`;
      addUpdateAdmin(req);
    }
    if (editAdmin && rolesLoader) {
      setFName(editData.first_name);
      setLName(editData.last_name);
      setEmail(editData.email);
      setContact(editData.mobile);
      setSelectedRole(editData.role_id);
      setCreditLimit(editData.credit_limit);
      setUID(editData.id);
      fetchroles("edit");
    }
  }, [
    updateUserStatus,
    userStatusUpdate,
    addAdmin,
    fetchroles,
    uID,
    uStatus,
    submitAdmin,
    fName,
    lName,
    email,
    intialPass,
    rolesLoader,
    selectedRole,
    contact,
    addUpdateAdmin,
    editAdmin,
    editData,
  ]);

  const changeUserStatus = (id, status) => {
    setUID(id);
    setUStatus(status);
    setUpdateUserStatus(true);
  };

  const handleAddShow = () => {
    setAddAdmin(!addAdmin);
  };

  const handleEditShow = (data) => {
    if (editAdmin) {
      setEditData({});
      setRolesLoader(true);
      setEditAdmin(false);
    } else {
      setEditData(data);
      setEditAdmin(true);
      setEditLoader(false);
    }
  };

  const deleteAlert = (id, status) => {
    SweetAlert.fire({
      title: "Are you sure you want to delete this admin?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        setUID(id);
        setUStatus(status);
        setUpdateUserStatus(true);
      } else if (result.isDenied) {
        setUpdateUserStatus(false);
      }
    });
  };

  const handleSearch = (event) => {
    setSFilter(event.target.value);
  };

  const filterFunction = () => {
    rows = rows
      .filter((row) => {
        return (
          (row.name.toLowerCase().includes(sFilter.toLowerCase()) ||
            row.mobile.includes(sFilter.toLowerCase()) ||
            row.role.toLowerCase().includes(sFilter.toLowerCase()) ||
            row.email.toLowerCase().includes(sFilter.toLowerCase())) &&
          row
        );
      })
      .map((filteredData) => {
        return filteredData;
      });
  };

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const handleRoleFilter = (event) => {
    setRoleFilter(event.target.value);
  };
  const filterRoles = () => {
    rows = rows
      .filter((row) => {
        if (roleFilter) {
          if (roleFilter === "Flight") {
            if (row.role.toLowerCase().indexOf("hotel") === -1) {
              return row;
            }
          } else {
            if (
              row.role.toLowerCase().indexOf(roleFilter.toLowerCase()) !== -1
            ) {
              return row;
            }
          }
        }
      })
      .map((filteredData) => {
        return filteredData;
      });
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title="Admin Users" />
        <div className={classes.tableWrapper}>
          <div className="d-flex flex-row justify-content-end">
            {/* depart satus filter goes here */}
            <div className="col-md-2">
              <select
                className="form-control border-primary border-1 ml-3 "
                defaultValue={filterRoles}
                onChange={handleRoleFilter}
              >
                <option value="Flight">Flights</option>
                <option value="Hotel">Hotels</option>
              </select>
            </div>
            {/* depart status filter end here */}
            <div className="col-3 float-right">
              <input
                type="search"
                className="form-control border-primary border-1"
                id="sBox"
                name="sBox"
                onChange={(e) => handleSearch(e)}
                placeholder="Search"
              />
            </div>

            {InnerRightsFilter("add-admin", userData) && (
              <div className="col-3 float-right">
                <button
                  className="form-control border-primary border-1 btn btn-primary"
                  onClick={() => {
                    fetchroles("add");
                  }}
                >
                  Add Admin
                </button>
              </div>
            )}
          </div>
        </div>
        {sFilter !== "" && filterFunction()}
        {roleFilter !== "" && filterRoles()}
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headRows={headRows}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.mobile}</TableCell>
                      <TableCell align="left">{row.role}</TableCell>
                      <TableCell align="left">
                        {row.editData.credit_limit}
                      </TableCell>

                      <TableCell align="left">
                        <span
                          className={
                            row.status === "Active"
                              ? "badge badge-success cursor-pointer"
                              : row.status === "Inactive"
                              ? "badge badge-warning cursor-pointer"
                              : "badge badge-danger cursor-pointer"
                          }
                          onClick={() => {
                            if (row.status === "Active") {
                              changeUserStatus(row.dID, "Inactive");
                            } else if (row.status === "Inactive") {
                              changeUserStatus(row.dID, "Active");
                            }
                          }}
                        >
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell align="left">
                        {InnerRightsFilter("edit-admin", userData) && (
                          <i
                            className="fas fa-edit cursor-pointer mr-2"
                            onClick={() => {
                              handleEditShow(row.editData);
                            }}
                          />
                        )}
                        {InnerRightsFilter("delete-admin", userData) && (
                          <i
                            className="fas fa-trash cursor-pointer"
                            onClick={() => {
                              deleteAlert(row.dID, "Deleted");
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
              {addAdmin && !rolesLoader && (
                <AddAdmin
                  user={userData}
                  roles={userRoles.data}
                  showModal={addAdmin}
                  handleShow={handleAddShow}
                  loader={addLoader}
                  setLoader={setAddLoader}
                  setSubmitAdmin={setSubmitAdmin}
                  fName={fName}
                  lName={lName}
                  email={email}
                  contact={contact}
                  intialPass={intialPass}
                  conPass={conPass}
                  selectedRole={selectedRole}
                  setFName={setFName}
                  setLName={setLName}
                  setEmail={setEmail}
                  setContact={setContact}
                  setIntialPass={setIntialPass}
                  setConPass={setConPass}
                  setSelectedRole={setSelectedRole}
                  setCreditLimit={setCreditLimit}
                  creditLimit={creditLimit}
                />
              )}
              {editAdmin && !rolesLoader && (
                <EditAdmin
                  user={userData}
                  roles={userRoles.data}
                  showModal={editAdmin}
                  handleShow={handleEditShow}
                  loader={editLoader}
                  setLoader={setEditLoader}
                  setSubmitAdmin={setSubmitAdmin}
                  fName={fName}
                  lName={lName}
                  email={email}
                  contact={contact}
                  intialPass={intialPass}
                  conPass={conPass}
                  selectedRole={selectedRole}
                  setFName={setFName}
                  setLName={setLName}
                  setEmail={setEmail}
                  setContact={setContact}
                  setIntialPass={setIntialPass}
                  setConPass={setConPass}
                  setSelectedRole={setSelectedRole}
                  setCreditLimit={setCreditLimit}
                  creditLimit={creditLimit}
                />
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page",
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page",
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
