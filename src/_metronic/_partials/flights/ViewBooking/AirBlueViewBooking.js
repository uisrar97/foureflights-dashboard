import React from "react";
import {
  diff_minutes,
  date_convert,
  utc_convert,
} from "../../../_helpers/HelperFunctions";

export default function AirBlueViewBooking({ booking }) {
  const flightSegments = booking.booking_response.segments;
  const passengers = booking.booking_detail;

  const tickets =
    booking.booking_response.ticketing &&
    booking.booking_response.ticketing.length ===
      booking.booking_response.passenger_detail.length &&
    booking.booking_response.ticketing[0].TicketDocumentNbr &&
    booking.booking_response.ticketing[0].TicketDocumentNbr !== null
      ? booking.booking_response.ticketing
      : null;

  passengers.map((pax, index) => {
    return (pax.cnic = booking.booking_response.passenger_detail[index].cnic
      ? booking.booking_response.passenger_detail[index].cnic
      : null);
  });

  const firstSegment = flightSegments[0];
  const lastSegment = flightSegments[0];

  const round = flightSegments.length > 1 ? true : false;
  let totalFlightTime = diff_minutes(
    firstSegment.DepartureDateTime,
    firstSegment.ArrivalDateTime
  );

  return (
    <div>
      <div className="statuses text-center">
        <h4 className="text-center">Booking Statuses</h4>
        <hr className="text-center" />
        <div className="d-flex flex-row">
          <div className="col-6">
            <p className="text-capitalize">
              <span className="font-weight-bold">Booking Status: </span>
              <span
                className={
                  booking.booking_status === "Completed"
                    ? "badge badge-success"
                    : booking.booking_status === "Incompleted"
                    ? "badge badge-warning"
                    : "badge badge-danger"
                }
              >
                {booking.booking_status}
              </span>
            </p>
          </div>
          <div className="col-6">
            <p className="text-capitalize">
              <span className="font-weight-bold">Payment Status: </span>
              <span
                className={
                  booking.payment_status === "Completed"
                    ? "badge badge-success"
                    : "badge badge-warning"
                }
              >
                {booking.payment_status}
              </span>
            </p>
          </div>
        </div>
        <hr className="text-center" />
      </div>
      <div className="passenger-info text-center rounded">
        <h4 className="text-center">Passenger Information</h4>
        <div className="d-flex flex-row">
          <div className="col-4 text-left">
            <p className="">
              <span className="font-weight-bold">Email: </span>
              {booking.email}
            </p>
          </div>
          <div className="col-4 text-left">
            <p className="text-capitalize">
              <span className="font-weight-bold">Phone Number: </span>
              {booking.phone_number}
            </p>
          </div>
          <div className="col-4 text-left">
            <p className="text-capitalize">
              <span className="font-weight-bold">Foure Reference (PNR): </span>
              {booking.pnr}
            </p>
          </div>
        </div>
        <div className="pax-info d-flex flex-column">
          {passengers.map((pax, index) => {
            return (
              <div
                className="d-flex flex-column border border-dark mt-4"
                key={pax.id}
              >
                <div className="d-flex flex-row">
                  <div className="col-4 d-flex flex-column text-left border-right border-right-dark">
                    <p className="text-capitalize">
                      <span className="font-weight-bold">Passenger Name: </span>
                      {pax.title + ". " + pax.f_name + " " + pax.l_name}
                    </p>
                    <p className="text-capitalize">
                      <span className="font-weight-bold">Nationality: </span>
                      {pax.nationality}
                    </p>
                    {pax.passport_number !== null &&
                      pax.passport_number !== "" &&
                      tickets !== null &&
                      tickets.length > 0 && (
                        <p className="text-capitalize">
                          <span className="font-weight-bold">
                            E-Ticket Number:{" "}
                          </span>
                          {tickets[index].TicketDocumentNbr}
                        </p>
                      )}
                  </div>
                  <div className="col-4 d-flex flex-column text-left border-right border-right-dark">
                    <p className="text-capitalize">
                      <span className="font-weight-bold">Date of Birth: </span>
                      {date_convert(pax.dob)}
                    </p>
                    {pax.passport_number !== null &&
                      pax.passport_number !== "" && (
                        <p className="text-capitalize">
                          <span className="font-weight-bold">
                            Passport Number:{" "}
                          </span>
                          {pax.passport_number}
                        </p>
                      )}
                    {pax.cnic !== null &&
                      pax.cnic !== "" &&
                      pax.cnic !== "_____-_______-_" && (
                        <p className="text-capitalize">
                          <span className="font-weight-bold">CNIC: </span>
                          {pax.cnic}
                        </p>
                      )}
                    {pax.cnic === null &&
                      (pax.passport_number === null ||
                        pax.passport_number === "") &&
                      tickets !== null && (
                        <p className="text-capitalize">
                          <span className="font-weight-bold">
                            E-Ticket Number:{" "}
                          </span>
                          {tickets[index].ticket_number}
                        </p>
                      )}
                  </div>
                  <div className="col-4 d-flex flex-column text-left">
                    <p className="text-capitalize">
                      <span className="font-weight-bold">Passenger Type: </span>
                      {pax.passenger_type}
                    </p>
                    {pax.cnic === null &&
                      pax.passport_number !== null &&
                      pax.passport_number !== undefined && (
                        <p className="text-capitalize">
                          <span className="font-weight-bold">
                            Passport Expiry:{" "}
                          </span>
                          {pax.passport_expiry_date}
                        </p>
                      )}
                    {pax.cnic !== null &&
                      pax.cnic !== "" &&
                      pax.cnic !== "_____-_______-_" &&
                      pax.passport_number === null &&
                      tickets !== null && (
                        <p className="text-capitalize">
                          <span className="font-weight-bold">
                            E-Ticket Number:{" "}
                          </span>
                          {tickets[index].ticket_number}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pax-info d-flex flex-column mt-4">
        <h4 className="text-center">Flight Details</h4>
        <div className="d-flex flex-column m-3">
          <div className="d-flex flex-row">
            <div className="col-3 text-wrap">
              <div className="text-capitalize text-left font-weight-bold">
                <div className="row">{firstSegment.origin_city_name}</div>
                <div className="row">To</div>
                <div className="row">{lastSegment.Destination_city_name}</div>
              </div>
            </div>
            <div className="col-2" />
            <div className="col-2">
              <div className="text-capitalize text-left">
                <div className="row font-weight-bold h4">Departure</div>
                <div className="row">
                  <p className="font-weight-bold h5">
                    {utc_convert(firstSegment.DepartureDateTime)}
                  </p>
                </div>
                <div className="row">
                  {date_convert(firstSegment.DepartureDateTime)}
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="text-capitalize">
                <div className="">
                  <span className="font-weight-bold">Stops: &nbsp;</span>
                  <span>{round ? "2 Stops" : "Direct Flight"}</span>
                </div>
              </div>
              <div className="text-capitalize">
                <div className="">
                  <span className="font-weight-bold">Flight Time: &nbsp;</span>
                  <span>{totalFlightTime}</span>
                </div>
              </div>
              {round && (
                <div className="text-capitalize">
                  <div className="font-weight-bold">Round Trip</div>
                </div>
              )}
            </div>
            <div className="col-2">
              <div className="text-capitalize text-left">
                <div className="row font-weight-bold h4">Arrival</div>
                <div className="row">
                  <p className="font-weight-bold h5">
                    {utc_convert(lastSegment.ArrivalDateTime)}
                  </p>
                </div>
                <div className="row">
                  {date_convert(lastSegment.ArrivalDateTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column">
          {flightSegments.map((segment, index) => {
            let originCity = segment.origin_city_name.split(",");
            let destinationCity = segment.Destination_city_name.split(",");
            return (
              <div
                className="flight-info border border-primary mb-3 p-5"
                key={index}
              >
                <div className="flight-inner-row">
                  <p>
                    <span>{date_convert(segment.DepartureDateTime)} </span>
                    <span>
                      - {originCity[0]}{" "}
                      <span style={{ color: "#FF9800" }}>To</span>{" "}
                      {destinationCity[0]}
                    </span>
                  </p>
                </div>
                <div className="flight-inner-row row align-items-center mt-2">
                  <div className="airline d-flex flex-row col-4">
                    <img src={segment.airline_logo} alt="Carrier Logo" />
                    <div className="p-2 align-self-center">
                      {segment.airline_name.charAt(0).toUpperCase() +
                        segment.airline_name.slice(1) +
                        " (" +
                        segment.Carrier +
                        ") " +
                        segment.FlightNumber}
                    </div>
                  </div>
                  <div className="plane col-2 text-center">
                    <i className="fas fa-plane" />
                  </div>
                  <div className="depart col-3">
                    <h4>Departure</h4>
                    <div>
                      <h5>{utc_convert(segment.DepartureDateTime)}</h5>
                    </div>
                    <h5>{date_convert(segment.DepartureDateTime)}</h5>
                  </div>
                  <div className="arrival col-3">
                    <h4>Arrival</h4>
                    <div>
                      <h5>{utc_convert(segment.ArrivalDateTime)}</h5>
                    </div>
                    <h5>{date_convert(segment.ArrivalDateTime)}</h5>
                  </div>
                </div>
                {/* <div className="flight-inner-row flights mt-3">
                                        <h4 className="service">Class of Service: <span className="font-weight-normal">{booking.booking_response.cabinClass[0].cabin}</span></h4>
                                    </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
