import React, { useState, useEffect, useCallback  } from 'react';
import Axios from '../../../app/service';
import {Table,TableBody,TableCell,TablePagination,TableRow,Paper} from '@material-ui/core';





import AddRoom from './AddRoom';
import EditRoom from './EditRoom';
import ViewRoom from './ViewRoom';
import SweetAlert from 'sweetalert2';
import { ShowAlert, AuthUserData, AuthFunction, InnerRightsFilter, stableSort, getSorting, EnhancedTableHead, 
    EnhancedTableToolbar, useStyles } from '../../_helpers/HelperFunctions';

const headRows = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Sr. #', align: 'left' },
    { id: 'room_title', numeric: false, disablePadding: false, label: 'Room Name' },
    { id: 'hotel_name', numeric: false, disablePadding: false, label: 'Hotel Name' },
    { id: 'price', numeric: true, disablePadding: false, label: 'Price (Per Night)' },
    { id: 'refundable', numeric: false, disablePadding: false, label: 'Refundable' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Action', align: 'left' },
];

export function Rooms({rooms, fetchrooms, totalRooms, totalOccuRooms, setRoomsLoader})
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
    let rows = [];
    const counter = ((totalRooms-totalOccuRooms) >= 0 ) ? totalRooms-totalOccuRooms : 0;
    
    const [sFilter, setSFilter] = useState('');
    const [addRoom, setAddRoom] = useState(false);
    const [addRoomLoader, setAddRoomLoader] = useState(false);
    const [submitAddRoom, setSubmitAddRoom] = useState(false);

    const [editRoom, setEditRoom] = useState(false);
    const [editRoomLoader, setEditRoomLoader] = useState(false);
    const [submitEditRoom, setSubmitEditRoom] = useState(false);

    const [roomStatus, setRoomStatus] = useState('');
    const [updateStatus, setUpdateStatus] = useState(false);
    const [deleteRoom, setDeleteRoom] = useState(false);

    const [viewRoom, setViewRoom] = useState(false);
    const [roomData, setRoomData] = useState({});

    const [rID, setRID] = useState(-1);
    const [rTitle, setRTitle] = useState('');
    const [rCount, setRCount] = useState(0);
    const [rBedType, setRBedType] = useState('');
    const [rBedQuant, setRBedQuant] = useState('');
    const [rNumAdults, setRNumAdults] = useState(0);
    const [rNumChilds, setRNumChilds] = useState(0);
    const [rPrice, setRPrice] = useState(0);
    const [rRefund, setRRefund] = useState(false);
    const [rDesc, setRDesc] = useState('');
    const [rImgs, setRImgs] = useState([]);
    const [prevImgs, setPrevImgs] = useState([]);
    const [countLimit, setCountLimit] = useState(0);

    if(rooms.data && rooms.data.length > 0)
    {
        rows = rooms.data.map((room)=>{
            let id = room.id;
            let rTitle = room.title;
            let hotel = room.vendor_property_name;
            let price = room.one_night_price;
            let rRefundable = room.refundable;
            let status = room.status;
            let obj = room;

            return {id, rTitle, hotel, price, rRefundable, status, obj};
        });
    }

    const handleAddShow = () => {
        setAddRoom(!addRoom);
    }

    const handleEditShow = () => {
        setEditRoom(!editRoom);
    }

    const setEditData = (data) => {
        setRID(data.id);
        setRTitle(data.title);
        setRCount(data.room_quantity);
        setRBedType(data.bed_type);
        setRBedQuant(data.no_of_beds);
        setRNumAdults(data.no_of_adults);
        setRNumChilds(data.no_of_childs);
        setRPrice(data.one_night_price);
        if(data.refundable === "Yes")
        {
            setRRefund(true);
        }
        else if (data.refundable === "No")
        {
            setRRefund(false);
        }
        setRDesc(data.description);
        setPrevImgs(data.room_images);
        handleEditShow();
    }

    const handleViewShow = (data) => {
        if(viewRoom)
        {
            setViewRoom(false);
        }
        else
        {
            setViewRoom(true);
            setRoomData(data);
        }
    }

    const deleteRoomReq = (id) => {
        SweetAlert.fire({
            title: 'Are you sure you want to delete this Room?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed)
            {
                setRID(id); 
                setRoomStatus('Deleted'); 
                setDeleteRoom(true);
            }
            else if (result.isDenied)
            {
                setDeleteRoom(false);
            }
        });
    }

    const filterFunction = () => {
        rows = rows.filter(row => {
            return (
                (
                    row.rTitle.toLowerCase().includes(sFilter.toLowerCase()) || 
                    row.hotel.toLowerCase().includes(sFilter.toLowerCase())
                ) &&
                    row
            )
        }).map(filteredData => { return filteredData })
    }
    
    const decreaseCount = (type) => {
        if(type === 'room-quantity')
        {
            if (Number(rCount) > 0)
            {
                let count = Number(rCount);
                count -= 1;
                setRCount(count);
            }
        }
        if(type === 'num-adults')
        {
            if (Number(rNumAdults) > 0)
            {
                let count = Number(rNumAdults);
                count -= 1;
                setRNumAdults(count);
            }
        }
        if(type === 'num-childs')
        {
            if (Number(rNumChilds) > 0)
            {
                let count = Number(rNumChilds);
                count -= 1;
                setRNumChilds(count);
            }
        }
    }

    const increaseCount = (type) => {
        if(type === 'room-quantity')
        {
            if (Number(rCount) < Number(countLimit))
            {
                if((Number(rCount) + 1 ) < (Number(rCount) + Number(countLimit)))
                {
                    let count = Number(rCount);
                    let limit = Number(countLimit);
                    count += 1;
                    limit -= 1;
                    setRCount(count);
                    setCountLimit(limit);
                }
            }
            else if (Number(rCount) >= Number(countLimit))
            {
                if(( Number(rCount) + 1  ) <= (Number(rCount) + Number(countLimit)))
                {
                    let count = Number(rCount);
                    let limit = Number(countLimit);
                    count += 1;
                    limit -= 1;
                    setRCount(count);
                    setCountLimit(limit);
                }
            }
        }
        if(type === 'num-adults')
        {
            if (Number(rNumAdults) < 5)
            {
                let count = Number(rNumAdults);
                count += 1;
                setRNumAdults(count);
            }
        }
        if(type === 'num-childs')
        {
            if (Number(rNumChilds) < 5)
            {
                let count = Number(rNumChilds);
                count += 1;
                setRNumChilds(count);
            }
        }
    }
    
    const manualComm = (event, type) => {
        // if(type === 'room-quantity')
        // {
        //     if(Number(event.target.value) < 20)
        //     {
        //         setRCount(Number(event.target.value));
        //     }
        // }
        if(type === 'num-adults')
        {
            if(Number(event.target.value) < 5)
            {
                setRNumAdults(Number(event.target.value));
            }
        }
        if(type === 'num-childs')
        {
            if(Number(event.target.value) < 5)
            {
                setRNumChilds(Number(event.target.value));
            }
        }
    }

    const AddUpdateRoom = useCallback(async(url, data) => {
        Axios(options).post(url, data).then((response) => {
            const res = response.data;
            if (res.status && res.status === '200')
            {
                ShowAlert(res.status, res.message);
                setSubmitAddRoom(false);
                setAddRoom(false);
                setAddRoomLoader(false);
                setSubmitEditRoom(false);
                setEditRoom(false);
                setEditRoomLoader(false);
                setRID(-1);
                setRCount(0);
                setRNumAdults(0);
                setRNumChilds(0);
                setRPrice(0);
                setRImgs([]);
                setPrevImgs([]);
                setRoomsLoader(true);
                fetchrooms();
            }
        });
    }, [options, fetchrooms, setRoomsLoader]);

    const updateRoomStatus = useCallback(async(data) => { 
        Axios({}).get(data).then((response) => {
            const res = response.data;
            if (res.status && res.status === '200')
            {
                ShowAlert(res.status, res.message);
                setDeleteRoom(false);
                setUpdateStatus(false);
                setRoomStatus('');
                setRID(-1);
                setRoomsLoader(true);
                fetchrooms();
            }
        });
    }, [fetchrooms, setRoomsLoader]);
    
    useEffect(() => {
        if(submitAddRoom || submitEditRoom)
        {
            const url = 'admin/addroom';

            const formData = new FormData();
            formData.append('room_id', `${rID}` );
            formData.append('title', rTitle );
            formData.append('room_quantity', rCount );
            formData.append('bed_type', rBedType );
            formData.append('no_of_beds', rBedQuant );
            formData.append('no_of_adults', rNumAdults );
            formData.append('no_of_childs', rNumChilds );
            if (rRefund)
            {
                formData.append('refundable', 'Yes' );
            }
            else if (!rRefund)
            {
                formData.append('refundable', 'No' );
            }
            formData.append('one_night_price', rPrice );
            formData.append('room_description', rDesc );            
            if (rImgs.length > 0)
            {
                rImgs.map((img)=>{
                    return formData.append('room_images[]', img);
                })
            }
            else
            {
                formData.append('room_images[]', []);
            }
            
            AddUpdateRoom(url, formData);
        }
        if(updateStatus || deleteRoom)
        {
            const req = `admin/updateroomstatus/${rID}?status=${roomStatus}`;
            updateRoomStatus(req);
        }
    }, [submitAddRoom, submitEditRoom, rID, rTitle, rCount, rBedType, rBedQuant, rNumAdults, rNumChilds, rRefund, rPrice, 
        rDesc, rImgs, updateStatus, deleteRoom, roomStatus, updateRoomStatus, AddUpdateRoom]);


    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar title="Rooms" />
                <div className={classes.tableWrapper}>
                    <div className="d-flex flex-row justify-content-end">
                        <div className="col-3 float-right">
                            <input type="search" className="form-control border-primary border-1" id='sBox' name="sBox" 
                            onChange={(e) => setSFilter(e.target.value)} placeholder="Search" />
                        </div>
                        {
                            (totalOccuRooms < totalRooms || (totalRooms !== 0 && totalOccuRooms === 0)) &&
                                (InnerRightsFilter('add-rooms', userData)) &&
                                    <div className="col-3 float-right">
                                        <button className="form-control border-primary border-1 btn btn-primary" onClick={()=>{setCountLimit(counter) ; handleAddShow()}}>Add Room</button>
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
                                    const num = index+1;
                                    return (
                                        <TableRow hover tabIndex={-1} key={index} >
                                            <TableCell component="th" id={labelId} scope="row" >{num}</TableCell>
                                            <TableCell align="left">{row.rTitle}</TableCell>
                                            <TableCell align="left">{row.hotel}</TableCell>
                                            <TableCell align="left">{`PKR ${row.price}`}</TableCell>
                                            <TableCell align="left">{row.rRefundable}</TableCell>
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
                                                            setRoomStatus('Inactive');
                                                        }
                                                        else if(row.status === 'Inactive')
                                                        {
                                                            setRoomStatus('Active');
                                                        }
                                                        setRID(row.id);
                                                        setUpdateStatus(true);
                                                    }}
                                                >
                                                    {row.status}
                                                </span>
                                            </TableCell>
                                            <TableCell align="left">
                                                <>
                                                    {
                                                        (InnerRightsFilter('view-rooms', userData)) &&
                                                            <i className="fas fa-eye cursor-pointer mr-2" onClick={()=>{setCountLimit(counter); handleViewShow(row.obj); }} />
                                                    }
                                                    {
                                                        (InnerRightsFilter('edit-rooms', userData)) &&
                                                            <i className="fas fa-edit cursor-pointer mr-2" onClick={() => {setCountLimit(counter); setEditData(row.obj); }} />
                                                    }
                                                    {
                                                        (InnerRightsFilter('delete-rooms', userData)) &&
                                                            <i className="fas fa-trash cursor-pointer" onClick={() => { deleteRoomReq(row.id); }}/>
                                                    }
                                                </>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                        }
                        {
                            (addRoom) &&
                                <AddRoom
                                    showModal = {addRoom}
                                    handleShow = {handleAddShow}
                                    loader = {addRoomLoader}
                                    setLoader = {setAddRoomLoader}
                                    setRID = {setRID}
                                    rTitle = {rTitle}
                                    setRTitle = {setRTitle}
                                    rCount = {rCount}
                                    rBedType = {rBedType}
                                    setRBedType = {setRBedType}
                                    rBedQuant = {rBedQuant}
                                    setRBedQuant = {setRBedQuant}
                                    rNumAdults = {rNumAdults}
                                    rNumChilds = {rNumChilds}
                                    rPrice = {rPrice}
                                    setRPrice = {setRPrice}
                                    rRefund = {rRefund}
                                    setRRefund = {setRRefund}
                                    rDesc = {rDesc}
                                    setRDesc = {setRDesc}
                                    rImgs = {rImgs}
                                    setRImgs = {setRImgs}
                                    decreaseCount = {decreaseCount}
                                    increaseCount = {increaseCount}
                                    manualComm = {manualComm}
                                    setSubmitAddRoom = {setSubmitAddRoom}
                                />
                        }
                        {
                            (editRoom) &&
                                <EditRoom
                                    showModal = {editRoom}
                                    handleShow = {handleEditShow}
                                    loader = {editRoomLoader}
                                    setLoader = {setEditRoomLoader}
                                    rTitle = {rTitle}
                                    setRTitle = {setRTitle}
                                    rCount = {rCount}
                                    rBedType = {rBedType}
                                    setRBedType = {setRBedType}
                                    rBedQuant = {rBedQuant}
                                    setRBedQuant = {setRBedQuant}
                                    rNumAdults = {rNumAdults}
                                    rNumChilds = {rNumChilds}
                                    rPrice = {rPrice}
                                    setRPrice = {setRPrice}
                                    rRefund = {rRefund}
                                    setRRefund = {setRRefund}
                                    rDesc = {rDesc}
                                    setRDesc = {setRDesc}
                                    rImgs = {rImgs}
                                    setRImgs = {setRImgs}
                                    prevImgs = {prevImgs}
                                    setPrevImgs = {setPrevImgs}
                                    decreaseCount = {decreaseCount}
                                    increaseCount = {increaseCount}
                                    manualComm = {manualComm}
                                    setSubmitEditRoom = {setSubmitEditRoom}
                                />
                        }
                        {
                            (viewRoom) &&
                                <ViewRoom
                                    showModal = {viewRoom}
                                    handleShow = {handleViewShow}
                                    data = {roomData}
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