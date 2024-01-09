import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { Rating } from 'react-simple-star-rating';

export default function ViewVendor({ showModal, handleShow, data })
{
    let rating = 0;
    if(Number(data.rowData.rating) === 1)
    {
        rating = 20;
    }
    else if(Number(data.rowData.rating) === 2)
    {
        rating = 40;
    }
    else if(Number(data.rowData.rating) === 3)
    {
        rating = 60;
    }
    else if(Number(data.rowData.rating) === 4)
    {
        rating = 80;
    }
    else if(Number(data.rowData.rating) === 5)
    {
        rating = 100;
    }
    return (
        <Modal show={showModal} onHide={handleShow} size="xl" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header>
                <Modal.Title>View Vendor</Modal.Title>
                <Button variant="normal" onClick={handleShow}><i className="fas fa-times p-0"/></Button>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>
                        <h2 className="text-center">Vendor Contact Information</h2>
                        <div className="d-flex flex-row mt-3">
                            <div className="col-6">
                                <div className="d-flex flex-row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="contact-number">Vendor Contact #</label>
                                    <p>{data.contact}</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex flex-row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="email-field">Vendor Email</label>
                                    <p>{data.email}</p>
                                </div>
                            </div>
                        </div>
                        <hr className="text-center" />
                    </div>
                    <div>
                        <h2 className="text-center">Vendor Details</h2>
                        <div className="d-flex flex-row mt-3">
                            <div className="col-6">
                                <div className="d-flex flex-row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="property-name">Vendor Name</label>
                                    <p>{data.property}</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex flex-row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="sector-name">City Name</label>
                                    <p>{data.sectorName}</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-row mt-3">
                            <div className="col-6">
                                <div className="d-flex flex-column text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="complimentaries">Complimentaries</label>
                                    {
                                        (data.rowData.vendor_complimentaries.length > 0) ?
                                            <ul>
                                                {
                                                    data.rowData.vendor_complimentaries.map((comp, index)=>{
                                                        return <li key={index}>{comp.complimentary}</li>
                                                    })
                                                }
                                            </ul>
                                        :
                                            <p>-</p> 
                                    }
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex flex-column text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="amenities">Amenities</label>
                                    {
                                        (data.rowData.vendor_amenities.length > 0) ?
                                            <ul>
                                                {
                                                    data.rowData.vendor_amenities.map((amen, index)=>{
                                                        return <li key={index}>{amen.amenity}</li>
                                                    })
                                                }
                                            </ul>
                                        :
                                            <p>-</p> 
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-row mt-3">
                            <div className="col-6">
                                <div className="d-flex flex-row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="property-rooms">Total Rooms</label>
                                    <p>{data.rowData.no_of_rooms}</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex flex-row text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="vendor-rating">Vendor Rating</label>
                                    <span id="vendor-rating">
                                        <Rating
                                            ratingValue={Number(rating)}
                                            readonly={true}
                                            size={20}
                                            emptyIcon={<i className="far fa-star"/>}
                                            fullIcon={<i className="fa fa-star" style={{color: "#ffd700"}}/>}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-row mt-3">
                            <div className="col-12">
                                <div className="d-flex flex-column text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="property-description">Vendor Address</label>
                                    <p>{data.rowData.address}</p>
                                </div>
                            </div>
                        </div>
                        {
                            (data.rowData.location !== null && data.rowData.location !== '' && data.rowData.location.indexOf('http') > -1) &&
                                <div className="d-flex flex-row mt-3">
                                    <div className="col-12">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold mr-2" htmlFor="property-location">Vendor Location</label>
                                            <div 
                                                className="vendor-location-iframe"
                                                id="property-location"
                                                title={data.property}
                                                dangerouslySetInnerHTML={{__html: data.rowData.location}} />
                                        </div>
                                    </div>
                                </div>
                        }
                        
                        <div className="d-flex flex-row mt-3">
                            <div className="col-12">
                                <div className="d-flex flex-column text-left">
                                    <label className="font-weight-bold mr-2" htmlFor="property-description">Vendor Description</label>
                                    <p>{data.rowData.description}</p>
                                </div>
                            </div>
                        </div>
                        <hr className="text-center" />
                    </div>
                    <div>
                        <h2 className="text-center">Vendor Images</h2>
                        {
                            (data.rowData.vendor_images.length > 0) ?
                                <div className='d-flex flex-row mt-3'>
                                    <div className='col-12'>
                                        <div className="d-flex flex-row flex-wrap text-left">
                                            {
                                                data.rowData.vendor_images.map((img, index)=>{
                                                    return <div className="col-md-3 p-3 card border border-info rounded" key={index} >
                                                        <img className="card-img-top m-auto" src={img.image_path} alt={img.image_name} />
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className='d-flex flex-row mt-3'>
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