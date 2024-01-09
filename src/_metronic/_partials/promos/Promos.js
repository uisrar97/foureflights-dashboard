import React, { useState, useEffect, useCallback, useRef } from "react";
import Axios from "../../../app/service";
import "rsuite/dist/rsuite.min.css";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Paper,
} from "@material-ui/core";
import SweetAlert from "sweetalert2";
import ViewPromo from "./ViewPromo";
import PaymentModal from "../flights/bookings/PaymentModal";
import {
  date_convert,
  ShowAlert,
  ShowConfirmAlert,
  AuthFunction,
  AuthUserData,
  InnerRightsFilter,
  stableSort,
  getSorting,
  EnhancedTableHead,
  EnhancedTableToolbar,
  useStyles,
} from "../../_helpers/HelperFunctions";
import AddPromo from "./AddPromo";
import EditPromo from "./EditPromo";

const headRows = [
  { id: "id", numeric: true, disablePadding: false, label: "Sr. #" },
  {
    id: "promo_title",
    numeric: true,
    disablePadding: false,
    label: "Promo Title",
  },
  {
    id: "promo_type",
    numeric: true,
    disablePadding: false,
    label: "Promo Type",
  },
  {
    id: "promo_value",
    numeric: true,
    disablePadding: false,
    label: "Promo Value",
  },
  {
    id: "promo_from_date",
    numeric: true,
    disablePadding: false,
    label: "From Date",
  },
  {
    id: "promo_to_date",
    numeric: true,
    disablePadding: false,
    label: "To Date",
  },
  {
    id: "promo_status",
    numeric: true,
    disablePadding: false,
    label: "Promo Status",
  },

  { id: "actions", numeric: true, disablePadding: false, label: "Action" },
];

