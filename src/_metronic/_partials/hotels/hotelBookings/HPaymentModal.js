import React from 'react';
import { Plane } from 'react-loader-spinner';
import { Button, Modal } from "react-bootstrap";

export default function HPaymentModal({ showModal, handleShow, booking, payment, setPayment, loader, setLoader })
{
    return (
        <Modal show={showModal} onHide={handleShow} size="md" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header>
                <Modal.Title className="text-center">Payment Confirmation</Modal.Title>
                {(!loader) && <Button variant="normal" onClick={()=>handleShow({})}><i className="fas fa-times p-0"/></Button>}
            </Modal.Header>
            <Modal.Body>
                {
                    (!loader) ?
                        <>
                            <div className="text-center d-flex flex-column">
                                <p className="d-flex flex-row">
                                    <span className="font-weight-bold col-6 text-left">CNR: </span>
                                    <span className="col-6 text-right">{booking.cnr}</span>
                                </p>
                                <p className="d-flex flex-row">
                                    <span className="font-weight-bold col-6 text-left">Total Amount: </span>
                                    <span className="col-6 text-right">PKR {booking.total_amount}</span>
                                </p>
                                <div className="d-flex flex-row text-left">
                                    <div className="col-1">
                                        <input type="checkbox" id="payment" onChange={() => setPayment(!payment)} />
                                    </div>
                                    <div className="col-11">
                                        <label className="font-weight-bold" htmlFor="payment">Check this in case of Payment Confirmation to enable Confirm Booking Button</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center mt-2">
                                    <Button variant="primary" className='submit-btn' disabled={(!payment) ? 'disabled' : ''} onClick={()=>setLoader(true)}>Confirm Booking</Button>
                                </div>
                            </div>
                        </>
                    :
                        <div className="d-flex flex-column text-center plane-loader">
                            <Plane secondaryColor='#378edd' color="#378edd" />
                            <h3>Please Wait... We are Confirming your Booking</h3>
                        </div>
                }
                
            </Modal.Body>
        </Modal>
    );
}