import React, { useState, useEffect, useCallback  } from 'react';
import Axios from '../../../../app/service';
import {Table,TableBody,TableCell,TablePagination,TableRow,Paper} from '@material-ui/core';





import AddSector from './AddSector';
import EditSector from './EditSector';
import { ShowAlert, AuthFunction, AuthUserData, InnerRightsFilter, stableSort, getSorting, EnhancedTableHead, 
  EnhancedTableToolbar, useStyles } from '../../../_helpers/HelperFunctions';

const headRows = [
  { id: 'id', numeric: false, disablePadding: false, label: 'Sr. #', align: 'left' },
  { id: 'sector_name', numeric: false, disablePadding: false, label: 'City Name' },
  { id: 'region_name', numeric: false, disablePadding: false, label: 'Country Name' },
  { id: 'sector_status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Action', align: 'left' },
];

export function Cities({ sectors, regions, fetchcities })
{
  const options = AuthFunction();
  const userData = AuthUserData();
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [addSector, setAddSector] = useState(false);
  const [addLoader, setAddLoader] = useState(false);
  const [sectorData, setSectorData] = useState({});
  const [editSector, setEditSector] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [sFilter, setSFilter] = useState('');

  let sectorName = '';
  let sector = '';

  const [finalSectorName, setFinalSectorName] = useState('');
  const [sectorAdd, setSectorAdd] = useState(false);
  const [sectorUpdate, setSectorUpdate] = useState(false);
  const [sectorDelete, setSectorDelete] = useState(false);
  const [sID, setSID] = useState(0);
  const [regionID, setRegionID] = useState(0);
  const [sectorStatus, setSectorStatus] = useState('');
  const [updateStatus, setUpdateStatus] = useState(false);

  const addUpdateSector = useCallback(async(request) => { 
    Axios(options).get(request).then((response) => {
        const res = response.data;
        ShowAlert(res.status, res.message);
        setSectorAdd(false);
        setSectorUpdate(false);
        setAddSector(false);
        setAddLoader(false);
        setEditSector(false);
        setEditLoader(false);
        setSID(0);
        setRegionID(0);
        fetchcities();
    });
  }, [fetchcities, options]);

  const deleteSectorAPI = useCallback(async(data) => { 
    Axios(options).get(data).then((response) => {
        const res = response.data;
        if (res.status && res.status === '200')
        {
          ShowAlert(res.status, res.message);
          setSectorDelete(false);
          setUpdateStatus(false);
          setSectorStatus('');
          setSID(0);
          fetchcities();
        }
    });
  }, [fetchcities, options]);

  useEffect(() => {
    if(sectorAdd || sectorUpdate)
    {
      const req = `admin/addsector?region_id=${regionID}&sector_id=${sID}&sector_name=${finalSectorName}`;
      addUpdateSector(req);
    }
    if(sectorDelete || updateStatus)
    {
      const req = `admin/updatesectorstatus/${sID}?status=${sectorStatus}`;
      deleteSectorAPI(req);
    }
  }, [sectorAdd, sID, regionID, finalSectorName, addUpdateSector, sectorUpdate, updateStatus, sectorStatus, sectorDelete, deleteSectorAPI]);

  let rows = [];
  let count = 1;
  if (sectors.data && sectors.data.length > 0) {
    rows = sectors.data.map((sector) => {
      let dID = sector.sector_id;
      let id = count;
      let sector_name = sector.sector_name;
      let region_name = sector.region_name;
      let region_id = sector.region_id;
      let status = sector.status;
      count++;
      return { dID, id, sector_name, region_name, status, region_id };
    });
  }

  const handleAddShow = () => {
    setAddSector(!addSector);
  };

  const handleEditShow = (data) => {
    setSectorData(data);
    setSID(data.dID);
    setRegionID(data.region_id);
    setEditSector(!editSector);
  };

  const deleteSector = (id) => {
    setSID(id); 
    setSectorStatus('Deleted'); 
    setSectorDelete(true);
  }

  function getText(event)
  {
    let id = event.target.id;
    if (id === 'sector-name')
    {
      sectorName = event.target.value;
      sectorData.sector_name = sectorName;
    }
  }

  function TextFormat(input)
  {
    input = input.split(' ');
    input = input.map((inp) => { return inp.charAt(0).toUpperCase() + inp.slice(1) });
    input.map((inp, index) => {
      if (index === input.length - 1)
      {
        sector += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
      }
      else
      {
        sector += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase() + ' ';
      }
      return sector;
    });
    setFinalSectorName(sector);
  }

  function submitSector()
  {
    TextFormat(sectorData.sector_name);
    setSectorAdd(true);
  }

  function submitUpdateSector()
  {
    TextFormat(sectorData.sector_name);
    setSectorUpdate(true);
  }

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }
  
  const handleSearch = (event) => {
    setSFilter(event.target.value);
  }

  const filterFunction = () => {
    rows = rows.filter(row => {
      return (
        ( row.sector_name.toLowerCase().includes(sFilter.toLowerCase()) || row.region_name.toLowerCase().includes(sFilter.toLowerCase()) ) &&
          row
      )
    }).map(filteredData => { return filteredData })
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title="Cities" />
        <div className={classes.tableWrapper}>
          <div className="d-flex flex-row justify-content-end">
            <div className="col-3 float-right">
              <input type="search" className="form-control border-primary border-1" id='sBox' name="sBox" onChange={(e) => handleSearch(e)} placeholder="Search" />
            </div>
            {
              (InnerRightsFilter('define', userData)) &&
                <div className="col-3 float-right">
                  <button className="form-control border-primary border-1 btn btn-primary" onClick={() => { setAddSector(true) }}>Add City</button>
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
                stableSort(rows, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow hover tabIndex={-1} key={row.id} >
                        <TableCell component="th" id={labelId} scope="row" >{row.id}</TableCell>
                        <TableCell align="left">{row.sector_name}</TableCell>
                        <TableCell align="left">{row.region_name}</TableCell>
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
                                setSectorStatus('Inactive');
                              }
                              else if(row.status === 'Inactive')
                              {
                                setSectorStatus('Active');
                              }
                              setSID(row.dID);
                              setUpdateStatus(true);
                            }}
                          >
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell align="left">
                          {
                            (InnerRightsFilter('define', userData)) &&
                              <>
                                <i className="fas fa-edit cursor-pointer mr-2" onClick={() => { handleEditShow(row) }} />
                                {
                                  (row.status !== 'Deleted') &&
                                    <i className="fas fa-trash cursor-pointer" onClick={() => { deleteSector(row.dID) }}/>
                                }
                              </>
                          }
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
              {
                (addSector) &&
                  <AddSector
                    showModal={addSector}
                    handleShow={handleAddShow}
                    regions={regions}
                    setRegionID={setRegionID}
                    loader={addLoader}
                    setLoader={setAddLoader}
                    getText={getText}
                    submitSector={submitSector}
                   />
              }
              {
                (editSector) &&
                  <EditSector
                    showModal={editSector} 
                    handleShow={handleEditShow} 
                    loader={editLoader} 
                    setLoader={setEditLoader} 
                    getText={getText}
                    submitSector={submitUpdateSector}
                    regions={regions}
                    setRegionID={setRegionID}
                    data={sectorData}
                  />
              }
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
  );
}