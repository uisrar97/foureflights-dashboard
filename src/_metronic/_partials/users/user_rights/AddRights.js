import React, {useState} from 'react';
import { Plane } from 'react-loader-spinner';
import { Button, Modal } from "react-bootstrap";

export default function AddRights({ rights, showModal, handleShow, loader, setLoader, getText, submitRight, setParentRight })
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
                <Modal.Title className="text-center">Add Rights</Modal.Title>
                {(!loader) && <Button variant="normal" onClick={handleShow}><i className="fas fa-times p-0"/></Button>}
            </Modal.Header>
            <Modal.Body>
                {
                    (!loader) ?
                        <>
                            <div className="text-center d-flex flex-column mb-2">
                                {
                                    (rights.length > 0) &&
                                        <div className="d-flex flex-row text-left">
                                            <div className="col-4 m-auto">
                                                <label className="font-weight-bold" htmlFor="parent-right">Parent Right</label>
                                            </div>
                                            <div className="col-8">
                                                <select className="form-control" id="parent-right" defaultValue="0" onChange={(e)=>setParentRight(e.target.value)}>
                                                    <option value="0">No Parent</option>
                                                    {
                                                        rights.map((right)=>{
                                                            if(Number(right.parent_id) === 0)
                                                            {
                                                                return <option value={right.id} key={right.id}>{right.right_name}</option>
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
                                }
                                <div className="d-flex flex-row text-left mt-3">
                                    <div className="col-4 m-auto">
                                        <label className="font-weight-bold" htmlFor="right-name">Right Name</label>
                                    </div>
                                    <div className="col-8">
                                        <input type="search" className="form-control" id="right-name" placeholder='Enter New Right Name' onChange={(e)=>{getText(e); toggleBtn(e)}} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center mt-2">
                                    <Button variant="primary" className='submit-btn' onClick={()=>{submitRight(); setLoader(!loader)}} disabled={disBtn}>Add Right</Button>
                                </div>
                            </div>
                        </>
                    :
                        <div className="d-flex flex-column text-center plane-loader">
                            <Plane secondaryColor='#378edd' color="#378edd" />
                            <h3>Please Wait... We are Adding New Rights</h3>
                        </div>
                }
                
            </Modal.Body>
        </Modal>
    );
}