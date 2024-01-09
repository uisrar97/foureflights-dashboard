import React from "react";
import { Button, Modal } from "react-bootstrap";
import { date_convert } from "../../../_helpers/HelperFunctions";
export default function ViewHBooking({ showModal, handleShow, booking }) {
  return (
    <Modal
      show={showModal}
      onHide={handleShow}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>Booking Details</Modal.Title>
        <Button variant="normal" onClick={handleShow}>
          <i className="fas fa-times p-0" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="statuses text-center">
            <h2 className="text-center">Booking Statuses</h2>
            <div className="d-flex flex-row mt-4">
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
            <h2 className="text-center">Passenger Information</h2>
            <div className="d-flex flex-row mt-4">
              <div className="col-4 text-left">
                <p className="text-capitalize">
                  <span className="font-weight-bold">Passenger Name: </span>
                  {booking.title + ". " + booking.fName + " " + booking.lName}
                </p>
              </div>
              <div className="col-4 text-left">
                <p className="text-capitalize">
                  <span className="font-weight-bold">Phone Number: </span>
                  {booking.contact}
                </p>
              </div>
              <div className="col-4 text-left">
                <p className="text-capitalize">
                  <span className="font-weight-bold">
                    Booking Reference (CNR):{" "}
                  </span>
                  {booking.cnr}
                </p>
              </div>
            </div>
            <div className="pax-info d-flex flex-column">
              <div className="d-flex flex-column">
                <div className="d-flex flex-row">
                  <div className="col-4 d-flex flex-column text-left">
                    <p className="">
                      <span className="font-weight-bold">Email: </span>
                      {booking.email}
                    </p>
                    {(booking.cnic === null ||
                      booking.cnic === "_____-_______-_") && (
                      <p className="text-capitalize">
                        <span className="font-weight-bold">
                          Passport Expiry:{" "}
                        </span>
                        {date_convert(booking.passportExpiry)}{" "}
                        {console.log(booking)}
                      </p>
                    )}
                  </div>
                  <div className="col-4 d-flex flex-column text-left">
                    <p className="text-capitalize">
                      <span className="font-weight-bold">Nationality: </span>
                      {booking.nationality}
                    </p>
                  </div>
                  <div className="col-4 d-flex flex-column text-left">
                    {booking.cnic === null ||
                    booking.cnic === "_____-_______-_" ? (
                      <p className="text-capitalize">
                        <span className="font-weight-bold">
                          Passport Number:{" "}
                        </span>
                        {booking.passport}
                      </p>
                    ) : (
                      <p className="text-capitalize">
                        <span className="font-weight-bold">CNIC: </span>
                        {booking.cnic}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr className="text-center" />
          </div>
          <div className="passenger-info text-center rounded">
            <h2 className="text-center">Hotel Details</h2>
            <div className="d-flex flex-row mt-4">
              <div className="col-3 text-left">
                <p className="text-capitalize">
                  <span className="font-weight-bold">Hotel Name: </span>
                  {booking.booking_detail[0].hotelName}
                </p>
              </div>
              <div className="col-3 text-left">
                <p className="text-capitalize">
                  <span className="font-weight-bold">City: </span>
                  {booking.sName}
                </p>
              </div>
              <div className="col-3 text-left">
                <p className="text-capitalize">
                  <span className="font-weight-bold">Check-In: </span>
                  {booking.checkin.replaceAll("-", " ")}
                </p>
              </div>
              <div className="col-3 text-left">
                <p className="text-capitalize">
                  <span className="font-weight-bold">Check-Out: </span>
                  {booking.checkout.replaceAll("-", " ")}
                </p>
              </div>
            </div>
            <hr className="text-center" />
          </div>
          <div className="passenger-info text-center rounded">
            <h2 className="text-center">Room Details</h2>
            <div className="d-flex flex-column border border-primary">
              <div className="d-flex flex-row mt-4">
                <div className="col-2 text-center">
                  <p className="text-capitalize">
                    <span className="font-weight-bold">S. No. </span>
                  </p>
                </div>
                <div className="col-3 text-center">
                  <p className="text-capitalize">
                    <span className="font-weight-bold">Room Name </span>
                  </p>
                </div>
                <div className="col-3 text-center">
                  <p className="text-capitalize">
                    <span className="font-weight-bold">Room Quantity </span>
                  </p>
                </div>
                <div className="col-4 text-center">
                  <p className="text-capitalize">
                    <span className="font-weight-bold">Price Per Night </span>
                  </p>
                </div>
              </div>
              {booking.booking_detail.map((room, index) => {
                return (
                  <div className="row text-center" key={index}>
                    <div className="col-2">
                      <p>{index + 1}</p>
                    </div>
                    <div className="col-3">
                      <p>{room.room_title}</p>
                    </div>
                    <div className="col-3">
                      <p>{room.qty}</p>
                    </div>
                    <div className="col-4">
                      <p>{`PKR ${room.price}`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="passenger-info text-right mt-4">
            <h3 className="text-capitalize">
              <span className="font-weight-bold">Total Amount: </span>
              {`PKR ${booking.total_amount}`}
            </h3>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleShow}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
