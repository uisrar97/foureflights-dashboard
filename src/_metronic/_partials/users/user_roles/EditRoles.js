import React, { useState } from 'react';
import { Plane } from 'react-loader-spinner';
import { Button, Modal } from "react-bootstrap";

export default function EditRights({ rights, showModal, handleShow, loader, setLoader, getText, setRID, submitRole, uRoles, setURoles, data })
{
    const [disBtn, setDisBtn] = useState(true);

    function getCheckedRoles()
    {
        let markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
        let roles = [];
        for (let i = 0; i < markedCheckbox.length; i++)
        {
            roles.push(markedCheckbox[i].value);
        }
        setURoles(roles);
    }
    function toggleBtn(event)
    {
        let val = '';
        let test = false;
        if (event.target.id !== 'role-name')
        {
            val = document.getElementById('role-name').value;
            if(event.target.classList[1] === 'mainmenu' || event.target.classList[1] === 'submenu')
            {
                test = true;
            }
        }
        if ((event.target.id === 'role-name' && event.target.value.length > 0) || (val.length > 0 && test))
        {
            setDisBtn(false);
        }
        else if ((event.target.id === 'role-name' && event.target.value.length === 0) || uRoles.length === 0)
        {
            setDisBtn(true);
        }
    }
    let newRights = [];
    if (rights.length > 0)
    {
        rights.map((right) => {
            if (Number(right.parent_id) === 0 )
            {
                right.submenu = [];
                newRights.push(right);
            }
            right.checked = false;
            data.role_rights.map((rRights)=>{
                if(rRights.right_code === right.right_code)
                {
                    right.checked = true;
                }
                return 0;
            })
            return 0;
        });
        newRights.map((nRight) => {
            rights.map((rig) => {
                if (Number(rig.parent_id) === nRight.id)
                {
                    nRight.submenu.push(rig);
                }
                return 0;
            })
            return 0;
        })
    }
    function selectAll(event)
    {
        let checkboxes = document.getElementsByClassName('submenu');
        for (let i = 0, n = checkboxes.length; i < n; i++)
        {
            let classes = checkboxes[i].className.replace('mr-2 submenu ', '');
            if (event.target.id === classes && checkboxes[i].checked)
            {
                checkboxes[i].checked = false;
            }
            else if (event.target.id === classes && !checkboxes[i].checked)
            {
                checkboxes[i].checked = true;
            }
        }
    }
    function unselect(rightCode)
    {
        let checkbox = document.getElementById(rightCode);
        let subcheckboxes = document.getElementsByClassName(`mr-2 submenu ${rightCode}`);

        let count = 0;
        for (var i = 0, n = subcheckboxes.length; i < n; i++)
        {
            if (subcheckboxes[i].checked)
            {
                count++;
            }
        }
        if (count > 0 && count <= subcheckboxes.length)
        {
            checkbox.checked = true;
        }
        else if (count === 0)
        {
            checkbox.checked = false;
        }
    }
    return (
        <Modal show={showModal} onHide={handleShow} size="xl" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header>
                <Modal.Title className="text-center">Edit Right</Modal.Title>
                {(!loader) && <Button variant="normal" onClick={handleShow}><i className="fas fa-times p-0"/></Button>}
            </Modal.Header>
            <Modal.Body>
                {
                    (!loader) ?
                        <>
                            <div className="d-flex flex-column mb-2">
                                <div className="d-flex flex-row text-left mb-2">
                                    <div className="col-4 m-auto">
                                        <label className="font-weight-bold" htmlFor="role-name">Role Name</label>
                                    </div>
                                    <div className="col-8">
                                        <input type="search" className="form-control" id="role-name" placeholder='Enter New Role Name' onChange={(e) => { getText(e); toggleBtn(e); }} defaultValue={data.role_name} />
                                    </div>
                                </div>
                                <div className="d-flex flex-row text-center mt-5">
                                    <div className="col-12 m-auto">
                                        <h5>Role Rights</h5>
                                    </div>
                                </div>
                                <div className="d-flex flex-column flex-wrap text-left pt-4">
                                    {
                                        (newRights.length > 0) &&
                                            newRights.map((right) => {
                                                return <div className="d-flex flex-row mt-2 mb-2 flex-wrap" key={right.id}>
                                                    <div className="col-md-12">
                                                        <input type="checkbox" className="mr-2 mainmenu" id={right.right_code} value={right.id} onClick={(e) => { selectAll(e); getCheckedRoles(); toggleBtn(e); }} defaultChecked={(right.checked) && 'checked'} />
                                                        <label className="m-auto font-weight-bold" htmlFor={right.right_code} >{right.right_name}</label>
                                                    </div>
                                                    <div className="row col-md-12 ml-5 mt-2">
                                                        {
                                                            (right.submenu.length > 0) &&
                                                                right.submenu.map((sub) => {
                                                                    return <div className="col-md-4" key={sub.id}>
                                                                        <input type="checkbox" className={`mr-2 submenu ${right.right_code}`} id={sub.right_code} value={sub.id} onClick={(e) => { unselect(right.right_code); getCheckedRoles(); toggleBtn(e); }} defaultChecked={(sub.checked) && 'checked'} />
                                                                        <label className="m-auto font-weight-bold" htmlFor={sub.right_code} >{sub.right_name}</label>
                                                                    </div>
                                                                })
                                                        }
                                                    </div>
                                                </div>
                                            })
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center mt-2">
                                    <Button variant="primary" className='submit-btn' onClick={() => { getCheckedRoles(); setRID(data.dID); submitRole(); setLoader(!loader) }} disabled={disBtn}>Update Role</Button>
                                </div>
                            </div>
                        </>
                        :
                        <div className="d-flex flex-column text-center plane-loader">
                            <Plane secondaryColor='#378edd' color="#378edd" />
                            <h3>Please Wait... We are Updating the Role Information</h3>
                        </div>
                }

            </Modal.Body>
        </Modal>
    );
}