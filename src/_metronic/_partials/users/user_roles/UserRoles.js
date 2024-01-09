import React, { useState, useEffect, useCallback  } from 'react';
import Axios from '../../../../app/service';
import {Table,TableBody,TableCell,TablePagination,TableRow,Paper} from '@material-ui/core';





import AddRoles from './AddRoles';
import EditRoles from './EditRoles';
import { ShowAlert, AuthFunction, AuthUserData, InnerRightsFilter, stableSort, getSorting, EnhancedTableHead, 
  EnhancedTableToolbar, useStyles } from '../../../_helpers/HelperFunctions';
const headRows = [
  { id: 'id', numeric: false, disablePadding: false, label: 'Sr. #', align: 'left' },
  { id: 'role_name', numeric: false, disablePadding: false, label: 'Role Name' },
  { id: 'role_code', numeric: false, disablePadding: false, label: 'Role Code', align: 'left' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Action', align: 'left' },
];

export function UserRoles({ rights, roles, fetchroles }) {
  const options = AuthFunction();
  const userData = AuthUserData();
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [addRole, setAddRole] = useState(false);
  const [addLoader, setAddLoader] = useState(false);
  const [roleData, setRoleData] = useState({});
  const [editRole, setEditRole] = useState(false);
  const [editLoader, setEditLoader] = useState(false);

  let roleName = '';
  let role = '';
  let roleCode = '';
  const [finalRoleName, setFinalRoleName] = useState('');
  const [finalRoleCode, setFinalRoleCode] = useState('');
  const [roleAdd, setRoleAdd] = useState(false);
  const [roleUpdate, setRoleUpdate] = useState(false);
  const [roleDelete, setRoleDelete] = useState(false);
  const [deleteRole, setDeleteRole] = useState(0);
  const [rID, setRID] = useState(0);

  const [uRoles, setURoles] = useState([]);

  const addUpdateRoles = useCallback(async(data, roleInfo) => { 
    Axios(options).post(data, roleInfo).then((response) => {
        const res = response.data;
        ShowAlert(res.status, res.message);
        setRoleAdd(false);
        setRoleUpdate(false);
        setAddRole(false);
        setAddLoader(false);
        setEditRole(false);
        setEditLoader(false);
        setURoles([]);
        setRID(0);
        fetchroles();
    });
  }, [fetchroles, options]);

  const deleteRoles = useCallback(async(data) => { 
    Axios(options).get(data).then((response) => {
        const res = response.data;
        if (res.status && res.status === '200')
        {
          ShowAlert(res.status, res.message);
          setRoleDelete(false);
          setDeleteRole(0);
          fetchroles();
        }
    });
  }, [fetchroles, options]);

  useEffect(() => {
    if (roleAdd)
    {
      let roleIDs = [];
      if(uRoles.length > 0)
      {
        uRoles.map((role)=>{
          roleIDs.push(role);
          return '';
        });
      }
      const roleInfo = {
        role_id: 0,
        role_name: finalRoleName,
        role_code: finalRoleCode,
        rights: roleIDs,
      };
      const req = 'admin/addroles';
      addUpdateRoles(req, roleInfo);
    }
    if (roleUpdate)
    {
      let roleIDs = [];
      if(uRoles.length > 0)
      {
        uRoles.map((role)=>{
          roleIDs.push(role);
          return '';
        });
      }
      const roleInfo = {
        role_id: rID,
        role_name: finalRoleName,
        role_code: finalRoleCode,
        rights: roleIDs,
      };
      const req = 'admin/addroles';
      addUpdateRoles(req, roleInfo);
    }
    if (roleDelete)
    {
      const req = `admin/updaterolestatus/${deleteRole}?status=deleted`;
      deleteRoles(req);
    }
  }, [roleAdd, addUpdateRoles, rID, finalRoleCode, finalRoleName, roleUpdate, roleDelete, deleteRole, deleteRoles, uRoles, rights]);

  let rows = [];
  let count = 1;

  if (roles.data.length > 0) {
    rows = roles.data.map((role) => {
      let dID = role.id;
      let id = count;
      let role_name = role.role_name;
      let role_code = role.role_code;
      let role_rights = role.rights;
      let status = role.status;
      count++;
      return { dID, id, role_name, role_code, role_rights, status };
    });
  }

  const handleAddShow = () => {
    setAddRole(!addRole);
  };

  const handleEditShow = (data) => {
    setRoleData(data);
    setEditRole(!editRole);
  };

  const handleRoleDelete = (id) => {
    setDeleteRole(id);
    setRoleDelete(true);
  };

  function getText(event)
  {
    let id = event.target.id;
    if (id === 'role-name')
    {
      roleName = event.target.value;
      roleData.role_name = roleName;
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
        role += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
      }
      else
      {
        role += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase() + ' ';
      }
      return role;
    });
    setFinalRoleName(role);
    code.map((inp, index) => {
      if (index === code.length - 1)
      {
        roleCode += inp.toLowerCase();
      }
      else
      {
        roleCode += inp.toLowerCase() + '-';
      }
      return roleCode;
    });
    setFinalRoleCode(roleCode);
  }

  function submitRole()
  {
    TextFormat(roleData.role_name);
    setRoleAdd(true);
  }

  function submitUpdateRole()
  {
    TextFormat(roleData.role_name);
    setRoleUpdate(true);
  }

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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title="User Roles" />
        <div className={classes.tableWrapper}>
          <div className="d-flex flex-row justify-content-end">
            {
              (InnerRightsFilter('add-user-roles', userData)) &&
                <div className="col-3 float-right">
                  <button className="form-control border-primary border-1 btn btn-primary" onClick={() => { setAddRole(true) }}>Add Role</button>
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
                        <TableCell align="left">{row.role_name}</TableCell>
                        <TableCell align="left">{row.role_code}</TableCell>
                        <TableCell align="left">
                          {
                            (InnerRightsFilter('edit-user-roles', userData)) &&
                              <i className="fas fa-edit cursor-pointer mr-2" onClick={() => { handleEditShow(row) }} />
                          }
                          {
                            (InnerRightsFilter('delete-user-roles', userData)) &&
                              <i className="fas fa-trash cursor-pointer" onClick={() => { handleRoleDelete(row.dID) }}/>
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
                (addRole) &&
                  <AddRoles 
                    rights={rights}
                    showModal={addRole} 
                    handleShow={handleAddShow} 
                    loader={addLoader} 
                    setLoader={setAddLoader} 
                    getText={getText}
                    submitRole={submitRole}
                    uRoles={uRoles}
                    setURoles={setURoles}
                  />
              }
              {
                (editRole) &&
                  <EditRoles 
                    rights={rights}
                    showModal={editRole} 
                    handleShow={handleEditShow} 
                    loader={editLoader} 
                    setLoader={setEditLoader} 
                    getText={getText}
                    setRoleUpdate={setRoleUpdate}
                    submitRole={submitUpdateRole}
                    uRoles={uRoles}
                    setURoles={setURoles}
                    setRID={setRID}
                    data={roleData}
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