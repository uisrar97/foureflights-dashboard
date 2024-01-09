import React, { useState, useEffect, useCallback } from 'react';
import Axios from '../../../../app/service';
import { Table, TableBody, TableCell, TablePagination, TableRow, Paper } from '@material-ui/core';
import AddRegion from './AddRegion';
import EditRegion from './EditRegion';
import {
  ShowAlert, AuthFunction, InnerRightsFilter, stableSort, getSorting, EnhancedTableHead, TextCapitalizeFirst,
  EnhancedTableToolbar, useStyles, AuthUserData
} from '../../../_helpers/HelperFunctions';

const headRows = [
  { id: 'id', numeric: false, disablePadding: false, label: 'Sr. #', align: 'left' },
  { id: 'region_name', numeric: false, disablePadding: false, label: 'Country Name' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Action', align: 'left' },
];

export function Countries({ regions, continents, fetchcountries }) {
  const options = AuthFunction();
  const userData = AuthUserData();
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [addRegion, setAddRegion] = useState(false);
  const [addLoader, setAddLoader] = useState(false);
  const [regionData, setRegionData] = useState({});
  const [editRegion, setEditRegion] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [sFilter, setSFilter] = useState('');

  const [disBtn, setDisBtn] = useState(true);
  const [continentID, setContinentID] = useState('');
  const [regionName, setRegionName] = useState('');

  const [regionAdd, setRegionAdd] = useState(false);
  const [regionUpdate, setRegionUpdate] = useState(false);
  const [regionDelete, setRegionDelete] = useState(false);
  const [deleteRegion, setDeleteRegion] = useState(0);
  const [rID, setRID] = useState(0);

  const addUpdateRegion = useCallback(async (request) => {
    Axios(options).get(request).then((response) => {
      const res = response.data;
      ShowAlert(res.status, res.message);
      setRegionAdd(false);
      setRegionUpdate(false);
      setAddRegion(false);
      setAddLoader(false);
      setEditRegion(false);
      setEditLoader(false);
      setDisBtn(true);
      setRID(0);
      fetchcountries();
    });
  }, [fetchcountries, options]);

  const deleteRegionAPI = useCallback(async (data) => {
    Axios(options).get(data).then((response) => {
      const res = response.data;
      if (res.status && res.status === '200') {
        ShowAlert(res.status, res.message);
        setRegionDelete(false);
        setDeleteRegion(0);
        fetchcountries();
      }
    });
  }, [fetchcountries, options]);

  const toggleBtn = useCallback(async () => {
    if (regionName.length > 2 && continentID !== '0' && continentID !== '') {
      setDisBtn(false);
    }
    else {
      setDisBtn(true);
    }
  }, [continentID, regionName]);

  useEffect(() => {
    if (regionAdd || regionUpdate) {
      const req = `admin/addregion?region_id=${rID}&continent_id=${continentID}&region_name=${regionName}`;
      addUpdateRegion(req);
    }
    if (regionDelete) {
      const req = `admin/deleteregion/${deleteRegion}`;
      deleteRegionAPI(req);
    }
    if (regionName || continentID) {
      toggleBtn();
    }
  }, [regionAdd, rID, addUpdateRegion, regionUpdate, regionDelete, deleteRegion, deleteRegionAPI, regionName, continentID, toggleBtn]);

  let rows = [];
  let count = 1;
  if (regions.data.length > 0) {
    rows = regions.data.map((region) => {
      let dID = region.id;
      let id = count;
      let region_name = region.region_name;
      let continent_id = region.continent_id;
      count++;
      return { dID, id, region_name, continent_id };
    });
  }

  const handleAddShow = () => {
    setRegionData({ region_name: '', continent_id: '0' });
    setAddRegion(!addRegion);
  };

  const handleEditShow = (data) => {
    setRegionData(data);
    setContinentID(data.continent_id);
    setRegionName(data.region_name);
    setRID(data.dID);

    setEditRegion(!editRegion);
  };

  const handleDeleteRegion = (id) => {
    setDeleteRegion(id);
    setRegionDelete(true);
  }

  const handleSearch = (event) => {
    setSFilter(event.target.value);
  }

  function submitRegion() {
    setRegionAdd(true);
  }

  function submitUpdateRegion() {
    setRegionUpdate(true);
  }

  const filterFunction = () => {
    rows = rows.filter(row => {
      return ((
        row.region_name.toLowerCase().includes(sFilter.toLowerCase())
      ) &&
        row)
    }).map(filteredData => { return filteredData })
  }

  function getText(event) {
    let id = event.target.id;
    let val = event.target.value;

    if (id === 'region-name') {
      setRegionName(TextCapitalizeFirst(val));
    }
    if (id === 'continents') {
      setContinentID(val)
    }
  }


  // function TextFormat(input)
  // {
  //   input = input.split(' ');
  //   input = input.map((inp) => { return inp.charAt(0).toUpperCase() + inp.slice(1) });
  //   input.map((inp, index) => {
  //     if (index === input.length - 1)
  //     {
  //       region += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
  //     }
  //     else
  //     {
  //       region += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase() + ' ';
  //     }
  //     return region;
  //   });
  //   setFinalRegionName(region);
  // }

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title="Countries" />
        <div className={classes.tableWrapper}>
          <div className="d-flex flex-row justify-content-end">
            <div className="col-3 float-right">
              <input type="search" className="form-control border-primary border-1" id='sBox' name="sBox" onChange={(e) => handleSearch(e)} placeholder="Search" />
            </div>
            {
              (InnerRightsFilter('define', userData)) &&
                (continents.status === '200' && continents.data.length > 0) ?
                <div className="col-3 float-right">
                  <button className="form-control border-primary border-1 btn btn-primary" onClick={() => { setAddRegion(true) }}>Add Country</button>
                </div>
                :
                <div className="col-3 text-center my-auto">
                  <p className='my-auto badge badge-warning' style={{ fontSize: '0.95vw' }}>Add Continents to Add Countries</p>
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
                        <TableCell align="left">{row.region_name}</TableCell>
                        <TableCell align="left">
                          {
                            (InnerRightsFilter('define', userData)) &&
                            <>
                              <i className="fas fa-edit cursor-pointer mr-2" onClick={() => { handleEditShow(row) }} />
                              {
                                (row.status !== 'Deleted') &&
                                <i className="fas fa-trash cursor-pointer" onClick={() => { handleDeleteRegion(row.dID) }} />
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
                (addRegion) &&
                <AddRegion
                  showModal={addRegion}
                  handleShow={handleAddShow}
                  continents={continents.data}
                  loader={addLoader}
                  setLoader={setAddLoader}
                  getText={getText}
                  disBtn={disBtn}
                  submitRegion={submitRegion}
                />
              }
              {
                (editRegion) &&
                <EditRegion
                  showModal={editRegion}
                  handleShow={handleEditShow}
                  continents={continents.data}
                  loader={editLoader}
                  setLoader={setEditLoader}
                  getText={getText}
                  disBtn={disBtn}
                  data={regionData}
                  submitRegion={submitUpdateRegion}
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