import React, { useState, useEffect, useCallback } from 'react';
import Axios from '../../../../app/service';
import {Table,TableBody,TableCell,TablePagination,TableRow,Paper} from '@material-ui/core';





import SweetAlert from 'sweetalert2';
import { date_convert, ShowAlert, AuthUserData, InnerRightsFilter, stableSort, getSorting, EnhancedTableHead, 
  EnhancedTableToolbar, useStyles } from '../../../_helpers/HelperFunctions';

const headRows = [
  { id: 'id', numeric: true, disablePadding: false, label: 'Sr. #', align: 'left' },
  { id: 'pnr', numeric: true, disablePadding: false, label: 'CNR', align: 'left' },
  { id: 'request_status', numeric: true, disablePadding: false, label: 'Request Status', align: 'left' },
  { id: 'created_at', numeric: true, disablePadding: false, label: 'Requested at', align: 'left' },
  { id: 'actions', numeric: true, disablePadding: true, label: 'Action', align: 'left' },
];

export function HCancelRequests({ requests, fetchrequests, setLoadings })
{
  const userData = AuthUserData();
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sFilter, setSFilter] = useState('');

  const [cancelHotel, setCancelHotel] = useState(false);
  const [cancelReq, setCancelReq] = useState({});

  const cancelAPI = useCallback(async() => { 
    Axios({}).get(`admin/cancel-hotel-booking?pnr=${cancelReq}`)
      .then((response) => {
        const res = response.data;
        ShowAlert(res.status, res.message);
        setCancelHotel(false);
        setCancelReq({});
        setLoadings(true);
        fetchrequests();
      });
  }, [cancelReq, fetchrequests, setLoadings]);

  useEffect(() => {
    if (cancelHotel)
    {
      cancelAPI();
    }
  }, [cancelHotel, cancelAPI]);

  let rows = [];
  let count = 1;
  if (requests.data.length > 0) {
    rows = requests.data.map((request) => {
      let id = count;
      let pnr = request.pnr;
      let ticket_reservation_code = request.ticket_reservation_code;
      let provider_type = request.provider_type;
      let request_status = request.status;
      let created_at = request.created_at;
      if(provider_type === 'hotel')
      {
        count++;
        return { id, pnr, ticket_reservation_code, provider_type, request_status, created_at };
      }
      else
      {
        return '';
      }
    });
  }
  rows = rows.filter(Boolean);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  const cancelAlert = (data) => {
    setCancelReq(data);
    SweetAlert.fire({
      title: 'Are you sure you want to cancel?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed)
      {
        setCancelHotel(true);
      }
      else if (result.isDenied)
      {
        setCancelHotel(false);
      }
    });
  };

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handlePNRChange = (event) => {
    setSFilter(event.target.value);
  }

  const filterFunction = () => {
    rows = rows.filter(row => {
      return ((row.pnr.toLowerCase().includes(sFilter.toLowerCase()) || row.provider_type.toLowerCase().includes(sFilter.toLowerCase())) ?
        row
        :
        '')
    }).map(filteredData => { return filteredData })
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title="Flight Cancel Requests" />
        <div className={classes.tableWrapper}>
          <div className="d-flex flex-row justify-content-end">
            <div className="col-3 float-right">
              <input type="search" className="form-control border-primary border-1" id='sBox' name="sBox" onChange={(e) => handlePNRChange(e)} placeholder="Search" />
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
                        <TableCell component="th" id={labelId} scope="row" >{row.id}</TableCell>
                        <TableCell align="left">{row.pnr}</TableCell>
                        <TableCell align="left">
                          <span
                            className=
                            {
                              (row.request_status === 'Pending') ?
                                'badge badge-warning'
                                :
                                (row.request_status === 'Cancelled') ?
                                  'badge badge-success'
                                  :
                                  'badge badge-danger'
                            }
                          >
                            {row.request_status}
                          </span>
                        </TableCell>
                        <TableCell align="left">{date_convert(row.created_at)}</TableCell>
                        <TableCell align="left">
                          {
                            (InnerRightsFilter('hotel-booking-cancellation', userData) && row.request_status === 'Pending') ?
                              <i className='fas fa-ban cancel-icon cursor-pointer' title='Cancel Booking' onClick={() => cancelAlert(row.pnr)}/>
                            :
                              '-'
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