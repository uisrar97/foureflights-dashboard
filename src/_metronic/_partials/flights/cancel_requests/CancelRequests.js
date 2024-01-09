import React, { useState, useEffect, useCallback } from "react";
import Axios from "../../../../app/service";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Paper,
} from "@material-ui/core";

import SweetAlert from "sweetalert2";
import {
  date_convert,
  date_convert_with_time,
  ShowAlert,
  AuthFunction,
  AuthUserData,
  InnerRightsFilter,
  stableSort,
  getSorting,
  EnhancedTableHead,
  EnhancedTableToolbar,
  useStyles,
} from "../../../_helpers/HelperFunctions";
import ViewBooking from "../ViewBooking";
const headRows = [
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "Sr. #",
    align: "left",
  },
  { id: "pnr", numeric: true, disablePadding: false, label: "PNR" },
  {
    id: "ticket_rservation_code",
    numeric: true,
    disablePadding: false,
    label: "Ticket Reservation code",
    align: "left",
  },
  {
    id: "provider",
    numeric: true,
    disablePadding: false,
    label: "Provider",
    align: "left",
  },
  {
    id: "request_status",
    numeric: true,
    disablePadding: false,
    label: "Request Status",
    align: "left",
  },
  {
    id: "created_at",
    numeric: true,
    disablePadding: false,
    label: "Requested at",
    align: "left",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: true,
    label: "Action",
    align: "center",
  },
];

