import React, {useState} from 'react';
import { Plane } from 'react-loader-spinner';
import { Button, Modal } from "react-bootstrap";

export default function EditContinent({ showModal, handleShow, loader, setLoader, getText, submitContinent, setCID, data })
{
    const [disBtn, setDisBtn] = useState(true);
    function toggleBtn(event)
    {
        if(event.target.value.length > 0)
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
                <Modal.Title className="text-center">Edit Continent</Modal.Title>
                {(!loader) && <Button variant="normal" onClick={handleShow}><i className="fas fa-times p-0"/></Button>}
            </Modal.Header>
            <Modal.Body>
                {
                    (!loader) ?
                        <>
                            <div className="text-center d-flex flex-column mb-2">
                                <div className="d-flex flex-row text-left mt-3">
                                    <div className="col-4 m-auto">
                                        <label className="font-weight-bold" htmlFor="continent-name">Continent Name</label>
                                    </div>
                                    <div className="col-8">
                                        <input 
                                            type="search" 
                                            className="form-control" 
                                            id="continent-name" 
                                            placeholder='Enter New Continent Name'
                                            defaultValue={data.continent_name}
                                            onChange={(e)=>{
                                                getText(e); 
                                                toggleBtn(e)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center mt-2">
                                    <Button 
                                        variant="primary"
                                        className='submit-btn' 
                                        onClick={()=>{
                                            setCID(data.dID);
                                            submitContinent(); 
                                            setLoader(!loader);
                                        }} 
                                        disabled={disBtn}
                                    >
                                        Update Continent
                                    </Button>
                                </div>
                            </div>
                        </>
                    :
                        <div className="d-flex flex-column text-center plane-loader">
                            <Plane secondaryColor='#378edd' color="#378edd" />
                            <h3>Please Wait... We are Updating Continent</h3>
                        </div>
                }
                
            </Modal.Body>
        </Modal>
    );
}