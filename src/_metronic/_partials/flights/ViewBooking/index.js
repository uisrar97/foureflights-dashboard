import React from "react";
import AirSialViewBooking from "./AirSialViewBooking";
import HititViewBooking from "./HititViewBooking";
import TravelPortViewBooking from "./TravelPortViewBooking";
import AirBlueViewBooking from "./AirBlueViewBooking";
import {
  Button,
  Modal,
  // ButtonToolbar,
  // Col,
  // Container,
  // Row
} from "react-bootstrap";

export default function ViewBooking({ showModal, handleShow, booking }) {
  const viewBookingAPI = () => {
    if (
      booking?.provider_type === "travelport"
        ? booking?.api_type === "travelport"
        : booking?.api_type === "travelport"
    ) {
      return <TravelPortViewBooking booking={booking} />;
    } else if (booking?.api_type === "hitit") {
      return <HititViewBooking booking={booking} />;
    } else if (booking?.api_type === "airblue") {
      return <AirBlueViewBooking booking={booking} />;
    } else if (booking?.api_type === "airsial") {
      return <AirSialViewBooking booking={booking} />;
    } else {
      return "";
    }
  };

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
      <Modal.Body>{viewBookingAPI()}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleShow}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
