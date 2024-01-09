import React, { useState, useEffect, useCallback  } from 'react';
import Axios from '../../../../app/service';
import {Table,TableBody,TableCell,TablePagination,TableRow,Paper} from '@material-ui/core';





import AddRights from './AddRights';
import EditRights from './EditRights';
import { ShowAlert, AuthFunction, AuthUserData, InnerRightsFilter, stableSort, getSorting, EnhancedTableHead, 
  EnhancedTableToolbar, useStyles } from '../../../_helpers/HelperFunctions';

const headRows = [
  { id: 'id', numeric: false, disablePadding: false, label: 'Sr. #', align: 'left' },
  { id: 'right_name', numeric: false, disablePadding: false, label: 'Right Name' },
  { id: 'right_code', numeric: false, disablePadding: false, label: 'Right Code', align: 'left' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Action', align: 'left' },
];

export function UserRights({ rights, fetchrights })
{
  const options = AuthFunction();
  const userData = AuthUserData();
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [addRight, setAddRight] = useState(false);
  const [addLoader, setAddLoader] = useState(false);
  const [rightData, setRightData] = useState({});
  const [editRight, setEditRight] = useState(false);
  const [editLoader, setEditLoader] = useState(false);

  let rightName = '';
  let right = '';
  let rightCode = '';
  const [finalRightName, setFinalRightName] = useState('');
  const [finalRightCode, setFinalRightCode] = useState('');
  const [parentRight, setParentRight] = useState(0);
  const [rightSubmit, setRightSubmit] = useState(false);
  const [rightDelete, setRightDelete] = useState(false);
  const [deleteRight, setDeleteRight] = useState(0);
  const [rID, setRID] = useState(0);

  const updateRights = useCallback(async(data) => { 
    Axios(options).get(data).then((response) => {
        const res = response.data;
        ShowAlert(res.status, res.message);
        setRightSubmit(false);
        setAddRight(false);
        setAddLoader(false);
        setEditRight(false);
        setEditLoader(false);
        setRID(0);
        fetchrights();
    });
  }, [fetchrights, options]);

  const deleteRights = useCallback(async(data) => { 
    Axios(options).get(data).then((response) => {
        const res = response.data;
        if (res.status && res.status === '200')
        {
          ShowAlert(res.status, res.message);
          setRightDelete(false);
          setDeleteRight(0);
          fetchrights();
        }
    });
  }, [fetchrights, options]);

  useEffect(() => {
    if (rightSubmit)
    {
      const req = `admin/addrights?right_id=${rID}&parent_id=${parentRight}&right_name=${finalRightName}&right_code=${finalRightCode}`;
      updateRights(req);
    }
    if (rightDelete)
    {
      const req = `admin/deleteright/${deleteRight}`;
      deleteRights(req);
    }
  }, [rightSubmit, rID, finalRightCode, finalRightName, updateRights, rightDelete, deleteRight, deleteRights, parentRight]);

  let rows = [];
  let count = 1;
  if (rights.data.length > 0) {
    rows = rights.data.map((right) => {
      let dID = right.id;
      let id = count;
      let right_name = right.right_name;
      let right_code = right.right_code;
      let parent_id = right.parent_id;
      count++;
      return { dID, id, right_name, right_code, parent_id };
    });
  }

  const handleAddShow = () => {
    setAddRight(!addRight);
  };

  const handleEditShow = (data) => {
    setRightData(data);
    setEditRight(!editRight);
  };

  const RightDelete = (id) => {
    setDeleteRight(id);
    setRightDelete(true);
  };

  function getText(event)
  {
    let id = event.target.id;
    if (id === 'right-name')
    {
      rightName = event.target.value;
      rightData.right_name = rightName;
    }
  }

  function TextFormat(input)
  {
    input = input.split(' ');
    let code = input;
    input = input.map((inp) => { return inp.charAt(0).toUpperCase() + inp.slice(1) });
    input.map((inp, index) => {
      if (index === input.length - 1)
      {
        right += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
      }
      else
      {
        right += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase() + ' ';
      }
      return right;
    });
    setFinalRightName(right);
    code.map((inp, index) => {
      if (index === code.length - 1)
      {
        rightCode += inp.toLowerCase();
      }
      else
      {
        rightCode += inp.toLowerCase() + '-';
      }
      return rightCode;
    });
    setFinalRightCode(rightCode);
  }

  function submitRight()
  {
    TextFormat(rightData.right_name);
    setRightSubmit(true);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title="User Rights" />
        <div className={classes.tableWrapper}>
          <div className="d-flex flex-row justify-content-end">
            {
              (InnerRightsFilter('add-user-rights', userData)) &&
                <div className="col-3 float-right">
                  <button className="form-control border-primary border-1 btn btn-primary" onClick={() => { setAddRight(true) }}>Add Right</button>
                </div>
            }
          </div>
        </div>
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
                        <TableCell align="left">{row.right_name}</TableCell>
                        <TableCell align="left">{row.right_code}</TableCell>
                        <TableCell align="left">
                          {
                            (InnerRightsFilter('edit-user-rights', userData)) &&
                              <i className="fas fa-edit cursor-pointer mr-2" onClick={() => { handleEditShow(row) }} />
                          }
                          {
                            (InnerRightsFilter('delete-user-rights', userData)) &&
                              <i className="fas fa-trash cursor-pointer" onClick={() => { RightDelete(row.dID) }}/>
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
                (addRight) &&
                  <AddRights 
                    rights={rights.data}
                    showModal={addRight} 
                    handleShow={handleAddShow} 
                    loader={addLoader} 
                    setLoader={setAddLoader} 
                    getText={getText}
                    submitRight={submitRight}
                    setParentRight={setParentRight}
                  />
              }
              {
                (editRight) &&
                  <EditRights 
                    rights={rights.data}
                    showModal={editRight} 
                    handleShow={handleEditShow} 
                    loader={editLoader} 
                    setLoader={setEditLoader} 
                    getText={getText}
                    submitRight={submitRight}
                    setRID={setRID}
                    data={rightData}
                    setParentRight={setParentRight}
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