export function Promos({ promos, fetchPromos }) {
  const userData = AuthUserData();
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  // const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showViewBookingModal, setViewBookingModal] = useState(false);
  const [flightData, setFlightData] = useState({});
  const [paymentModalShow, setPaymentModalShow] = useState(false);
  const [paymentConfirmation, setPaymentConfirmation] = useState(false);
  const [ticketLoader, setTicketLoader] = useState(false);
  const tableRef = useRef(null);
  const [addPromo, setAddPromo] = useState(false);
  const [addLoader, setAddLoader] = useState(false);
  const [promoData, setPromoData] = useState({});
  const [editPromo, setEditPromo] = useState(false);
  const [viewPromo, setViewPromo] = useState(false);

  const [editLoader, setEditLoader] = useState(false);
  const [sFilter, setSFilter] = useState("");
  const [PID, setPID] = useState(0);
  let promoName = "";
  let promo = "";

  const [finalPromoName, setFinalPromoName] = useState("");
  const [promoAdd, setPromoAdd] = useState(false);
  const [promoUpdate, setPromoUpdate] = useState(false);
  const [promoDelete, setPromoDelete] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [promoStatusUpdate, setPromoStatusUpdate] = useState(false);
  const [deletePromo, setDeletePromo] = useState(0);
  const [allData, setAllData] = useState({});

  const addUpdatePromo = useCallback(
    async (request, allData) => {
      Axios()
        .post(request, allData)
        .then((response) => {
          const res = response.data;
          ShowAlert(res.status, res.message);
          setPromoAdd(false);
          setPromoUpdate(false);
          setAddPromo(false);
          setPromoUpdate(false);
          setAddPromo(false);
          setAddLoader(false);
          setEditPromo(false);
          setEditLoader(false);
          setPID(0);
          fetchPromos();
        });
    },
    [fetchPromos]
  );

  const deletePromoAPI = useCallback(
    async (data) => {
      Axios()
        .get(data)
        .then((response) => {
          const res = response.data;
          if (res.status && res.status === "200") {
            ShowAlert(res.status, res.message);
            setPromoDelete(false);
            setDeletePromo(0);
            fetchPromos();
          }
        });
    },
    [fetchPromos]
  );

  useEffect(() => {
    if (promoAdd || promoUpdate) {
      console.log(allData);
      const req = `admin/add-promo`;
      addUpdatePromo(req, allData);
    }
    if (promoDelete || promoStatusUpdate) {
      const req = `admin/update-promo/${deletePromo}?status=${newStatus}`;
      deletePromoAPI(req);
    }
  }, [
    promoAdd,
    PID,
    finalPromoName,
    addUpdatePromo,
    promoUpdate,
    promoDelete,
    setPromoStatusUpdate,
    deletePromo,
    deletePromoAPI,
  ]);
  let rows = [];
  let count = 1;
  if (promos.status !== "400") {
    rows = promos.data.map((promo) => {
      let id = count;
      let row_id = promo.id;
      let promo_title = promo.promo_title;
      let promo_type = promo.promo_type;
      let promo_value =
        promo.promo_type === "percentage"
          ? promo.promo_value + "%"
          : "PKR " + promo.promo_value;
      let promo_from_date = promo.promo_from_date;
      let promo_to_date = promo.promo_to_date;
      let promo_status = promo.promo_status;
      let promo_routes = promo.promo_routes;
      let promo_airlines = promo.promo_airlines;
      let promo_description = promo.promo_description;
      let promo_original_value = promo.promo_value;
      let travel_from_date = promo.travel_from_date;
      let travel_to_date = promo.travel_to_date;

      count++;
      return {
        id,
        row_id,
        promo_title,
        promo_type,
        promo_value,
        promo_from_date,
        promo_to_date,
        promo_status,
        promo_routes,
        promo_airlines,
        promo_description,
        promo_original_value,
        travel_to_date,
        travel_from_date,
      };
    });
  }
  const handleAddShow = () => {
    setAddPromo(!addPromo);
  };
  const handleEditShow = (data) => {
    setPromoData(data);

    setEditPromo(!editPromo);
  };
  const handleViewShow = (data) => {
    setPromoData(data);

    setViewPromo(!viewPromo);
  };

  const handleDeletePromo = (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletePromo(id);
        setPromoDelete(true);
        setNewStatus("Deleted");
      }
    });
  };
  const handleStatusUpdate = (id, promo_status) => {
    setDeletePromo(id);
    setPromoStatusUpdate(true);
    setNewStatus(promo_status);
  };

  const handleData = (booking) => {
    setFlightData(booking);
  };

  const handleSearch = (event) => {
    setSFilter(event.target.value);
  };
  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  const handlePaymentShow = (data) => {
    setPaymentModalShow(!paymentModalShow);
    setPaymentConfirmation(false);
    handleData(data);
  };

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }
  function submitPromo(allData) {
    setAllData(allData);
    setPromoAdd(true);
  }

  function submitUpdatePromo(allData) {
    setAllData(allData);
    setPromoUpdate(true);
  }

  const filterFunction = () => {
    rows = rows
      .filter((row) => {
        return (
          row.promo_name.toLowerCase().includes(sFilter.toLowerCase()) && row
        );
      })
      .map((filteredData) => {
        return filteredData;
      });
  };
  function getText(event) {
    let id = event.target.id;
    if (id === "promo-name") {
      promoName = event.target.value;
      promoData.promo_name = promoName;
    }
  }

  
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title="Promos Page" />
        <div className="d-flex flex-row justify-content-end">
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
          {InnerRightsFilter("define", userData) && (
            <div className="col-3 float-right">
              <button
                className="form-control border-primary border-1 btn btn-primary"
                onClick={() => {
                  setAddPromo(true);
                }}
              >
                Add Promos
              </button>
            </div>
          )}
        </div>
        <div className={`${classes.tableWrapper} table-responsive`}>
          <Table
            ref={tableRef}
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
                      <TableCell align="left">{row.promo_title}</TableCell>
                      <TableCell align="left">{row.promo_type}</TableCell>
                      <TableCell align="left">{row.promo_value}</TableCell>
                      <TableCell align="left">{row.promo_from_date}</TableCell>
                      <TableCell align="left">{row.promo_to_date}</TableCell>
                      <TableCell align="left">
                        <span
                          onClick={() => {
                            handleStatusUpdate(
                              row.row_id,
                              row.promo_status === "Active"
                                ? "Inactive"
                                : "Active"
                            );
                          }}
                          title={` Click To ${
                            row.promo_status === "Active"
                              ? "Disable Promo"
                              : "Enable Promo"
                          } `}
                          className={` cursor-pointer badge badge-${
                            row.promo_status === "Active" ? "success" : "danger"
                          }`}
                        >
                          {row.promo_status}
                        </span>
                      </TableCell>

                      <TableCell align="left">
                        {InnerRightsFilter("promos", userData) && (
                          <>
                            <i
                              className="fa fa-eye cursor-pointer mr-2"
                              onClick={() => {
                                handleViewShow(row);
                              }}
                            />
                            <i
                              className="fas fa-edit cursor-pointer mr-2"
                              onClick={() => {
                                handleEditShow(row);
                              }}
                            />
                            {row.status !== "Deleted" && (
                              <i
                                className="fas fa-trash cursor-pointer"
                                onClick={() => {
                                  handleDeletePromo(row.row_id);
                                }}
                              />
                            )}
                          </>
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

              {viewPromo && (
                <ViewPromo
                  showModal={viewPromo}
                  handleShow={handleViewShow}
                  loader={editLoader}
                  setLoader={setEditLoader}
                  getText={getText}
                  submitPromo={submitUpdatePromo}
                  setPID={setPID}
                  data={promoData}
                />
              )}

              {addPromo && (
                <AddPromo
                  showModal={addPromo}
                  handleShow={handleAddShow}
                  loader={addLoader}
                  setLoader={setAddLoader}
                  getText={getText}
                  submitPromo={submitPromo}
                />
              )}
              {editPromo && (
                <EditPromo
                  showModal={editPromo}
                  handleShow={handleEditShow}
                  loader={editLoader}
                  setLoader={setEditLoader}
                  getText={getText}
                  submitUpdatePromo={submitUpdatePromo}
                  setPID={setPID}
                  data={promoData}
                />
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, rows.length]}
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
