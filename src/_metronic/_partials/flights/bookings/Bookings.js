import React, { useState, useEffect, useCallback, useRef } from "react";
import Axios from "../../../../app/service";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Paper,
} from "@material-ui/core";

import ViewBooking from "../ViewBooking";
import PaymentModal from "./PaymentModal";
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
import { useSelector, shallowEqual } from "react-redux";

const headRows = [
  { id: "id", numeric: true, disablePadding: false, label: "Sr. #" },
  { id: "name", numeric: true, disablePadding: false, label: "Name" },
  { id: "pnr", numeric: true, disablePadding: false, label: "PNR" },
  {
    id: "api_type",
    numeric: true,
    disablePadding: false,
    label: "Provider Type",
  },
  {
    id: "airline_name",
    numeric: true,
    disablePadding: false,
    label: "AirLine Name",
  },
  // {
  //   id: "depart_date",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Depart Date",
  // },

  {
    id: "booking_status",
    numeric: true,
    disablePadding: false,
    label: "Booking Status",
  },
  { id: "last_date", numeric: true, disablePadding: false, label: "Last Date" },
  {
    id: "created_at",
    numeric: true,
    disablePadding: false,
    label: "Booked at",
  },
  {
    id: "total_amount",
    numeric: true,
    disablePadding: false,
    label: "Total Amount",
  },
  // {
  //   id: "cancelReq",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Cancel",
  // },
  {
    id: "ticketed_by",
    numeric: true,
    disablePadding: false,
    label: "Ticketed By",
  },
  { id: "actions", numeric: true, disablePadding: false, label: "Action" },
];

