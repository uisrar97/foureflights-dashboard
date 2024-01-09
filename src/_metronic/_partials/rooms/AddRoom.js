import React, { useState } from 'react';
import { Plane } from 'react-loader-spinner';
import { Button, Modal } from "react-bootstrap";
import { TextCapitalizeFirst } from '../../_helpers/HelperFunctions';

export default function AddRoom({ showModal, handleShow, loader, setLoader, setRID, rTitle, setRTitle, rCount, 
    rBedType, setRBedType, rBedQuant, setRBedQuant, rNumAdults, rNumChilds, rPrice, setRPrice, rRefund, setRRefund, 
    rDesc, setRDesc, rImgs, setRImgs, decreaseCount, increaseCount, manualComm, setSubmitAddRoom })
{
    const [disBtn, setDisBtn] = useState(true);
    const [war, setWar] = useState(false);

    let files = [];
    // const [paths, setPaths] = useState([]);

    const listen = (event) => {
        files = rImgs;
        Object.values(event.target.files).map((file)=>{
            let count = 0;
            rImgs.map((img)=>{
                if(img.name === file.name)
                {
                    count++;
                }
                return 0;
            })
            if (count === 0)
            {
                files.push(file);
            }
            else
            {
                return '';
            }
            return setRImgs(files);
        })
        
    }

    const toggleBtn = () => {
        if( rTitle.length > 0 && Number(rCount) > 0 && Number(rNumAdults) > 0 && rBedType.length  > 0 &&
        Number(rBedQuant) > 0 && Number(rPrice) > 0 && rDesc.length >= 4 )
        {
            setWar(false);
            setDisBtn(false);
        }
        else
        {
            setWar(true);
            setDisBtn(true);
        }
    }

    return (
        <Modal show={showModal} onHide={handleShow} size="xl" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header>
                <Modal.Title>Add Room</Modal.Title>
                <Button variant="normal" onClick={handleShow}><i className="fas fa-times p-0"/></Button>
            </Modal.Header>
            <Modal.Body>
                {
                    (!loader) ?
                        <div>
                            <div>
                                <h2 className="text-center">Room Details</h2>
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="room-title">Title</label>
                                            <input 
                                                type="search" 
                                                className="form-control border border-primary" 
                                                id="room-title" 
                                                placeholder='Enter Room Title' 
                                                onChange={(e)=>{
                                                    setRTitle(TextCapitalizeFirst(e.target.value));
                                                    toggleBtn();
                                                }}
                                            />
                                        </div>
                                        {
                                            (rTitle.length === 0 && war) &&
                                                <p className='text-danger'>* Provide Room Title</p>
                                        }
                                    </div>
                                    <div className="col-6 row">
                                        <div className='col-4'>
                                            <div className="d-flex flex-column text-left">
                                                <label className="font-weight-bold" htmlFor="room-quant">Room Quantity</label>
                                                <div className="col align-self-center">
                                                    <div className="booking-form-counter d-flex flex-row w-100">
                                                        <div 
                                                            className="value-button" 
                                                            id="decrease" 
                                                            onClick={()=>{decreaseCount('room-quantity'); toggleBtn();}} 
                                                            value="Decrease Value"
                                                        >
                                                            <i className="far fa-minus-square" id="comcounter" />
                                                        </div>
                                                        <input type="number" id="room-quant" onChange={(e)=>manualComm(e, 'room-quantity')} value={rCount} />
                                                        <div
                                                            className="value-button"
                                                            id="increase"
                                                            onClick={()=>{increaseCount('room-quantity'); toggleBtn();}}
                                                            value="Increase Value"
                                                        >
                                                            <i className="far fa-plus-square" id="comcounter" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                (rCount === 0 && war) &&
                                                    <p className='text-danger'>* Provide Room Count</p>
                                            }
                                        </div>
                                        <div className="col-4">
                                            <div className="d-flex flex-column text-left">
                                                <label className="font-weight-bold" htmlFor="adult-quant">Number of Adults</label>
                                                <div className="col align-self-center">
                                                    <div className="booking-form-counter d-flex flex-row w-100">
                                                        <div
                                                            className="value-button"
                                                            id="decrease" 
                                                            onClick={()=>{decreaseCount('num-adults'); toggleBtn();}} 
                                                            value="Decrease Value"
                                                        >
                                                            <i className="far fa-minus-square" id="comcounter" />
                                                        </div>
                                                        <input type="number" id="adult-quant" onChange={(e)=>manualComm(e, 'num-adults')} value={rNumAdults} />
                                                        <div
                                                            className="value-button"
                                                            id="increase" 
                                                            onClick={()=>{increaseCount('num-adults'); toggleBtn();}} 
                                                            value="Increase Value"
                                                        >
                                                            <i className="far fa-plus-square" id="comcounter" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                (rNumAdults === 0 && war) &&
                                                    <p className='text-danger'>* Provide Number of Adults</p>
                                            }
                                        </div>
                                        <div className="col-4">
                                            <div className="d-flex flex-column text-left">
                                                <label className="font-weight-bold" htmlFor="child-quant">Number of Children</label>
                                                <div className="col align-self-center">
                                                    <div className="booking-form-counter d-flex flex-row w-100">
                                                        <div
                                                            className="value-button"
                                                            id="decrease" 
                                                            onClick={()=>{decreaseCount('num-childs'); toggleBtn();}} 
                                                            value="Decrease Value"
                                                        >
                                                            <i className="far fa-minus-square" id="comcounter" />
                                                        </div>
                                                        <input type="number" id="child-quant" onChange={(e)=>manualComm(e, 'num-childs')} value={rNumChilds} />
                                                        <div
                                                            className="value-button"
                                                            id="increase" 
                                                            onClick={()=>{increaseCount('num-childs'); toggleBtn();}} 
                                                            value="Increase Value"
                                                        >
                                                            <i className="far fa-plus-square" id="comcounter" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="bed-type">Bed Type</label>
                                            <select className="form-control border border-primary" id="bed-type" onChange={(e)=>{setRBedType(e.target.value); toggleBtn();}}>
                                                <option value="0">Select a Bed Type</option>
                                                <option value="Twin Bed">Twin Bed</option>
                                                <option value="Double Bed">Double Bed</option>
                                                <option value="Queen Bed">Queen Bed</option>
                                                <option value="King Bed">King Bed</option>
                                            </select>
                                        </div>
                                        {
                                            ((rBedType.length === 0 || rBedType === '0') && war) &&
                                                <p className='text-danger'>* Select Bed Type</p>
                                        }
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="bed-quantity">Bed(s) Quantity</label>
                                            <select className="form-control border border-primary" id="bed-quantity" onChange={(e)=>{setRBedQuant(e.target.value); toggleBtn();}}>
                                                <option value="0">Select Beds Quantity</option>
                                                <option value="1">1 Bed</option>
                                                <option value="2">2 Beds</option>
                                                <option value="3">3 Beds</option>
                                            </select>
                                        </div>
                                        {
                                            ((rBedQuant.length === 0 || rBedQuant === '0') && war) &&
                                                <p className='text-danger'>* Select Bed(s) Quantity</p>
                                        }
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className='col-6'>
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor='room-price'>Price (per night)</label>
                                            <input 
                                                type="number" 
                                                className='form-control border border-primary remove-input-number-arrows' 
                                                id="room-price" 
                                                onChange={(e)=>{setRPrice(e.target.value); toggleBtn();}} 
                                                defaultValue={0}
                                            />
                                        </div>
                                        {
                                            (Number(rPrice) === 0 && war) &&
                                                <p className='text-danger'>* Enter Room Price</p>
                                        }
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold">Refundable</label>
                                            <div className='col-12 row pt-3'>
                                                <div className='col-6'>
                                                    <input
                                                        type='radio' 
                                                        className="border border-primary mr-2" 
                                                        name="refundable"
                                                        id="refundable-yes" 
                                                        checked={(rRefund) && true}
                                                        onChange={()=>setRRefund(true)}
                                                    />
                                                    <label htmlFor='refundable-yes'>Yes</label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type='radio' 
                                                        className="border border-primary mr-2" 
                                                        name="refundable"
                                                        id="refundable-no" 
                                                        checked={(!rRefund) && true}
                                                        onChange={()=>setRRefund(false)}
                                                    />
                                                    <label htmlFor='refundable-no'>No</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="room-description">Room Description</label>
                                            <textarea 
                                                className="form-control border border-primary" 
                                                id="room-description" 
                                                placeholder='Enter Room Description'
                                                onChange={(e)=>{
                                                    setRDesc(e.target.value);
                                                    toggleBtn();
                                                }}
                                            />
                                        </div>
                                        {
                                            (rDesc.length === 0 && war) ?
                                                <p className='text-danger'>* Provide Room Description</p>
                                            :
                                                (rDesc.length < 5 && war) &&
                                                    <p className='text-danger'>* Room Description should have 5 Characters or More</p>
                                        }
                                    </div>
                                </div>
                                <hr className="text-center" />
                            </div>
                            <div>
                                <h2 className="text-center">Images</h2>
                                <div className="row mt-3">
                                    <div className='col-12'>
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor='images-input'>Room Images</label>
                                            <input type='file' id='images-input' className='form-control border border-primary' onChange={(e)=>listen(e)} accept='image/*' multiple />
                                        </div>
                                    </div>
                                </div>
                                {/* {
                                    (paths.length > 0) &&
                                        <div className='row mt-3'>
                                            <div className='col-md-12 row flex-wrap'>
                                                {
                                                    (paths.length > 0) &&
                                                        paths.map((path, index)=>{
                                                            return <img src={path.url} alt={path.fileName} key={index} width='200' height='200'/>
                                                        })
                                                }
                                            </div>
                                        </div>
                                } */}
                            </div>
                            <div className='col-12 mt-3 text-center'>
                                <div>
                                    <Button 
                                        variant="primary" 
                                        className='submit-btn'
                                        onClick={()=>{setRID(0); setSubmitAddRoom(true); setLoader(!loader);}}
                                        disabled={(disBtn) && true}
                                    > Submit </Button>
                                </div>
                            </div>
                        </div>
                    :
                        <div className="d-flex flex-column text-center plane-loader">
                            <Plane secondaryColor='#378edd' color="#378edd" />
                            <h3>Please Wait... We are Adding New Room</h3>
                        </div>
                }
            </Modal.Body>
        </Modal>
    );
}