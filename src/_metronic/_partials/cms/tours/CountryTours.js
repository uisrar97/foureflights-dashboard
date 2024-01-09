import React, { useState, useEffect } from 'react';
import { Table,TableBody,TableCell,TablePagination,TableRow,Paper } from '@material-ui/core';
import { ShowAlert, AuthFunction, AuthUserData, InnerRightsFilter, stableSort, getSorting, EnhancedTableHead, 
    EnhancedTableToolbar, useStyles } from '../../../_helpers/HelperFunctions';

const headRows = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Sr. #', align: 'left' },
    { id: 'tour_title', numeric: false, disablePadding: false, label: 'Tour Title' },
    { id: 'tour_status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
];

export default function CountryTours({ selectedCountry, clear })
{
    console.log(selectedCountry)
    const classes = useStyles();
    const options = AuthFunction();
    const userData = AuthUserData();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [sFilter, setSFilter] = useState('');

    let rows = [];

    if(selectedCountry && selectedCountry.tours.length > 0)
    {
        rows = selectedCountry.tours;
    }

    const handleSearch = (event) => {
        setSFilter(event.target.value);
    }

    const handleEditShow = (data) => {
        console.log('Edit Data: ', data);
    }

    const deleteTour = (data) => {
        console.log('Tour Deleted: ', data)
    }

    const filterFunction = () => {
        rows = rows.filter(row => {
            return (
                (row.region_name.toLowerCase().includes(sFilter.toLowerCase())) &&
                    row
            )
        }).map(filteredData => { return filteredData })
    }

    function handleChangePage(event, newPage)
    {
        setPage(newPage);
    }
    
    function handleChangeRowsPerPage(event)
    {
        setRowsPerPage(+event.target.value);
    }

    function handleRequestSort(event, property)
    {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar title={`${selectedCountry.region_name} Tours`} />
                <div className={classes.tableWrapper}>
                    <div className="d-flex flex-row justify-content-end">
                        <div className='col-6'>
                            <div className="col-3 float-left">
                                <a className="form-control border-primary text-success text-center" onClick={()=>{clear()}} > Go Back</a>
                            </div>
                        </div>
                        <div className='col-6 row m-0'>
                            <div className="col-6">
                                <input type="search" className="form-control border-primary border-1" id='sBox' name="sBox" onChange={(e) => handleSearch(e)} placeholder="Search" />
                            </div>
                            {
                                (InnerRightsFilter('tours', userData)) &&
                                    <div className="col-6">
                                        <button className="form-control border-primary border-1 btn btn-primary" >Add Tour</button>
                                    </div>
                            }
                        </div>
                        
                        
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
                                stableSort(rows, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <TableRow hover tabIndex={-1} key={row.id} >
                                                <TableCell component="th" id={labelId} scope="row" >{index+1}</TableCell>
                                                <TableCell align="left">{row.title}</TableCell>
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
                                                        // onClick={() => {
                                                        //     if (row.status === 'Active') {
                                                        //         setAreaStatus('Inactive');
                                                        //     }
                                                        //     else if (row.status === 'Inactive') {
                                                        //         setAreaStatus('Active');
                                                        //     }
                                                        //     setAID(row.dID);
                                                        //     setUpdateStatus(true);
                                                        // }}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <i className="fas fa-edit cursor-pointer mr-2" onClick={() => { handleEditShow(row) }} />
                                                    <i className="fas fa-trash cursor-pointer" onClick={() => { deleteTour(row.dID) }}/>
                                                    {/* <button className="border-primary border-1 btn btn-primary" >Select Tour</button> */}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                            }
                            {emptyRows > 0 && (
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
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    )
}