import React from "react";
import { Plane } from "react-loader-spinner";
import {
  Button,
  Modal,
  // ButtonToolbar,
  // Col,
  // Container,
  // Row
} from "react-bootstrap";

export default function PaymentModal({
  showModal,
  handleShow,
  booking,
  payment,
  setPayment,
  loader,
  setLoader,
}) {
  return (
    <Modal
      show={showModal}
      onHide={handleShow}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title className="text-center">
          Payment Confirmation & Issue Ticket
        </Modal.Title>
        {!loader && (
          <Button variant="normal" onClick={() => handleShow({})}>
            <i className="fas fa-times p-0" />
          </Button>
        )}
      </Modal.Header>
      <Modal.Body>
        {!loader ? (
          <>
            <div className="text-center d-flex flex-column">
              <p className="d-flex flex-row">
                <span className="font-weight-bold col-6 text-left">PNR: </span>
                <span className="col-6 text-right">{booking.pnr}</span>
              </p>
              <p className="d-flex flex-row">
                <span className="font-weight-bold col-6 text-left">
                  Total Fare:{" "}
                </span>
                <span className="col-6 text-right">
                  PKR{" "}
                  {booking.total_amount_with_commission !== 0
                    ? booking.total_amount_with_commission
                    : booking.total_amount}
                </span>
              </p>
              <div className="d-flex flex-row text-left">
                <div className="col-1">
                  <input
                    type="checkbox"
                    id="payment"
                    onChange={() => setPayment(!payment)}
                  />
                </div>
                <div className="col-11">
                  <label className="font-weight-bold" htmlFor="payment">
                    Check this in case of Payment Confirmation to enable Issue
                    Ticket Button
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 text-center mt-2">
                <Button
                  variant="primary"
                  className="submit-btn"
                  disabled={!payment ? "disabled" : ""}
                  onClick={() => setLoader(true)}
                >
                  Issue Ticket
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="d-flex flex-column text-center plane-loader">
            <Plane secondaryColor="#378edd" color="#378edd" />
            <h3>Please Wait... We are Issuing your Ticket</h3>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
