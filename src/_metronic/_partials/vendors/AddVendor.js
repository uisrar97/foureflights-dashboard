import React, { useState, useEffect, useCallback } from 'react';
import { Plane } from 'react-loader-spinner';
import { Button, Modal } from "react-bootstrap";
import { Rating } from 'react-simple-star-rating';
import Select from 'react-select';
import { TextCapitalizeFirst } from '../../_helpers/HelperFunctions';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function AddVendor({ showModal, handleShow, sectors, loader, setLoader, setVID, propertyName, setPropertyName, 
    sectorId, setSectorId, areaId, setAreaId, setCompItems, setAmenItems, roomQuant, setRoomQuant, vRefund, setVRefund, 
    vendorRating, setVendorRating, propType, setPropType, propAddress, setPropAddress, propLocation, setPropLocation, 
    propDescription, setPropDescription, venderContact, setVendorContact, venderEmail, setVendorEmail, vendorImgs, setVendorImgs, 
    setSubmitAddVendor })
{
    const [disBtn, setDisBtn] = useState(true);
    const [war, setWar] = useState(false);
    
    const amenities = [
        { value: 'Free Wifi', label: 'Free Wifi' },
        { value: 'Taxi Service', label: 'Taxi Service' },
        { value: 'Parking', label: 'Parking' },
        { value: 'Car Hire', label: 'Car Hire' },
        { value: 'Restaurant', label: 'Restaurant' },
        { value: 'Breakfast in the Room', label: 'Breakfast in the Room' },
        { value: 'Meeting Rooms', label: 'Meeting Rooms' },
        { value: 'Baggage Storage', label: 'Baggage Storage' },
        { value: 'Laundry Service', label: 'Laundry Service' },
        { value: 'Ironing Service', label: 'Ironing Service' },
        { value: 'Non Smoking Hotel', label: 'Non Smoking Hotel' },
    ]
    const complimentaries = [
        { value: 'Tea and Coffee', label: 'Tea & Coffee' },
        { value: 'Toiletries', label: 'Toiletries' },
        { value: 'Sewing Kit', label: 'Sewing Kit' },
        { value: 'Pens and Notepad', label: 'Pens & Notepad' },
        { value: 'Extra Pillows', label: 'Extra Pillows' },
        { value: 'Extra Blankets', label: 'Extra Blankets' },
        { value: 'Phone Charger', label: 'Phone Charger' },
        { value: 'Nighlights', label: 'Nighlights' },
        { value: 'Local Map of the City', label: 'Local Map of the City' },
        { value: 'Umbrella', label: 'Umbrella' }
    ]
    const ratingChanged = (newRating) => {
        setVendorRating(Number(newRating));
    };

    const multiselect = (event, type) => {
        if (type === 'complimentaries')
        {
            let items = [];
            if(event.length > 0)
            {
                event.map(e=>{return items.push(e.label)})
            }
            else
            {
                items = [];
            }
            setCompItems(items);
        }
        if (type === 'amenities')
        {
            let items = [];
            if(event.length > 0)
            {
                event.map(e=>{return items.push(e.label)})
            }
            else
            {
                items = [];
            }
            setAmenItems(items);
        }
    }

    let files = [];
    // const [paths, setPaths] = useState([]);

    const listen = (event) => {
        files = vendorImgs;
        Object.values(event.target.files).map((file)=>{
            let count = 0;
            vendorImgs.map((img)=>{
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
            return setVendorImgs(files);
        });
        
    }
    
    const toggleBtn = useCallback(async() => {
        if( propertyName.length >= 5 && sectorId > 0 && areaId > 0 && Number(roomQuant) > 0 && Number(vendorRating) >= 0 && 
        propAddress.length > 0 && (propLocation.length >= 5 && propLocation.indexOf('http') > -1) && propDescription.length >= 4 && 
        venderContact.length >= 5 && (venderEmail.length >= 5 && venderEmail.indexOf('@') > -1) && propType !== '')
        {
            setWar(false);
            setDisBtn(false);
        }
        else
        {
            setWar(true);
            setDisBtn(true);
        }
    }, [propertyName, sectorId, areaId, roomQuant, vendorRating, propAddress, propLocation, propDescription, 
        venderContact, venderEmail, propType]);

    useEffect(() => {
        if( propertyName || sectorId || areaId || roomQuant || vendorRating || propAddress || propLocation || 
            propDescription || venderContact || venderEmail || propType || vendorImgs)
        {
            toggleBtn();
        }
        
    }, [toggleBtn, propertyName, sectorId, areaId, roomQuant, vendorRating, propAddress, propLocation, 
        propDescription, venderContact, venderEmail, propType, vendorImgs]);
        
    return (
        <Modal show={showModal} onHide={handleShow} size="xl" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header>
                <Modal.Title>Add Vendor</Modal.Title>
                <Button variant="normal" onClick={handleShow}><i className="fas fa-times p-0"/></Button>
            </Modal.Header>
            <Modal.Body>
                {
                    (!loader) ?
                        <div>
                            <div>
                                <h2 className="text-center">Vendor Contact Information</h2>
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="contact-number">Vendor Contact #</label>
                                            <input 
                                                type="text" 
                                                className="form-control border border-primary" 
                                                id="contact-number" 
                                                placeholder='Enter Vendor Contact #' 
                                                onChange={(e)=>{
                                                    setVendorContact(e.target.value);
                                                }}
                                            />
                                        </div>
                                        {
                                            (venderContact.length === 0 && war) ?
                                                <p className='text-danger'>* Provide Vendor Contact Number</p>
                                            :
                                                (venderContact.length < 5 && war) &&
                                                    <p className='text-danger'>* Provide Valid Contact Number</p>
                                        }
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="email-field">Vendor Email</label>
                                            <input 
                                                type="email" 
                                                className="form-control border border-primary" 
                                                id="email-field" 
                                                placeholder='Enter Vendor Email Address' 
                                                onChange={(e)=>{
                                                    setVendorEmail(e.target.value);
                                                }}
                                            />
                                        </div>
                                        {
                                            (venderEmail.length === 0 && war) ?
                                                <p className='text-danger'>* Provide Vendor Email Address</p>
                                            :
                                                ((venderEmail.length < 5 || venderEmail.indexOf('@') === -1) && war) &&
                                                    <p className='text-danger'>* Provide Valid Email Address</p>
                                        }
                                    </div>
                                </div>
                                <hr className="text-center" />
                            </div>
                            <div>
                                <h2 className="text-center">Property Details</h2>
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="property-name">Property Name</label>
                                            <input 
                                                type="search" 
                                                className="form-control border border-primary" 
                                                id="property-name" 
                                                placeholder='Enter Property Name' 
                                                onChange={(e)=>{
                                                    setPropertyName(TextCapitalizeFirst(e.target.value));
                                                }}
                                            />
                                        </div>
                                        {
                                            (propertyName.length === 0 && war) ?
                                                <p className='text-danger'>* Provide Property Name</p>
                                            :
                                                (propertyName.length < 5 && war) &&
                                                    <p className='text-danger'>* Property Name should be 5 Characters or More</p>
                                        }
                                    </div>
                                    <div className="col-3">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold">Property Type</label>
                                            <select className="form-control border border-primary" id="sector-name" defaultValue="0" 
                                                onChange={(e)=>{
                                                    setPropType(e.target.value);
                                                }}
                                            >
                                                <option value="">Select Property Type</option>
                                                <option value="hotel">Hotel</option>
                                                <option value="apartment">Apartment</option>
                                                <option value="guest-house">Guest House</option>
                                                <option value="cottage">Cottage</option>
                                                <option value="resort">Resort</option>
                                            </select>
                                        </div>
                                        {
                                            (propType === '' && war) &&
                                                <p className='text-danger'>* Select Property Type</p>
                                        }
                                    </div>
                                    <div className="col-3">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold">Refundable</label>
                                            <div className='col-12 row pt-3'>
                                                <div className='col-6'>
                                                    <input
                                                        type='radio' 
                                                        className="border border-primary mr-2" 
                                                        name="refundable"
                                                        id="refundable-yes" 
                                                        checked={(vRefund) && true}
                                                        onChange={()=>setVRefund(true)}
                                                    />
                                                    <label htmlFor='refundable-yes'>Yes</label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type='radio' 
                                                        className="border border-primary mr-2" 
                                                        name="refundable"
                                                        id="refundable-no" 
                                                        checked={(!vRefund) && true}
                                                        onChange={()=>setVRefund(false)}
                                                    />
                                                    <label htmlFor='refundable-no'>No</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="sector-name">City Name</label>
                                            <select className="form-control border border-primary" id="sector-name" defaultValue="0" 
                                                onChange={(e)=>{
                                                    setSectorId(e.target.value);
                                                }}
                                            >
                                                <option value="0">Select City</option>
                                                {
                                                    (sectors && sectors.length > 0) &&
                                                        sectors.map((sector)=>{
                                                            if(sector.status === 'Active' && sector.areas.length > 0)
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
                                        {
                                            ((Number(sectorId) === 0 || sectorId === '0') && war) &&
                                                <p className='text-danger'>* Select City</p>
                                        }
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="sector-name">Area Name</label>
                                            {
                                                (sectorId === 0 || sectorId === '0') ?
                                                    <h5 className='my-auto form-control'>Select City First</h5>
                                                :
                                                    <select className="form-control border border-primary" id="sector-name" defaultValue="0" 
                                                        onChange={(e)=>{
                                                            setAreaId(e.target.value);
                                                        }}
                                                    >
                                                        <option value="0">Select Area</option>
                                                        {
                                                            (sectors && sectors.length > 0) &&
                                                                sectors.map((sector)=>{
                                                                    if(sector.status === 'Active' && Number(sector.sector_id) === Number(sectorId) && sector.areas.length > 0)
                                                                    {
                                                                        return sector.areas.map((area)=>{
                                                                            return <option value={area.id} key={area.id}>{area.area_name}</option>
                                                                        })
                                                                        
                                                                    }
                                                                    else
                                                                    {
                                                                        return ''
                                                                    }
                                                                })
                                                        }
                                                    </select>
                                            }
                                        </div>
                                        {
                                            ((Number(areaId) === 0 || areaId === '0') && war) &&
                                                <p className='text-danger'>* Select Area</p>
                                        }
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="complimentaries">Complimentaries (Multiple Select)</label>
                                            <Select  
                                                id="complimentaries"
                                                options={complimentaries} 
                                                isMulti={true}
                                                onChange={(e)=>multiselect(e, 'complimentaries')}
                                                className='border border-primary rounded'
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="amenities">Amenities (Multiple Select)</label>
                                            <Select  
                                                id="amenities"
                                                options={amenities} 
                                                isMulti={true}
                                                onChange={(e)=>multiselect(e, 'amenities')}
                                                className='border border-primary rounded'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="property-rooms">Total Rooms</label>
                                            <input 
                                                type="number" 
                                                className="form-control border border-primary remove-input-number-arrows" 
                                                id="property-rooms" 
                                                placeholder='Enter Total Rooms'
                                                onChange={(e)=>{
                                                    setRoomQuant(Number(e.target.value));
                                                }}
                                            />
                                        </div>
                                        {
                                            (Number(roomQuant) === 0 && war) &&
                                                <p className='text-danger'>* Provide Total Rooms</p>
                                        }
                                    </div>
                                    <div className="col-3">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="vendor-rating">Vendor Rating</label>
                                            <span id="vendor-rating" className='pt-2'>
                                                <Rating
                                                    onClick={ratingChanged}
                                                    size={20}
                                                    emptyIcon={<i className="far fa-star"/>}
                                                    fullIcon={<i className="fa fa-star" style={{color: "#ffd700"}}/>}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="property-address">Property Address</label>
                                            <input
                                                type='text' 
                                                className="form-control border border-primary" 
                                                id="property-address" 
                                                placeholder='Enter Property Address'
                                                onChange={(e)=>{
                                                    setPropAddress(e.target.value);
                                                }}
                                            />
                                        </div>
                                        {
                                            ((propAddress === '' || propAddress.length === 0) && war) &&
                                                <p className='text-danger'>* Provide Property Address</p>
                                        }
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="property-location">Property Location Link</label>
                                            <input
                                                type='text' 
                                                className="form-control border border-primary" 
                                                id="property-location" 
                                                placeholder='Enter Property Location iFrame Link from Google Maps'
                                                onChange={(e)=>{
                                                    setPropLocation(e.target.value);
                                                }}
                                            />
                                        </div>
                                        {
                                            ((propLocation === '' || propLocation.length === 0) && war) ?
                                                <p className='text-danger'>* Provide Property Location Link</p>
                                            :
                                                ((propLocation.length < 5 || propLocation.indexOf('http') === -1) && war) &&
                                                    <p className='text-danger'>* Provide Valid Property Location Link</p>
                                        }
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <div className="d-flex flex-column text-left">
                                            <label className="font-weight-bold" htmlFor="property-description">Property Description</label>
                                            <CKEditor
                                                editor={ ClassicEditor }
                                                onChange={ ( event, editor ) => {
                                                    const data = editor.getData();
                                                    setPropDescription(data);
                                                } }
                                            />
                                        </div>
                                        {
                                            (propDescription.length === 0 && war) ?
                                                <p className='text-danger'>* Provide Property Description</p>
                                            :
                                                (propDescription.length < 5 && war) &&
                                                    <p className='text-danger'>* Property Description should have 5 Characters or More</p>
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
                                            <label className="font-weight-bold" htmlFor='images-input'>Vendor Images</label>
                                            <input 
                                                type='file' 
                                                id='images-input' 
                                                className='form-control border border-primary' 
                                                onChange={(e)=>{
                                                    listen(e);
                                                }} 
                                                accept='image/*' 
                                                multiple 
                                            />
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
                                        className='submit-btn'
                                        variant="primary" 
                                        onClick={()=>{setVID(0); setSubmitAddVendor(true); setLoader(!loader);}}
                                        disabled={(disBtn) && true}
                                    > Submit </Button>
                                </div>
                            </div>
                        </div>
                    :
                        <div className="d-flex flex-column text-center plane-loader">
                            <Plane secondaryColor='#378edd' color="#378edd" />
                            <h3>Please Wait... We are Adding New Vendor</h3>
                        </div>
                }
            </Modal.Body>
        </Modal>
    );
}