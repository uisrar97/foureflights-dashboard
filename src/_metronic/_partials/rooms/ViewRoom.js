import React from 'react';
import { Button, Modal } from "react-bootstrap";

export default function ViewRoom({ showModal, handleShow, data })
{
    return (
        <Modal show={showModal} onHide={handleShow} size="xl" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header>
                <Modal.Title>View Room</Modal.Title>
                <Button variant="normal" onClick={handleShow}><i className="fas fa-times p-0"/></Button>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div className='col-md-12'>
                        <h2 className="text-center">{data.title + ' '} <span className='room-price'>{`(PKR ${data.one_night_price})`}</span></h2>
                        <div className="row mt-3">
                            <div className="col-3">
                                <div className="row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="contact-number">Room Quantity:</label>
                                    <p>{data.room_quantity}</p>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="email-field">Bed Type:</label>
                                    <p>{data.bed_type}</p>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="email-field">Bed(s) Quantity:</label>
                                    <p>{data.no_of_beds}</p>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="email-field">Refundable:</label>
                                    <span
                                        className=
                                        {
                                            (data.refundable === 'Yes') ?
                                                'badge badge-success'
                                            :
                                                'badge badge-danger'
                                        }
                                    >
                                        {data.refundable}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-3">
                                <div className="row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="contact-number">Max Adults:</label>
                                    <p>{data.no_of_adults}</p>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="email-field">Max Children:</label>
                                    <p>{data.no_of_childs}</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="row flex-column text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="contact-number">Room Description:</label>
                                    <p>{data.description}</p>
                                </div>
                            </div>
                        </div>
                        <hr className="text-center" />
                    </div>
                    <div className='col-md-12'>
                        <h2 className="text-center">Images</h2>
                        {
                            (data.room_images.length > 0) ?
                                <div className='row mt-3'>
                                    <div className='col-12'>
                                        <div className="row flex-wrap text-left">
                                            {
                                                data.room_images.map((img, index)=>{
                                                    return <div className="col-md-3 p-3 card border border-info rounded" key={index} >
                                                        <img className="card-img-top m-auto" src={img.image_path} alt={img.image_name} />
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className='row mt-3'>
                                    <div className='col-12 text-center'>
                                        <p>No Images Found</p>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}