export function CancelRequests({ requests, fetchrequests, bookings }) {
  const options = AuthFunction();
  const userData = AuthUserData();
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sFilter, setSFilter] = useState("");
  const [showIframe, setShowIframe] = useState(false);
  const [cancelFlight, setCancelFlight] = useState(false);
  const [cancelReq, setCancelReq] = useState({});
  const [showViewBookingModal, setViewBookingModal] = useState(false);
  const [flightData, setFlightData] = useState({});
  const [show, setShow] = useState(false);

  const cancelAPI = useCallback(async () => {
    Axios(options)
      .get(
        "api/cancel-booking?reservation_code=" +
          cancelReq.ticket_reservation_code +
          "&provider_type=" +
          cancelReq.provider_type +
          "&pnr=" +
          cancelReq.pnr
      )
      .then((response) => {
        const res = response.data;
        ShowAlert(res.status, res.message);
        if (res.status && res.status === "200") {
          fetchrequests();
        }
      });
  }, [cancelReq, fetchrequests, options]);

  useEffect(() => {
    if (cancelFlight) {
      cancelAPI();
      setCancelFlight(false);
      setCancelReq({});
    }
  }, [cancelFlight, cancelAPI]);

  let rows = [];
  let count = 1;
  if (requests.data.length > 0) {
    rows = requests.data.map((request) => {
      let id = count;
      let pnr = request.pnr;
      let ticket_reservation_code = request.ticket_reservation_code;
      let provider_type = request.provider_type;
      let request_status = request.status;
      let created_at = request.created_at;
      if (provider_type !== "hotel") {
        count++;
        return {
          id,
          pnr,
          ticket_reservation_code,
          provider_type,
          request_status,
          created_at,
        };
      } else {
        return "";
      }
    });
  }
  rows = rows.filter(Boolean);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  const cancelAlert = (data, link) => {
    setCancelReq(data);
    SweetAlert.fire({
      title: "Are you sure you want to cancel?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        if (
          data.provider_type === "airblue" ||
          data.provider_type === "airsial"
        ) {
          window.open(link, "_blank");
        }
        setCancelFlight(true);
      } else if (result.isDenied) {
        setCancelFlight(false);
      }
    });
  };

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handlePNRChange = (event) => {
    setSFilter(event.target.value);
  };

  const filterFunction = () => {
    rows = rows
      .filter((row) => {
        return row.pnr.toLowerCase().includes(sFilter.toLowerCase()) ||
          row.provider_type.toLowerCase().includes(sFilter.toLowerCase())
          ? row
          : "";
      })
      .map((filteredData) => {
        return filteredData;
      });
  };

  const cancelBtn = (data) => {
    if (data.provider_type === "travelport" || data.provider_type === "hitit") {
      if (data.request_status === "Pending") {
        return (
          <i
            className="fas fa-plane-slash cancel-icon cursor-pointer"
            title="Cancel Booking"
            onClick={() => cancelAlert(data, "")}
          />
        );
      } else {
        return "-";
      }
    } else if (data.provider_type === "airblue") {
      if (data.request_status === "Pending") {
        return (
          <i
            className="fas fa-plane-slash cancel-icon cursor-pointer"
            title="Cancel Booking"
            onClick={() => cancelAlert(data, "https://www.airblue.com/agents/")}
          />
        );
      } else {
        return "-";
      }
    } else if (data.provider_type === "airsial") {
      if (data.request_status === "Pending") {
        return (
          <i
            className="fas fa-plane-slash cancel-icon cursor-pointer"
            title="Cancel Booking"
            onClick={() => cancelAlert(data, "http://202.63.219.66/eticket/")}
          />
        );
      } else {
        return "-";
      }
    }
  };
  const handleShow = (data) => {
    if (bookings.status !== "400") {
      let res = bookings?.data.find((booking) => booking.pnr === data.pnr);
      console.log(data.pnr);
      console.log(bookings?.data.find((booking) => booking.pnr));

      if (!res && res?.booking_detail?.length) {
        let flight = res;
        let id = count;
        let name =
          flight.booking_detail[0].title +
          ". " +
          flight.booking_detail[0].f_name +
          " " +
          flight.booking_detail[0].l_name;
        let depart_date = "";
        let depart_status = "Pending";
        let last_date = "-";
        let booking_status = flight.booking_status;
        if (flight.api_type === "travelport" || flight.api_type === "hitit") {
          depart_date = flight.booking_response.segments[0].DepartureTime;
          if (
            flight.api_type === "travelport" &&
            booking_status === "Incompleted" &&
            flight.booking_response.pricing.length > 0
          ) {
            last_date = date_convert_with_time(
              flight.booking_response.pricing[0].TrueLastDateToTicket
            );
          } else if (
            flight.api_type === "hitit" &&
            booking_status === "Incompleted"
          ) {
            last_date = date_convert_with_time(
              flight.booking_response.ticket_time_limt
            );
          }
        } else if (flight.api_type === "airblue") {
          depart_date = flight.booking_response.segments[0].DepartureDateTime;
          if (booking_status === "Incompleted") {
            last_date = date_convert_with_time(
              flight.booking_response.ticketing[0].TicketTimeLimit
            );
          }
        } else if (flight.api_type === "airsial") {
          depart_date = new Date(
            flight.booking_response.segments.outbound[0].DEPARTURE_DATE
          );
          if (booking_status === "Incompleted") {
            // let validDate = flight.booking_response.validTill.split(" ");
            // validDate = validDate[0].split("-");
            // validDate = validDate[2] + "-" + validDate[1] + "-" + validDate[0];
            last_date = date_convert_with_time(
              flight.booking_response.validTill
            );
          }
        }
        if (new Date() >= new Date(depart_date)) {
          depart_status = "Departed";
        }
        depart_date = date_convert(depart_date);
        let pnr = flight.pnr;
        let created_at = flight.created_at;
        res = flight;
      }
      setViewBookingModal(!showViewBookingModal);
      handleData(res);
    }
  };

  const handleData = (booking) => {
    setFlightData(booking);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title="Flight Cancel Requests" />
        <div className={classes.tableWrapper}>
          <div className="d-flex flex-row justify-content-end">
            <div className="col-3 float-right">
              <input
                type="search"
                className="form-control border-primary border-1"
                id="sBox"
                name="sBox"
                onChange={(e) => handlePNRChange(e)}
                placeholder="Search"
              />
            </div>
          </div>
        </div>
        {sFilter !== "" && filterFunction()}
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
                      <TableCell align="left">{row.pnr}</TableCell>
                      <TableCell align="left">
                        {row.ticket_reservation_code}
                      </TableCell>
                      <TableCell align="left">
                        {row.provider_type.charAt(0).toUpperCase() +
                          row.provider_type.slice(1)}
                      </TableCell>
                      <TableCell align="left">
                        <span
                          className={
                            row.request_status === "Pending"
                              ? "badge badge-warning"
                              : row.request_status === "Cancelled"
                              ? "badge badge-success"
                              : "badge badge-danger"
                          }
                        >
                          {row.request_status}
                        </span>
                      </TableCell>
                      <TableCell align="left">
                        {date_convert(row.created_at)}
                      </TableCell>
                      <TableCell align="left">
                        {InnerRightsFilter("flight-cancellation", userData) &&
                          cancelBtn(row)}
                      </TableCell>
                      <TableCell align="left" className="px-2">
                        <i
                          className="fas fa-eye cursor-pointer mr-2"
                          title="View Booking"
                          onClick={() => handleShow(row)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
              {showViewBookingModal && (
                <ViewBooking
                  showModal={showViewBookingModal}
                  handleShow={handleShow}
                  booking={flightData}
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
