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

import ViewHBooking from "./ViewHBooking";
import HPaymentModal from "./HPaymentModal";
import {
  dueDate,
  ShowAlert,
  AuthUserData,
  InnerRightsFilter,
  stableSort,
  getSorting,
  EnhancedTableHead,
  EnhancedTableToolbar,
  useStyles,
} from "../../../_helpers/HelperFunctions";

const headRows = [
  { id: "id", numeric: true, disablePadding: false, label: "Sr. #" },
  { id: "name", numeric: true, disablePadding: false, label: "Name" },
  { id: "cnr", numeric: true, disablePadding: false, label: "CNR" },
  {
    id: "checkin_date",
    numeric: true,
    disablePadding: false,
    label: "Check-In Date",
  },
  {
    id: "checkout_date",
    numeric: true,
    disablePadding: false,
    label: "Check-Out Date",
  },
  {
    id: "booking_status",
    numeric: true,
    disablePadding: false,
    label: "Booking Status",
  },
  { id: "last_date", numeric: true, disablePadding: false, label: "Last Date" },
  { id: "actions", numeric: true, disablePadding: false, label: "Action" },
];

export function HBookings({ bookings, fetchHotelBookings, setLoadings }) {
  const userData = AuthUserData();
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showViewBookingModal, setViewBookingModal] = useState(false);
  const [hotelData, setHotelData] = useState({});
  const [sFilter, setSFilter] = useState("");
  const [paymentModalShow, setPaymentModalShow] = useState(false);
  const [paymentConfirmation, setPaymentConfirmation] = useState(false);
  const [paymentLoader, setPaymentLoader] = useState(false);

  let rows = [];
  let count = 1;

  if (bookings.status !== "400") {
    rows = bookings.data.map((hBooking) => {
      let id = count;
      let name = hBooking.title + ". " + hBooking.fName + " " + hBooking.lName;
      let cnr = hBooking.cnr;
      let checkin_date = hBooking.checkin.replaceAll("-", " ");
      let checkout_date = hBooking.checkout.replaceAll("-", " ");
      let booking_status = hBooking.booking_status;
      let last_date = dueDate(new Date(hBooking.cnr_creation_date));
      let action = hBooking;
      let payment = hBooking.payment_status;

      count++;
      return {
        id,
        name,
        cnr,
        checkin_date,
        checkout_date,
        booking_status,
        last_date,
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
    setHotelData(booking);
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

  const confirmHotelBookingAPI = useCallback(
    async (data) => {
      Axios({})
        .get(data)
        .then((response) => {
          const res = response.data;
          setPaymentLoader(false);
          setPaymentModalShow(false);
          setPaymentConfirmation(false);
          handleData({});
          ShowAlert(res.status, res.message);
          setLoadings(true);
          fetchHotelBookings();
        });
    },
    [fetchHotelBookings, setLoadings]
  );

  useEffect(() => {
    if (paymentLoader) {
      const req = `admin/confirm-hotel-booking?pnr=${hotelData.cnr}`;
      confirmHotelBookingAPI(req);
    }
  }, [paymentLoader, hotelData, confirmHotelBookingAPI]);

  const handleFilter = (event) => {
    setSFilter(event.target.value);
  };

  const filterFunction = () => {
    rows = rows
      .filter((row) => {
        return row.name.toLowerCase().includes(sFilter.toLowerCase()) ||
          row.cnr.toLowerCase().includes(sFilter.toLowerCase()) ||
          row.booking_status.toLowerCase().includes(sFilter.toLowerCase())
          ? row
          : "";
      })
      .map((filteredData) => {
        return filteredData;
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

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title="Hotel Bookings" />
        <div className={classes.tableWrapper}>
          <div className="d-flex flex-row justify-content-end">
            <div className="col-3 float-right">
              <input
                type="search"
                className="form-control border-primary border-1"
                id="sBox"
                name="sBox"
                onChange={(e) => handleFilter(e)}
                placeholder="Search"
              />
            </div>
          </div>
        </div>
        {sFilter !== "" && filterFunction()}
        <div className="table-responsive">
          <Table aria-labelledby="tableTitle">
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
                      <TableCell align="left">{row.cnr}</TableCell>
                      <TableCell align="left">{row.checkin_date}</TableCell>
                      <TableCell align="left">{row.checkout_date}</TableCell>
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
                      <TableCell align="left">
                        <i
                          className="fas fa-eye cursor-pointer mr-2"
                          title="View Booking"
                          onClick={() => handleShow(row.action)}
                        />
                        {row.booking_status === "Incompleted" &&
                          row.payment === "Pending" &&
                          InnerRightsFilter(
                            "hotel-booking-confirmation",
                            userData
                          ) && (
                            <i
                              className="far fa-credit-card cursor-pointer"
                              title="Confirm Payment & Booking"
                              onClick={() => handlePaymentShow(row.action)}
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
              {showViewBookingModal && (
                <ViewHBooking
                  showModal={showViewBookingModal}
                  handleShow={handleShow}
                  booking={hotelData}
                />
              )}
              {paymentModalShow && (
                <HPaymentModal
                  showModal={paymentModalShow}
                  handleShow={handlePaymentShow}
                  booking={hotelData}
                  payment={paymentConfirmation}
                  setPayment={setPaymentConfirmation}
                  loader={paymentLoader}
                  setLoader={setPaymentLoader}
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