export function Bookings({ bookings, fetchBookings, fetchrequests }) {
  const options = AuthFunction();
  const userData = AuthUserData();
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  // const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showViewBookingModal, setViewBookingModal] = useState(false);
  const [flightData, setFlightData] = useState({});
  const [sFilter, setSFilter] = useState("");
  const [paymentModalShow, setPaymentModalShow] = useState(false);
  const [paymentConfirmation, setPaymentConfirmation] = useState(false);
  const [ticketLoader, setTicketLoader] = useState(false);
  const [sDepartStatus, setSDepartStatus] = useState("");
  const [selectedBookingStatus, setSelectedBookingStatus] = useState(""); //default value
  const tableRef = useRef(null);
  const [sFilterDate, setSFilterDate] = useState({});
  const [providerType, setProvideType] = useState("");
  const [cancelReq, setCancelReq] = useState({});
  const [cancelFlight, setCancelFlight] = useState(false);

  const cancelAPI = useCallback(async () => {
    Axios(options)
      .get(
        "api/cancel-booking?reservation_code=" +
          cancelReq.action.booking_response.used_for_ticket_reservation_code +
          "&provider_type=" +
          cancelReq.action.booking_response.provider_type +
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
  if (bookings.status !== "400") {
    rows = bookings.data.map((flight) => {
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
          last_date = date_convert_with_time(flight.booking_response.validTill);
        }
      }
      if (new Date() >= new Date(depart_date)) {
        depart_status = "Departed";
      }
      depart_date = date_convert(depart_date);
      let pnr = flight.pnr;
      let created_at = flight.created_at;
      let action = flight;
      let payment = flight.payment_status;

      count++;
      return {
        id,
        name,
        depart_date,
        depart_status,
        pnr,
        booking_status,
        last_date,
        created_at,
        action,
        payment,
      };
    });
  }

  const handleShow = (data) => {
    setViewBookingModal(!showViewBookingModal);
    handleData(data);
  };

  const handleData = (booking) => {
    setFlightData(booking);
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

  const issueTicketAPI = useCallback(
    async (req) => {
      console.log("calling this fun");
      Axios(options)
        .get(req)
        .then((response) => {
          const res = response.data;
          setTicketLoader(false);
          setPaymentModalShow(false);
          setPaymentConfirmation(false);
          handleData({});
          ShowAlert(res.status, res.message);
          fetchBookings();
        });
    },
    [fetchBookings, options]
  );

  const issueTravelportTicketAPI = useCallback(
    async (TravelportTicketAPI, TicketData) => {
      Axios(options)
        .post(TravelportTicketAPI, TicketData)
        .then((response) => {
          const res = response.data;
          setTicketLoader(false);
          setPaymentModalShow(false);
          setPaymentConfirmation(false);
          handleData({});
          ShowAlert(res.status, res.message);
          fetchBookings();
        });
    },
    [fetchBookings, options]
  );

  useEffect(() => {
    if (ticketLoader) {
      let TicketData = {};
      if (flightData.api_type === "travelport") {
        const TravelportTicketAPI = "api/issue-ticket";
        TicketData = {
          pnr: flightData.booking_response.galilo_pnr,
          locator_code:
            flightData.booking_response.used_for_ticket_reservation_code,
          pricing_info: flightData.booking_response.pricing,
          payment: "true",
          user_id: userData.userId,
        };
        issueTravelportTicketAPI(TravelportTicketAPI, TicketData);
      } else if (flightData.api_type === "hitit") {
        TicketData = {
          pnr: flightData.booking_response.pnr,
          reservation_code:
            flightData.booking_response.used_for_ticket_reservation_code,
          price: flightData.booking_response.pricing_info.total_amount,
          user_id: userData.userId,
        };
        const req =
          "api/issue-ticket-hitit?pnr=" +
          TicketData.pnr +
          "&reference_id=" +
          TicketData.reservation_code +
          "&price=" +
          TicketData.price +
          "&payment=true&user_id=" +
          userData.userId;
        issueTicketAPI(req);
      } else if (flightData.api_type === "airblue") {
        TicketData = {
          pnr: flightData.booking_response.BookingReferenceID.ID,
          instance: flightData.booking_response.BookingReferenceID.Instance,
          price: flightData.booking_response.pricing_info.TotalFare.Amount,
          user_id: userData.userId,
        };
        const req =
          "api/issue-ticket-airblue?pnr=" +
          TicketData.pnr +
          "&instance=" +
          TicketData.instance +
          "&total_amount=" +
          TicketData.price +
          "&payment=true&user_id=" +
          userData.userId;
        issueTicketAPI(req);
      } else if (flightData.api_type === "airsial") {
        const req =
          "api/issue-ticket-airsial?pnr=" +
          flightData.booking_response.pnr +
          "&payment=true&user_id=" +
          userData.userId;
        issueTicketAPI(req);
      }
    }
  }, [ticketLoader, flightData, issueTicketAPI, issueTravelportTicketAPI]);

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
  const handleProviderType = (event) => {
    setProvideType(event.target.value);
  };
  const handlebookingStatus = (event) => {
    setSelectedBookingStatus(event.target.value);
  };
  const handleDepartStatus = (event) => {
    setSDepartStatus(event.target.value);
  };
  const filterFunction = () => {
    rows = rows
      .filter((row) => {
        let airlineName = "not found";
        if (row.action.api_type === "airsial") {
          airlineName = "airsial";
        } else {
          if (row.action.booking_response.segments[0].airline_name !== null) {
            airlineName = row.action.booking_response.segments[0].airline_name;
          } else {
            airlineName = "not found";
          }
        }
        return row.name.toLowerCase().includes(sFilter.toLowerCase()) ||
          row.pnr.toLowerCase().includes(sFilter.toLowerCase()) ||
          airlineName.toLowerCase().includes(sFilter.toLowerCase()) ||
          row.booking_status.toLowerCase().includes(sFilter.toLowerCase())
          ? row
          : "";
      })
      .map((filteredData) => {
        return filteredData;
      });
  };

  const filterProviderType = () => {
    rows = rows
      .filter((row) => {
        if (
          row.action.api_type.toLocaleLowerCase() ==
          providerType.toLocaleLowerCase()
        ) {
          return row;
        }
      })
      .map((filteredData) => {
        return filteredData;
      });
  };
  const filterBookingStatus = () => {
    rows = rows
      .filter((row) => {
        if (selectedBookingStatus) {
          if (
            row.booking_status.toLocaleLowerCase() ===
            selectedBookingStatus.toLocaleLowerCase()
          ) {
            return row;
          }
        }
      })
      .map((filteredData) => {
        return filteredData;
      });
  };
  const filterDepartStatus = () => {
    rows = rows
      .filter((row) => {
        if (sDepartStatus) {
          if (row.depart_status.toLowerCase() === sDepartStatus.toLowerCase()) {
            return row;
          }
        }
      })
      .map((filteredData) => {
        return filteredData;
      });
  };

  const enddatefilter = () => {
    let dateValue = sFilterDate;
    if (dateValue !== undefined && dateValue !== null && dateValue.length > 0) {
      const startDate = new Date(dateValue[0]).getTime();
      const endDate = new Date(dateValue[1]).getTime();

      rows = rows
        .filter((row) => {
          let rowDate = new Date(row.created_at).getTime();

          if (rowDate >= startDate && rowDate <= endDate) {
            return row;
          }
        })
        .map((filteredData) => {
          return filteredData;
        });
    }
  };

  const downloadExcel = () => {
    let newRow = [];
    let newRows = [{}];
    rows.map((row, index) => {
      let airlineName = "";
      if (row.action.api_type === "airsial") {
        airlineName = "airsial";
      } else {
        if (row.action.booking_response.segments[0].airline_name !== null) {
          airlineName = row.action.booking_response.segments[0].airline_name;
        } else {
          airlineName = "not found";
        }
      }
      newRow = {
        id: row.id,
        name: row.name,
        pnr: row.pnr,
        provider_type: row.action.api_type,
        airlineName: airlineName,
        depart_date: row.depart_date,
        depart_status: row.depart_status,
        booking_status: row.booking_status,
        last_date: row.last_date,
        created_at: row.created_at,
        total_amount: row.action.total_amount_with_commission,
      };
      newRows.push(newRow);
    });

    const worksheet = XLSX.utils.json_to_sheet(newRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

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
  const cancelBtn = (data) => {
    if (
      data.action.api_type === "travelport" ||
      data.action.api_type === "hitit"
    ) {
      if (
        data.booking_status === "Incompleted" &&
        data.depart_status !== "Departed"
      ) {
        return (
          <i
            className="fas fa-plane-slash cancel-icon cursor-pointer mr-2"
            title="Cancel Booking"
            onClick={() => cancelAlert(data, "")}
          />
        );
      } else {
        return "";
      }
    } else if (data.action.api_type === "airblue") {
      if (
        data.booking_status === "Incompleted" &&
        data.depart_status !== "Departed"
      ) {
        return (
          <i
            className="fas fa-plane-slash cancel-icon cursor-pointer mr-2"
            title="Cancel Booking"
            onClick={() => cancelAlert(data, "https://www.airblue.com/agents/")}
          />
        );
      } else {
        return "";
      }
    } else if (data.action.api_type === "airsial") {
      if (
        data.booking_status === "Incompleted" &&
        data.depart_status !== "Departed"
      ) {
        return (
          <i
            className="fas fa-plane-slash cancel-icon cursor-pointer mr-2"
            title="Cancel Booking"
            onClick={() => cancelAlert(data, "http://202.63.219.66/eticket/")}
          />
        );
      } else {
        return "";
      }
    }
  };

  const { user } = useSelector((state) => state.auth, shallowEqual);

  const userFiltered = (row, index) => {
    let airlineName = "";
    if (row.action.api_type === "airsial") {
      airlineName = "airsial";
    } else {
      if (row.action.booking_response.segments[0].airline_name !== null) {
        airlineName = row.action.booking_response.segments[0].airline_name;
      } else {
        airlineName = "not found";
      }
    }

    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <TableRow hover tabIndex={-1} key={row.id}>
        <TableCell component="th" id={labelId} scope="row">
          {row.id}
        </TableCell>
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">{row.pnr}</TableCell>
        <TableCell align="left">{row.action.api_type}</TableCell>
        <TableCell align="left">{airlineName}</TableCell>
        {/* <TableCell align="left">{row.depart_date}</TableCell> */}

        <TableCell align="left">
          <span
            className={
              row.booking_status === "Completed"
                ? "badge badge-success"
                : row.booking_status === "Incompleted"
                ? "badge badge-warning"
                : "badge badge-danger"
            }
          >
            {row.booking_status}
          </span>
        </TableCell>
        <TableCell align="left">{row.last_date}</TableCell>
        <TableCell align="left">{date_convert(row.created_at)}</TableCell>
        <TableCell align="left">
          {row.action.total_amount_with_commission}
        </TableCell>
        {/* <TableCell align="left">
                        {InnerRightsFilter("flight-cancellation", userData) &&
                          cancelBtn(row)}
                      </TableCell> */}
        <TableCell align="left">
          {row.action.user_data !== undefined && row.action.user_data !== null
            ? row.action.user_data.first_name +
              " " +
              row.action.user_data.last_name
            : ""}
        </TableCell>
        <TableCell align="left" className="px-2">
          {InnerRightsFilter("flight-cancellation", userData) && cancelBtn(row)}
          <i
            className="fas fa-eye cursor-pointer mr-2"
            title="View Booking"
            onClick={() => handleShow(row.action)}
          />
          {row.booking_status === "Incompleted" &&
            row.payment === "Pending" &&
            InnerRightsFilter("flight-confirmation", userData) && (
              <i
                className="far fa-credit-card cursor-pointer"
                title="Confirm Payment & Issue Ticket"
                onClick={() => handlePaymentShow(row.action)}
              />
            )}
        </TableCell>
      </TableRow>
    );
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title="Flight Bookings" />
        <div className={classes.tableWrapper}>
          <div className="d-flex  justify-content-end mr-8 py-2 mb-3 ">
            <button onClick={downloadExcel} className="btn btn-success">
              {" "}
              Download Excel{" "}
            </button>
          </div>
          <div className="col-md-12">
            <div className=" row mr-3 ">
              <div className="col-md-3">
                <label className="pl-1"> Booking Date</label>
                <span className="">
                  <DateRangePicker
                    appearance="default"
                    placeholder="Search by Dates"
                    style={{ width: "100%", paddingTop: "3px" }}
                    onChange={(dateValue) => {
                      // enddatefilter(dateValue);
                      setSFilterDate(dateValue);
                    }}
                  />
                </span>
              </div>
              <div className="col-md-3">
                <label className="pl-3"> Search</label>
                <input
                  type="search"
                  className="form-control border-primary border-1 ml-3"
                  id="sBox"
                  name="sBox"
                  onChange={(e) => handlePNRChange(e)}
                  placeholder="Search"
                />
              </div>
              {/* depart satus filter goes here */}
              <div className="col-md-2">
                <label className="pl-3">Depart Status</label>
                <select
                  className="form-control border-primary border-1 ml-3 "
                  value={sDepartStatus}
                  onChange={handleDepartStatus}
                >
                  <option value="" defaultValue={""}>
                    All
                  </option>
                  <option value="Departed">Departed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              {/* depart status filter end here */}
              <div className="col-md-2">
                <label className="pl-3">Booking Status </label>
                <select
                  className="form-control border-primary border-1 ml-3 mr-3"
                  value={selectedBookingStatus}
                  onChange={handlebookingStatus}
                >
                  <option value="" defaultValue={""}>
                    All
                  </option>
                  <option value="Completed">Completed</option>
                  <option value="Incompleted">Incompleted</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="pl-3">Provider Type</label>
                <select
                  className="form-control border-primary border-1 ml-3 mr-3"
                  value={providerType}
                  onChange={handleProviderType}
                >
                  <option value="" defaultValue={""}>
                    All
                  </option>
                  <option value="travelport">TravelPort</option>
                  <option value="hitit">Hitit</option>
                  <option value="airblue">AirBlue</option>
                  <option value="airsial">AirSial</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {sFilter !== "" && filterFunction()}
        {sFilterDate !== "" && enddatefilter()}
        {providerType !== "" && filterProviderType()}
        {sDepartStatus !== "" && filterDepartStatus()}
        {selectedBookingStatus !== "" && filterBookingStatus()}
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
                  if (user.role_code === "super-admin") {
                    return userFiltered(row, index);
                  } else {
                    if (user.userId == row.action.user_id) {
                      return userFiltered(row, index);
                    }
                  }
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
              {paymentModalShow && (
                <PaymentModal
                  showModal={paymentModalShow}
                  handleShow={handlePaymentShow}
                  booking={flightData}
                  payment={paymentConfirmation}
                  setPayment={setPaymentConfirmation}
                  loader={ticketLoader}
                  setLoader={setTicketLoader}
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
