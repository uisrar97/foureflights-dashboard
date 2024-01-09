import React, { useState, useEffect } from 'react';
import { TablePagination, Paper } from '@material-ui/core';
import CountryTours from './CountryTours';
import { ShowAlert, AuthFunction, AuthUserData, InnerRightsFilter, EnhancedTableToolbar, useStyles } from '../../../_helpers/HelperFunctions';

export function Tours({ tours })
{
    const classes = useStyles();
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [page, setPage] = useState(0);
    const [sFilter, setSFilter] = useState('');

    const [selectedCountry, setSelectedCounry] = useState({});
    const [showTours, setShowTours] = useState(false);


    let rows = [];

    if (tours && tours.length > 0)
    {
        rows = tours;
    }

    const handleSearch = (event) => {
        setSFilter(event.target.value);
    }

    const handleCountrySelect = (data) => {
        setSelectedCounry(data);
        setShowTours(true);
    }
    const clear = () => {
        setSelectedCounry({});
        setShowTours(false);
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

    return (
        <div className={classes.root}>
            {
                (!showTours) ?
                    <Paper className={classes.paper}>
                        <EnhancedTableToolbar title="Destination Countries" />
                        <div className={classes.tableWrapper}>
                            <div className="d-flex flex-row justify-content-end">
                                <div className="col-3 float-right">
                                    <input type="search" className="form-control border-primary border-1" id='sBox' name="sBox" onChange={(e) => handleSearch(e)} placeholder="Search" />
                                </div>
                            </div>
                        </div>
                        {
                            (sFilter !== '') &&
                                filterFunction()
                        }
                        <div className='mt-10'>
                            {
                                (rows.length > 0) ?
                                    <div className='row row-cols-1 row-cols-md-3 mx-3'>
                                    {
                                        rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index)=>{
                                            return(
                                                <div className="col mb-4" key={index}>
                                                    <div className="card border border-primary country-tour-card" onClick={()=>{handleCountrySelect(row)}}>
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title m-0">{row.region_name}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                :
                                    <div className='row'>
                                        <div className='col-md-12 text-center '>
                                            <h2 className='text-primary'>No Result Found.</h2>
                                        </div>
                                        
                                    </div>
                            }
                        </div>
                        <TablePagination
                            rowsPerPageOptions={[4, 12, 24]}
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
                :
                    <CountryTours selectedCountry={selectedCountry} clear={clear} />
            }
        </div>
    );
}