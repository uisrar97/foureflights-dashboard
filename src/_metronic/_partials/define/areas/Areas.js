import React, { useState, useEffect, useCallback  } from 'react';
import Axios from '../../../../app/service';
import {Table,TableBody,TableCell,TablePagination,TableRow,Paper} from '@material-ui/core';
import AddArea from './AddArea';
import EditArea from './EditArea';
import { ShowAlert, AuthFunction, AuthUserData, InnerRightsFilter, stableSort, getSorting, EnhancedTableHead, 
  EnhancedTableToolbar, useStyles } from '../../../_helpers/HelperFunctions';

const headRows = [
  { id: 'id', numeric: false, disablePadding: false, label: 'Sr. #', align: 'left' },
  { id: 'area_name', numeric: false, disablePadding: false, label: 'Area Name' },
  { id: 'region_name', numeric: false, disablePadding: false, label: 'City Name' },
  { id: 'area_status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Action', align: 'left' },
];

export function Areas({ sectors, areas, fetchareas })
{
  const options = AuthFunction();
  const userData = AuthUserData();
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [addArea, setAddArea] = useState(false);
  const [addLoader, setAddLoader] = useState(false);
  const [areaData, setAreaData] = useState({});
  const [editArea, setEditArea] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [sFilter, setSFilter] = useState('');

  let areaName = '';
  let area = '';

  const [finalAreaName, setFinalAreaName] = useState('');
  const [areaAdd, setAreaAdd] = useState(false);
  const [areaUpdate, setAreaUpdate] = useState(false);
  const [areaDelete, setAreaDelete] = useState(false);
  const [aID, setAID] = useState(0);
  const [sectorID, setSectorID] = useState(0);
  const [areaStatus, setAreaStatus] = useState('');
  const [updateStatus, setUpdateStatus] = useState(false);

  const addUpdateArea = useCallback(async(request) => { 
    Axios(options).get(request).then((response) => {
        const res = response.data;
        ShowAlert(res.status, res.message);
        setAreaAdd(false);
        setAreaUpdate(false);
        setAddArea(false);
        setAddLoader(false);
        setEditArea(false);
        setEditLoader(false);
        setAID(0);
        setSectorID(0);
        fetchareas();
    });
  }, [fetchareas, options]);

  const deleteAreaAPI = useCallback(async(data) => { 
    Axios(options).get(data).then((response) => {
        const res = response.data;
        if (res.status && res.status === '200')
        {
          ShowAlert(res.status, res.message);
          setAreaDelete(false);
          setUpdateStatus(false);
          setAreaStatus('');
          setAID(0);
          fetchareas();
        }
    });
  }, [fetchareas, options]);

  useEffect(() => {
    if(areaAdd || areaUpdate)
    {
      const req = `admin/addarea?sector_id=${sectorID}&area_id=${aID}&area_name=${finalAreaName}`;
      addUpdateArea(req);
    }
    if(areaDelete || updateStatus)
    {
      const req = `admin/updateareastatus/${aID}?status=${areaStatus}`;
      deleteAreaAPI(req);
    }
  }, [areaAdd, aID, sectorID, finalAreaName, addUpdateArea, areaUpdate, updateStatus, areaStatus, areaDelete, deleteAreaAPI]);

  let rows = [];
  let count = 1;
  if (areas.data && areas.data.length > 0) {
    rows = areas.data.map((area) => {
      let dID = area.area_id;
      let id = count;
      let area_name = area.area_name;
      let sector_id = area.sector_id;
      let sector_name = area.sector_name;
      let status = area.status;
      count++;
      return { dID, id, sector_name, area_name, status, sector_id };
    });
  }

  const handleAddShow = () => {
    setAddArea(!addArea);
  };

  const handleEditShow = (data) => {
    setAreaData(data);
    setAID(data.dID);
    setSectorID(data.sector_id);
    setEditArea(!editArea);
  };

  const deleteArea = (id) => {
    setAID(id); 
    setAreaStatus('Deleted'); 
    setAreaDelete(true);
  }

  function getText(event)
  {
    let id = event.target.id;
    if (id === 'area-name')
    {
      areaName = event.target.value;
      areaData.area_name = areaName;
    }
  }

  function TextFormat(input)
  {
    input = input.split(' ');
    input = input.map((inp) => { return inp.charAt(0).toUpperCase() + inp.slice(1) });
    input.map((inp, index) => {
      if (index === input.length - 1)
      {
        area += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
      }
      else
      {
        area += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase() + ' ';
      }
      return area;
    });
    setFinalAreaName(area);
  }

  function submitArea()
  {
    TextFormat(areaData.area_name);
    setAreaAdd(true);
  }

  function submitUpdateArea()
  {
    TextFormat(areaData.area_name);
    setAreaUpdate(true);
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
        <EnhancedTableToolbar title="Areas" />
        <div className={classes.tableWrapper}>
          <div className="d-flex flex-row justify-content-end">
            <div className="col-3 float-right">
              <input type="search" className="form-control border-primary border-1" id='sBox' name="sBox" onChange={(e) => handleSearch(e)} placeholder="Search" />
            </div>
            {
              (InnerRightsFilter('define', userData)) &&
                <div className="col-3 float-right">
                  <button className="form-control border-primary border-1 btn btn-primary" onClick={() => { setAddArea(true) }}>Add Area</button>
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
                        <TableCell align="left">{row.area_name}</TableCell>
                        <TableCell align="left">{row.sector_name}</TableCell>
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
                                setAreaStatus('Inactive');
                              }
                              else if(row.status === 'Inactive')
                              {
                                setAreaStatus('Active');
                              }
                              setAID(row.dID);
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
                                    <i className="fas fa-trash cursor-pointer" onClick={() => { deleteArea(row.dID) }}/>
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
                (addArea) &&
                  <AddArea
                    showModal={addArea}
                    handleShow={handleAddShow}
                    sectors={sectors}
                    setSectorID={setSectorID}
                    loader={addLoader}
                    setLoader={setAddLoader}
                    getText={getText}
                    submitArea={submitArea}
                   />
              }
              {
                (editArea) &&
                  <EditArea
                    showModal={editArea} 
                    handleShow={handleEditShow} 
                    loader={editLoader} 
                    setLoader={setEditLoader} 
                    getText={getText}
                    submitArea={submitUpdateArea}
                    sectors={sectors}
                    setSectorID={setSectorID}
                    data={areaData}
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