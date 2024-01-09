import React from 'react';
import { Plane } from 'react-loader-spinner';
import { Button, Modal } from "react-bootstrap";

export default function EditRegion({ showModal, handleShow, continents, loader, setLoader, getText, disBtn, data, submitRegion })
{
    return (
        <Modal show={showModal} onHide={handleShow} size="md" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header>
                <Modal.Title className="text-center">Edit Country</Modal.Title>
                {(!loader) && <Button variant="normal" onClick={handleShow}><i className="fas fa-times p-0" /></Button>}
            </Modal.Header>
            <Modal.Body>
                {
                    (!loader) ?
                        <>
                            <div className="text-center d-flex flex-column mb-2">
                                {
                                    (continents.length > 0) &&
                                    <div className="d-flex flex-row text-left mt-3">
                                        <div className="col-4 m-auto">
                                            <label className="font-weight-bold" htmlFor="continents">Continent</label>
                                        </div>
                                        <div className="col-8">
                                            <select
                                                className="form-control"
                                                id="continents"
                                                defaultValue={data.continent_id}
                                                onChange={(e) => {
                                                    getText(e);
                                                }}
                                            >
                                                <option value={0}>Select Continent</option>
                                                {
                                                    continents.map((continent, index) => {
                                                        if (continent.status === 'Active') {
                                                            return (<option value={continent.id} key={index}>{continent.continent_name}</option>);
                                                        }
                                                        else {
                                                            return '';
                                                        }
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                }
                                <div className="d-flex flex-row text-left mt-3">
                                    <div className="col-4 m-auto">
                                        <label className="font-weight-bold" htmlFor="region-name">Country Name</label>
                                    </div>
                                    <div className="col-8">
                                        <input
                                            type="search"
                                            className="form-control"
                                            id="region-name"
                                            placeholder='Enter New Country Name'
                                            defaultValue={data.region_name}
                                            onChange={(e) => {
                                                getText(e);
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
                                        onClick={() => {
                                            submitRegion();
                                            setLoader(!loader);
                                        }}
                                        disabled={disBtn}
                                    >
                                        Update Country
                                    </Button>
                                </div>
                            </div>
                        </>
                        :
                        <div className="d-flex flex-column text-center plane-loader">
                            <Plane secondaryColor='#378edd' color="#378edd" />
                            <h3>Please Wait... We are Updating Country</h3>
                        </div>
                }

            </Modal.Body>
        </Modal>
    );
}