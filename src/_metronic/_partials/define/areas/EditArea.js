import React, {useState} from 'react';
import { Plane } from 'react-loader-spinner';
import { Button, Modal } from "react-bootstrap";

export default function EditArea({ showModal, handleShow, loader, setLoader, getText, submitArea, sectors, setSectorID, data })
{
    const [disBtn, setDisBtn] = useState(true);
    let fieldCount = 0;
    let selectCount = 0;
    function toggleBtn(event)
    {
        if(event.target.id === 'area-name' && event.target.value.length >= 2)
        {
            fieldCount++;
        }
        else if(event.target.id === 'area-name' && event.target.value.length < 2)
        {
            fieldCount--;
        }

        if(event.target.id === 'sector-name' && event.target.value !== '0')
        {
            selectCount++;
        }
        else if(event.target.id === 'sector-name' && event.target.value === '0')
        {
            selectCount--;
        }
        
        if(fieldCount > 0 && selectCount > 0)
        {
            setDisBtn(false);
        }
        else
        {
            setDisBtn(true);
        }
    }
    return (
        <Modal show={showModal} onHide={handleShow} size="md" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header>
                <Modal.Title className="text-center">Edit Area</Modal.Title>
                {(!loader) && <Button variant="normal" onClick={handleShow}><i className="fas fa-times p-0"/></Button>}
            </Modal.Header>
            <Modal.Body>
                {
                    (!loader) ?
                        <>
                            <div className="text-center d-flex flex-column mb-2">
                                <div className="d-flex flex-row text-left mt-3">
                                    <div className="col-4 m-auto">
                                        <label className="font-weight-bold" htmlFor="area-name">Area Name</label>
                                    </div>
                                    <div className="col-8">
                                        <input 
                                            type="search" 
                                            className="form-control" 
                                            id="area-name" 
                                            defaultValue={data.area_name}
                                            placeholder='Enter New Area Name' 
                                            onChange={(e)=>{
                                                getText(e); 
                                                toggleBtn(e)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex flex-row text-left mt-3">
                                            <div className="col-4 m-auto">
                                                <label className="font-weight-bold" htmlFor="sector-name">City Name</label>
                                            </div>
                                            <div className="col-8">
                                                <select className="form-control" id="sector-name" defaultValue={data.sector_id} onChange={(e)=>{toggleBtn(e); setSectorID(e.target.value)}}>
                                                    <option value="0">Select City</option>
                                                    {
                                                        (sectors && sectors.length > 0) &&
                                                            sectors.map((sector)=>{
                                                                if(sector.status === 'Active')
                                                                {
                                                                    return <option value={sector.sector_id} key={sector.sector_id}>{sector.sector_name}</option>
                                                                }
                                                                else
                                                                {
                                                                    return ''
                                                                }
                                                            })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center mt-2">
                                    <Button 
                                        variant="primary"
                                        className='submit-btn' 
                                        onClick={()=>{
                                            submitArea(); 
                                            setLoader(!loader);
                                        }} 
                                        disabled={disBtn}
                                    >
                                        Update Area
                                    </Button>
                                </div>
                            </div>
                        </>
                    :
                        <div className="d-flex flex-column text-center plane-loader">
                            <Plane secondaryColor='#378edd' color="#378edd" />
                            <h3>Please Wait... We are Updating Area</h3>
                        </div>
                }
            </Modal.Body>
        </Modal>
    );
}