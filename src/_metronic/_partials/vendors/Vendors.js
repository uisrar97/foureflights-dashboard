import React, { useState, useEffect, useCallback  } from 'react';
import Axios from '../../../app/service';
import {Table,TableBody,TableCell,TablePagination,TableRow,Paper} from '@material-ui/core';
import AddVendor from './AddVendor';
import EditVendor from './EditVendor';
import ViewVendor from './ViewVendor';
import SweetAlert from 'sweetalert2';
import { ShowAlertVendor, ShowAlert, AuthUserData, AuthFunction, InnerRightsFilter, stableSort, getSorting, EnhancedTableHead, 
    EnhancedTableToolbar, useStyles } from '../../_helpers/HelperFunctions';
  
const headRows = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Sr. #', align: 'left' },
    { id: 'property_full_name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'contact', numeric: false, disablePadding: false, label: 'Vendor Contact #' },
    { id: 'sector', numeric: false, disablePadding: false, label: 'Sector' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Action', align: 'left' },
];
    
export function Vendors({vendors, sectors, fetchvendors, setVendorsLoader})
{
    // Datatable Variables and Functions
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    function handleRequestSort(event, property)
    {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    }
    
    function handleChangePage(event, newPage)
    {
        setPage(newPage);
    }
    
    function handleChangeRowsPerPage(event)
    {
        setRowsPerPage(+event.target.value);
    }

    // Data Variables and Functions
    const userData = AuthUserData();
    const options = AuthFunction();
    const [sFilter, setSFilter] = useState('');

    const [vendorID, setVID] = useState(0);
    const [vendorStatus, setVendorStatus] = useState('');
    const [updateStatus, setUpdateStatus] = useState(false);
    const [deleteVendor, setDeleteVendor] = useState(false);

    const [submitAddVendor, setSubmitAddVendor] = useState(false);
    const [addVendorLoader, setAddVendorLoader] = useState(false);
    const [addVendor, setAddVendor] = useState(false);

    const [submitEditVendor, setSubmitEditVendor] = useState(false);
    const [editVendor, setEditVendor] = useState(false);
    const [editVendorLoader, setEditVendorLoader] = useState(false);

    const [viewVendor, setViewVendor] = useState(false);
    const [vendorData, setVendorData] = useState({});

    const [propertyName, setPropertyName] = useState('');
    const [sectorId, setSectorId] = useState(0);
    const [areaId, setAreaId] = useState(0);
    const [compItems, setCompItems] = useState([]);
    const [amenItems, setAmenItems] = useState([]);
    const [roomQuant, setRoomQuant] = useState(0);
    const [vRefund, setVRefund] = useState(false);
    const [vendorRating, setVendorRating] = useState(0);
    const [propType, setPropType] = useState('');
    const [propAddress, setPropAddress] = useState('');
    const [propLocation, setPropLocation] = useState('');
    const [propDescription, setPropDescription] = useState('');
    const [venderContact, setVendorContact] = useState('');
    const [venderEmail, setVendorEmail] = useState('');
    const [vendorImgs, setVendorImgs] = useState([]);
    const [prevImgs, setPrevImgs] = useState([]);
    
    let rows = [];
    let count = 1;
    if (vendors.data && vendors.data.length > 0)
    {
        rows = vendors.data.map((vendor) => {
            if(userData.userId === Number(vendor.user_id) || userData.userId === Number(vendor.main_vendor) || userData.role_code === 'super-admin')
            {
                let id = count;
                let dID = vendor.id;
                let property = vendor.property_full_name;
                let contact = vendor.vendor_contact_no;
                let email = vendor.email;
                let sIndex = -1;
                let sectorName = '';
                let areaName = '';
                if(sectors && sectors.data && sectors.data.length > 0)
                {
                    sIndex = sectors.data.findIndex(sect => (sect.sector_id === vendor.sector_id && sect.status === 'Active'));
                }
                if(sIndex === -1)
                {
                    sectorName = '';
                }
                else
                {
                    sectorName = sectors.data[sIndex].sector_name;
                    areaName = sectors.data[sIndex].areas.map((area)=>{
                        if(area.id === Number(vendor.area_id))
                        {
                            return area.area_name;
                        }
                        else
                        {
                            return '';
                        }
                    });
                    areaName = areaName.filter(Boolean);
                    areaName = areaName[0];
                }
                let status = vendor.status;
                let rowData = vendor
                count++;
                return { id, dID, property, contact, email, sectorName, areaName, status, rowData };
            }
            else
            {
                return '';
            }
        });
    }

    rows = rows.filter(Boolean);
    
    const handleSearch = (event) => {
        setSFilter(event.target.value);
    }

    const filterFunction = () => {
        rows = rows.filter(row => {
            return (
                ( 
                    row.property.toLowerCase().includes(sFilter.toLowerCase()) || 
                    row.email.toLowerCase().includes(sFilter.toLowerCase()) || 
                    row.sectorName.toLowerCase().includes(sFilter.toLowerCase()) || 
                    row.contact.includes(sFilter)
                ) &&
                    row
            )
        }).map(filteredData => { return filteredData })
    }

    const handleAddShow = () => {
        setAddVendor(!addVendor);
    }

    const handleEditShow = () => {
        setEditVendor(!editVendor);
    }

    const handleVendorDelete = (id) => {
        SweetAlert.fire({
            title: 'Are you sure you want to delete this Vendor?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed)
            {
                setVID(id); 
                setVendorStatus('Deleted'); 
                setDeleteVendor(true);
            }
            else if (result.isDenied)
            {
                setDeleteVendor(false);
            }
        });
    }

    const handleViewShow = (data) => {
        if(viewVendor)
        {
            setVendorData({}); 
            setViewVendor(false);
        }
        else
        {
            setVendorData(data); 
            setViewVendor(true);
        }
        
    }

    const setEditData = (data) => {
        let complimentaries = [];
        let amenities = [];
        setVID(data.rowData.id);
        setPropertyName(data.rowData.property_full_name);
        setPropType(data.rowData.vendor_type);
        setSectorId(data.rowData.sector_id);
        if(data.rowData.refundable === 'Yes')
        {
            setVRefund(true);
        }
        else
        {
            setVRefund(false);
        }
        setAreaId(Number(data.rowData.area_id));
        data.rowData.vendor_complimentaries.map((comp)=>{
            return complimentaries.push({value: `${comp.complimentary}`, label: `${comp.complimentary}`});
        });
        setCompItems(complimentaries);
        data.rowData.vendor_amenities.map((amen)=>{
            return amenities.push({value: `${amen.amenity}`, label: `${amen.amenity}`});
        });
        setAmenItems(amenities);
        setRoomQuant(data.rowData.no_of_rooms);
        
        if(Number(data.rowData.rating) === 1)
        {
            setVendorRating(Number(20));
        }
        else if(Number(data.rowData.rating) === 2)
        {
            setVendorRating(Number(40));
        }
        else if(Number(data.rowData.rating) === 3)
        {
            setVendorRating(Number(60));
        }
        else if(Number(data.rowData.rating) === 4)
        {
            setVendorRating(Number(80));
        }
        else if(Number(data.rowData.rating) === 5)
        {
            setVendorRating(Number(100));
        }
        
        setPropAddress(data.rowData.address);
        setPropLocation(data.rowData.location);
        setPropDescription(data.rowData.description);
        setVendorContact(data.rowData.vendor_contact_no);
        setVendorEmail(data.rowData.email);
        setPrevImgs(data.rowData.vendor_images);
        handleEditShow();
    }

    const AddUpdateVendor = useCallback(async(url, data) => {
        Axios(options).post(url, data).then((response) => {
            const res = response.data;
            if (res.status && res.status === '200')
            {
                if(res.alert)
                {
                    ShowAlertVendor(res.status, res.message, res.alert);
                }
                else
                {
                    ShowAlert(res.status, res.message);
                }
                setSubmitAddVendor(false);
                setAddVendor(false);
                setAddVendorLoader(false);
                setSubmitEditVendor(false);
                setEditVendor(false);
                setEditVendorLoader(false);
                setPrevImgs([]);
                setVendorsLoader(true);
                fetchvendors();
            }
        });
    }, [options, fetchvendors, setVendorsLoader]);

    const updateVendorStatus = useCallback(async(data) => { 
        Axios({}).get(data).then((response) => {
            const res = response.data;
            if (res.status && res.status === '200')
            {
                ShowAlert(res.status, res.message);
                setDeleteVendor(false);
                setUpdateStatus(false);
                setVendorStatus('');
                setVID(-1);
                setVendorsLoader(true);
                fetchvendors();
            }
        });
    }, [fetchvendors, setVendorsLoader]);
    
    useEffect(() => {
        if(updateStatus || deleteVendor)
        {
            const req = `admin/updatevendorstatus/${vendorID}?status=${vendorStatus}`;
            updateVendorStatus(req);
        }
        if(submitAddVendor || submitEditVendor)
        {
            const url = `admin/addvendor`;
            const formData = new FormData();
            formData.append('vendor_id', `${vendorID}` );
            formData.append('property_full_name', propertyName );
            formData.append('address', `${propAddress.replaceAll('،', ',')}` );
            formData.append('location', `${propLocation}`);
            formData.append('area', `${areaId}`);
            formData.append('vendor_type', `${propType}`);
            if (vRefund)
            {
                formData.append('refundable', 'Yes' );
            }
            else if (!vRefund)
            {
                formData.append('refundable', 'No' );
            }
            formData.append('vendor_description', propDescription );
            formData.append('no_of_rooms', roomQuant );
            formData.append('email', venderEmail );
            formData.append('vendor_contact_no', venderContact );
            formData.append('sector_id', sectorId );

            if(Number(vendorRating) === 20)
            {
                formData.append('rating', Number(1) );
            }
            else if(Number(vendorRating) === 40)
            {
                formData.append('rating', Number(2) );
            }
            else if(Number(vendorRating) === 60)
            {
                formData.append('rating', Number(3) );
            }
            else if(Number(vendorRating) === 80)
            {
                formData.append('rating', Number(4) );
            }
            else if(Number(vendorRating) === 100)
            {
                formData.append('rating', Number(5) );
            }
            else
            {
                formData.append('rating', Number(0) );
            }

            formData.append('amenities', JSON.stringify(amenItems) );
            formData.append('complimentaries', JSON.stringify(compItems) );
            
            if (vendorImgs.length > 0)
            {
                vendorImgs.map((img)=>{
                    return formData.append('vendor_images[]', img);
                })
            }
            else
            {
                formData.append('vendor_images[]', []);
            }
            AddUpdateVendor(url, formData);
        }
    }, [vendorID, vendorStatus, updateStatus, deleteVendor, updateVendorStatus, submitAddVendor, propertyName, propAddress, propDescription, 
        roomQuant, venderEmail, venderContact, sectorId, vendorRating, amenItems, compItems, vendorImgs, submitEditVendor, AddUpdateVendor,
        propLocation, areaId, propType, vRefund])

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar title="Vendor" />
                <div className={classes.tableWrapper}>
                    <div className="d-flex flex-row justify-content-end">
                        <div className="col-3 float-right">
                            <input type="search" className="form-control border-primary border-1" id='sBox' name="sBox" 
                            onChange={(e) => handleSearch(e)} placeholder="Search" />
                        </div>
                        {
                            (InnerRightsFilter('add-vendor', userData)) &&
                                <div className="col-3 float-right">
                                    <button className="form-control border-primary border-1 btn btn-primary" onClick={()=>{handleAddShow()}}>Add Vendor</button>
                                </div>
                        }
                    </div>
                </div>
                {
                    (sFilter !== '') &&
                        filterFunction()
                }
                <div className={classes.tableWrapper}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='medium'
                    >
                        <EnhancedTableHead 
                            order={order} 
                            orderBy={orderBy} 
                            onRequestSort={handleRequestSort} 
                            
                            headRows={headRows}
                        />
                        <TableBody>
                        {
                            stableSort(rows, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow hover tabIndex={-1} key={row.id} >
                                            <TableCell component="th" id={labelId} scope="row" >{row.id}</TableCell>
                                            <TableCell align="left">{row.property}</TableCell>
                                            <TableCell align="left">{row.contact}</TableCell>
                                            <TableCell align="left">{row.sectorName}</TableCell>
                                            <TableCell align="left">
                                                <span
                                                    className=
                                                    {
                                                        (row.status === 'Active') ?
                                                            'badge badge-success cursor-pointer'
                                                        :
                                                            (row.status === 'Inactive') ?
                                                                'badge badge-warning cursor-pointer'
                                                            :
                                                                'badge badge-danger cursor-pointer'
                                                    }
                                                    onClick={()=>{
                                                        if(row.status === 'Active')
                                                        {
                                                            setVendorStatus('Inactive');
                                                        }
                                                        else if(row.status === 'Inactive')
                                                        {
                                                            setVendorStatus('Active');
                                                        }
                                                        setVID(row.dID);
                                                        setUpdateStatus(true);
                                                    }}
                                                >
                                                    {row.status}
                                                </span>
                                            </TableCell>
                                            <TableCell align="left">
                                                <>
                                                    {
                                                        (InnerRightsFilter('view-vendor', userData)) &&
                                                            <i className="fas fa-eye cursor-pointer mr-2" onClick={()=>{ handleViewShow(row) }} />
                                                    }
                                                    {
                                                        (InnerRightsFilter('edit-vendor', userData)) &&
                                                            <i className="fas fa-edit cursor-pointer mr-2" onClick={() => { setEditData(row) }} />
                                                    }
                                                    {
                                                        (InnerRightsFilter('delete-vendor', userData)) &&
                                                            <i className="fas fa-trash cursor-pointer" onClick={() => { handleVendorDelete(row.dID) }}/>
                                                    }
                                                </>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                        }
                        {
                            (addVendor) &&
                                <AddVendor
                                    showModal = {addVendor}
                                    handleShow = {handleAddShow}
                                    sectors = {sectors.data}
                                    loader = {addVendorLoader}
                                    setLoader = {setAddVendorLoader}
                                    setVID = {setVID}
                                    propertyName = {propertyName}
                                    setPropertyName = {setPropertyName}
                                    sectorId = {sectorId}
                                    setSectorId = {setSectorId}
                                    areaId = {areaId}
                                    setAreaId = {setAreaId}
                                    setCompItems = {setCompItems}
                                    setAmenItems = {setAmenItems}
                                    roomQuant = {roomQuant}
                                    setRoomQuant = {setRoomQuant}
                                    vRefund = {vRefund}
                                    setVRefund = {setVRefund}
                                    vendorRating = {vendorRating}
                                    setVendorRating = {setVendorRating}
                                    propType = {propType}
                                    setPropType = {setPropType}
                                    propAddress = {propAddress}
                                    setPropAddress = {setPropAddress}
                                    propLocation = {propLocation}
                                    setPropLocation = {setPropLocation}
                                    propDescription = {propDescription}
                                    setPropDescription = {setPropDescription}
                                    venderContact = {venderContact}
                                    setVendorContact = {setVendorContact}
                                    venderEmail = {venderEmail}
                                    setVendorEmail = {setVendorEmail}
                                    vendorImgs = {vendorImgs}
                                    setVendorImgs = {setVendorImgs}
                                    setSubmitAddVendor = {setSubmitAddVendor}
                                />
                        }
                        {
                            (editVendor) &&
                                <EditVendor
                                    showModal = {editVendor}
                                    handleShow = {handleEditShow}
                                    sectors = {sectors.data}
                                    loader = {editVendorLoader}
                                    setLoader = {setEditVendorLoader}
                                    propertyName = {propertyName}
                                    setPropertyName = {setPropertyName}
                                    sectorId = {sectorId}
                                    setSectorId = {setSectorId}
                                    areaId = {areaId}
                                    setAreaId = {setAreaId}
                                    propType = {propType}
                                    setPropType = {setPropType}
                                    vRefund = {vRefund}
                                    setVRefund = {setVRefund}
                                    compItems = {compItems}
                                    setCompItems = {setCompItems}
                                    amenItems = {amenItems}
                                    setAmenItems = {setAmenItems}
                                    roomQuant = {roomQuant}
                                    setRoomQuant = {setRoomQuant}
                                    vendorRating = {vendorRating}
                                    setVendorRating = {setVendorRating}
                                    propAddress = {propAddress}
                                    setPropAddress = {setPropAddress}
                                    propLocation = {propLocation}
                                    setPropLocation = {setPropLocation}
                                    propDescription = {propDescription}
                                    setPropDescription = {setPropDescription}
                                    venderContact = {venderContact}
                                    setVendorContact = {setVendorContact}
                                    venderEmail = {venderEmail}
                                    setVendorEmail = {setVendorEmail}
                                    vendorImgs = {vendorImgs}
                                    setVendorImgs = {setVendorImgs}
                                    prevImgs = {prevImgs}
                                    setPrevImgs = {setPrevImgs}
                                    setVendorsLoader = {setVendorsLoader}
                                    setSubmitEditVendor = {setSubmitEditVendor}
                                />
                        }
                        {
                            (viewVendor) &&
                                <ViewVendor
                                    showModal = {viewVendor}
                                    handleShow = {handleViewShow}
                                    data = {vendorData}
                                />
                        }
                        {
                            emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                    nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}