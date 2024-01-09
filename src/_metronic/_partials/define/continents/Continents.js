import React, { useState, useEffect, useCallback } from "react";
import Axios from "../../../../app/service";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Paper,
} from "@material-ui/core";
import AddContinent from "./AddContinent";
import EditContinent from "./EditContinent";
import {
  ShowAlert,
  AuthFunction,
  InnerRightsFilter,
  stableSort,
  getSorting,
  EnhancedTableHead,
  EnhancedTableToolbar,
  useStyles,
  AuthUserData,
} from "../../../_helpers/HelperFunctions";

const headRows = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "Sr. #",
    align: "left",
  },
  {
    id: "continent_name",
    numeric: false,
    disablePadding: false,
    label: "Continent Name",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Action",
    align: "left",
  },
];

export function Continents({ continents, fetchcontinents }) {
  const options = AuthFunction();
  const userData = AuthUserData();
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [addContinent, setAddContinent] = useState(false);
  const [addLoader, setAddLoader] = useState(false);
  const [continentData, setContinentData] = useState({});
  const [editContinent, setEditContinent] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [sFilter, setSFilter] = useState("");

  let continentName = "";
  let continent = "";

  const [finalContinentName, setFinalContinentName] = useState("");
  const [continentAdd, setContinentAdd] = useState(false);
  const [continentUpdate, setContinentUpdate] = useState(false);
  const [continentDelete, setContinentDelete] = useState(false);
  const [deleteContinent, setDeleteContinent] = useState(0);
  const [cID, setCID] = useState(0);

  const addUpdateContinent = useCallback(
    async (request) => {
      Axios(options)
        .get(request)
        .then((response) => {
          const res = response.data;
          ShowAlert(res.status, res.message);
          setContinentAdd(false);
          setContinentUpdate(false);
          setAddContinent(false);
          setContinentUpdate(false);
          setAddContinent(false);
          setAddLoader(false);
          setEditContinent(false);
          setEditLoader(false);
          setCID(0);
          fetchcontinents();
        });
    },
    [fetchcontinents, options]
  );

  const deleteContinentAPI = useCallback(
    async (data) => {
      Axios(options)
        .get(data)
        .then((response) => {
          const res = response.data;
          if (res.status && res.status === "200") {
            ShowAlert(res.status, res.message);
            setContinentDelete(false);
            setDeleteContinent(0);
            fetchcontinents();
          }
        });
    },
    [fetchcontinents, options]
  );

  useEffect(() => {
    if (continentAdd || continentUpdate) {
      const req = `admin/addcontinent?continent_id=${cID}&continent_name=${finalContinentName}`;
      addUpdateContinent(req);
    }
    if (continentDelete) {
      const req = `admin/deletecontinent/${deleteContinent}`;
      deleteContinentAPI(req);
    }
  }, [
    continentAdd,
    cID,
    finalContinentName,
    addUpdateContinent,
    continentUpdate,
    continentDelete,
    deleteContinent,
    deleteContinentAPI,
  ]);

  let rows = [];
  let count = 1;
  if (continents.data.length > 0) {
    rows = continents.data.map((continent) => {
      let dID = continent.id;
      let id = count;
      let continent_name = continent.continent_name;
      count++;
      return { dID, id, continent_name };
    });
  }

  const handleAddShow = () => {
    setAddContinent(!addContinent);
  };

  const handleEditShow = (data) => {
    setContinentData(data);
    setEditContinent(!editContinent);
  };

  const handleDeleteContinent = (id) => {
    setDeleteContinent(id);
    setContinentDelete(true);
  };

  const handleSearch = (event) => {
    setSFilter(event.target.value);
  };

  function submitContinent() {
    TextFormat(continentData.continent_name);
    setContinentAdd(true);
  }

  function submitUpdateContinent() {
    TextFormat(continentData.continent_name);
    setContinentUpdate(true);
  }

  const filterFunction = () => {
    rows = rows
      .filter((row) => {
        return (
          row.continent_name.toLowerCase().includes(sFilter.toLowerCase()) &&
          row
        );
      })
      .map((filteredData) => {
        return filteredData;
      });
  };

  function getText(event) {
    let id = event.target.id;
    if (id === "continent-name") {
      continentName = event.target.value;
      continentData.continent_name = continentName;
    }
  }

  function TextFormat(input) {
    input = input.split(" ");
    input = input.map((inp) => {
      return inp.charAt(0).toUpperCase() + inp.slice(1);
    });
    input.map((inp, index) => {
      if (index === input.length - 1) {
        continent += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
      } else {
        continent +=
          inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase() + " ";
      }
      return continent;
    });
    setFinalContinentName(continent);
  }

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title="Continents" />
        <div className={classes.tableWrapper}>
          <div className="d-flex flex-row justify-content-end">
            <div className="col-3 float-right">
              <input
                type="search"
                className="form-control border-primary border-1"
                id="sBox"
                name="sBox"
                onChange={(e) => handleSearch(e)}
                placeholder="Search"
              />
            </div>
            {InnerRightsFilter("define", userData) && (
              <div className="col-3 float-right">
                <button
                  className="form-control border-primary border-1 btn btn-primary"
                  onClick={() => {
                    setAddContinent(true);
                  }}
                >
                  Add Continent
                </button>
              </div>
            )}
          </div>
        </div>
        {sFilter !== "" && filterFunction()}
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headRows={headRows}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="left">{row.continent_name}</TableCell>
                      <TableCell align="left">
                        {InnerRightsFilter("define", userData) && (
                          <>
                            <i
                              className="fas fa-edit cursor-pointer mr-2"
                              onClick={() => {
                                handleEditShow(row);
                              }}
                            />
                            {row.status !== "Deleted" && (
                              <i
                                className="fas fa-trash cursor-pointer"
                                onClick={() => {
                                  handleDeleteContinent(row.dID);
                                }}
                              />
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
              {addContinent && (
                <AddContinent
                  showModal={addContinent}
                  handleShow={handleAddShow}
                  loader={addLoader}
                  setLoader={setAddLoader}
                  getText={getText}
                  submitContinent={submitContinent}
                />
              )}
              {editContinent && (
                <EditContinent
                  showModal={editContinent}
                  handleShow={handleEditShow}
                  loader={editLoader}
                  setLoader={setEditLoader}
                  getText={getText}
                  submitContinent={submitUpdateContinent}
                  setCID={setCID}
                  data={continentData}
                />
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
            "aria-label": "Previous Page",
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page",
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
