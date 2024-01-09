import React from "react";
import {
  TableCell,
  TableRow,
  TableHead,
  TableSortLabel,
  lighten,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import clsx from "clsx";
import SweetAlert from "sweetalert2";
import { useSelector } from "react-redux";

export function diff_minutes(dt2, dt1) {
  var diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
  diff /= 60;
  return time_convert(Math.abs(Math.round(diff)));
}

export function time_convert(num) {
  var m1 = num;
  if (isNaN(m1)) m1 = 0;
  var t3 = m1;
  var t4 = Math.floor(t3 / 1440);
  var t5 = t3 - t4 * 1440;
  var t6 = Math.floor(t5 / 60);
  var t7 = t5 - t6 * 60;
  if (t4 === 0) {
    if (t7 === 0) {
      return t6 + " Hours ";
    } else if (t6 === 0) {
      return t7 + "  Minutes";
    } else {
      return t6 + "  Hours  " + t7 + "  Minutes";
    }
  } else {
    return "  " + t4 + "  Days  " + t6 + "  Hours  " + t7 + "  Minutes";
  }
}

export function date_convert(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
export function date_convert_with_time(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    seconds: "numeric",
  });
}

export function utc_convert(date) {
  if (date.indexOf("+") > -1) {
    date = date.split("+");
    date = date[0];
  } else {
    date = date.split("-");
    let len = date.length;
    let x = "";
    date.map((d, index) => {
      if (len === 4) {
        if (index !== len - 1) {
          x += d;
        } else {
          x += d + "-";
        }
      } else {
        if (index !== len - 1) {
          x += d + "-";
        } else {
          x += d;
        }
      }
      return 0;
    });
    date = x;
  }
  const utc = new Date(date);
  var hours = utc.getHours();
  var minutes = utc.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export function TimeZone(time) {
  let extractedZone = "";
  if (time.indexOf("+") > -1) {
    let zone = time.split("+");
    extractedZone = "UTC +" + zone[1];
  } else {
    let zone = time.split("-");
    extractedZone = "UTC -" + zone[zone.length - 1];
  }
  return extractedZone;
}

export function ShowConfirmAlert() {}

export function ShowAlert(status, message) {
  if (status === "400") {
    SweetAlert.fire({
      title: "Error!",
      text: TextCapitalizeFirst(message),
      icon: "error",
      confirmButtonText: "OK",
    });
  } else if (status === "200") {
    SweetAlert.fire({
      title: "Success!",
      text: TextCapitalizeFirst(message),
      icon: "success",
      confirmButtonText: "OK",
    });
  }
}

export function ShowAlertVendor(status, message, data) {
  if (status === "400") {
    SweetAlert.fire({
      title: "Error!",
      text: TextCapitalizeFirst(message),
      icon: "error",
      confirmButtonText: "OK",
    });
  } else if (status === "200") {
    SweetAlert.fire({
      title: "Success!",
      text: TextCapitalizeFirst(message),
      html: data,
      icon: "success",
      confirmButtonText: "OK",
    });
  }
}

export function dueDate(date) {
  let due = new Date(date).setHours(23, 59, 59);
  let due2 = new Date(due);

  var hours = due2.getHours();
  var minutes = due2.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;

  return date_convert(due2) + " " + strTime;
}

export function AuthUserData() {
  const { user } = useSelector((state) => state.auth);

  return user;
}

export function AuthFunction() {
  const { user } = useSelector((state) => state.auth);
  const options = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };
  return options;
}

export function TextCapitalizeFirst(input) {
  let capitalizedText = "";
  input = input.split(" ");
  input = input.map((inp) => {
    return inp.charAt(0).toUpperCase() + inp.slice(1);
  });
  input.map((inp, index) => {
    if (index === input.length - 1) {
      capitalizedText +=
        inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
    } else {
      capitalizedText +=
        inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase() + " ";
    }
    return capitalizedText;
  });
  return capitalizedText;
}

export function RightsFilter(keyword) {
  const userData = AuthUserData();
  let result = userData.rights.find((element) => element === keyword);

  if (result === undefined) {
    return false;
  } else {
    return true;
  }
}

export function InnerRightsFilter(keyword, userData) {
  let result = userData.rights.find((element) => element === keyword);

  if (result === undefined) {
    return false;
  } else {
    return true;
  }
}

// Generic Table Functions
export function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

export function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headRows } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headRows.map((row) => (
          <TableCell
            key={row.id}
            align={row.align}
            style={{ width: "170px" }}
            padding={row.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

export const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { title } = props;
  return (
    <Toolbar className={clsx(classes.root)}>
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
          {title}
        </Typography>
      </div>
      <div className={classes.spacer} />
    </Toolbar>
  );
};

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: "auto",
  },
}));

export function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: "1 1 100%",
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: "0 0 auto",
  },
}));

export function withRouter(Child) {
  return (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    return <Child {...props} navigate={navigate} location={location} />;
  };
}
