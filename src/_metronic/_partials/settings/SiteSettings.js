import React, { useState, useEffect, useCallback } from "react";
import Axios from "../../../app/service";
import { Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { ShowAlert, AuthFunction } from "../../_helpers/HelperFunctions";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    padding: "15px",
  },
}));

export function SiteSettings({ Settings, fetchSettings }) {
  const options = AuthFunction();
  const classes = useStyles();
  const [updateReq, setUpdateReq] = useState(null);
  const [newCom, setNewCom] = useState(-1);
  const [addNew, setAddNew] = useState(false);
  const [insertComm, setInsertComm] = useState(false);
  const [updateCred, setUpdateCred] = useState(false);

  const [settingType, setSettingType] = useState("");
  const [finalLabel, setFinalLabel] = useState("");
  const [finalCode, setFinalCode] = useState("");
  const [CommVal, setCommVal] = useState(0);
  const [commLabel, setCommLabel] = useState("");
  const [commCode, setCommCode] = useState("");

  let inputLabel = "";
  let inputComm = 0;
  let label = "";
  let codeFinal = "";

  const updateSettings = useCallback(
    async (data) => {
      Axios(options)
        .get(data)
        .then((response) => {
          const res = response.data;
          ShowAlert(res.status, res.message);
          if (res.status && res.status === "200") {
            setUpdateCred(false);
            fetchSettings();
          }
        });
    },
    [fetchSettings, options]
  );

  const manualComm = (event, index) => {
    let classseting = "setting" + index;
    Settings.data[index].setting_value = event.target.value;
    Settings.data[index].setting_status = "False";
    if (event.target.value >= 0 && event.target.value <= 50) {
      setNewCom(Settings.data[index].setting_value);
    }
    let inputelement = document.getElementsByClassName(classseting);
    const timer = setTimeout(() => {
      inputelement[0].focus();
    }, 500);
  };

  function getText(event) {
    let id = event.target.id;
    if (id === "newLabel") {
      inputLabel = event.target.value;
    } else if (id === "newComm") {
      inputComm = event.target.value;
    }
  }

  function submitComm() {
    TextFormat(inputLabel);
    setCommVal(inputComm);
    setInsertComm(true);
  }

  function TextFormat(input) {
    input = input.split(" ");
    let code = input;
    input = input.map((inp) => {
      return inp.charAt(0).toUpperCase() + inp.slice(1);
    });
    input.map((inp, index) => {
      if (index === input.length - 1) {
        label += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
      } else {
        label += inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase() + " ";
      }
      return label;
    });
    setFinalLabel(label);
    code.map((inp, index) => {
      if (index === code.length - 1) {
        codeFinal += inp.toLowerCase();
      } else {
        codeFinal += inp.toLowerCase() + "-";
      }
      return codeFinal;
    });
    setFinalCode(codeFinal);
  }

  const updateEnv = (event, label, code) => {
    setCommVal(event.target.value);
    setCommLabel(`${label}`);
    setCommCode(`${code}`);
    setUpdateCred(true);
  };

  useEffect(() => {
    if (
      updateReq !== null &&
      updateReq.setting_value >= 0 &&
      updateReq.setting_value <= 50
    ) {
      const req = `admin/updatesettings?label=${updateReq.label}&setting_code=${updateReq.setting_code}&setting_value=${updateReq.setting_value}&setting_type=${updateReq.setting_type}`;
      setNewCom(-1);
      setUpdateReq(null);
      return updateSettings(req);
    } else if (
      updateReq !== null &&
      (updateReq.setting_value < 0 || updateReq.setting_value > 50)
    ) {
      setNewCom(-1);
      setUpdateReq(null);
      ShowAlert("400", "Commission Value Should be Between 0 and 50");
    }
    if (insertComm) {
      setSettingType("commission");
      const req = `admin/updatesettings?label=${finalLabel}&setting_code=${finalCode}&setting_value=${CommVal}&setting_type=${settingType}`;
      setAddNew(false);
      return updateSettings(req);
    }
    if (updateCred) {
      const req = `admin/updatesettings?label=${commLabel}&setting_code=${commCode}&setting_value=${CommVal}&setting_type=site_setting`;
      return updateSettings(req);
    }
  }, [
    updateReq,
    insertComm,
    updateCred,
    updateSettings,
    finalLabel,
    finalCode,
    CommVal,
    commLabel,
    commCode,
    settingType,
  ]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <p className="d-none">{newCom}</p>

        <Typography variant="h6" id="tableTitle">
          Credentials
        </Typography>
        {Settings &&
          Settings.status === "200" &&
          Settings.data.map((set, index) => {
            if (set.setting_type === "site_setting") {
              return (
                <div className="row p-1" key={Math.random()}>
                  <div className="col">
                    <label className="text-bold">{set.label}</label>
                  </div>
                  <div className="col align-self-center">
                    <select
                      className="form form-control"
                      value={set.setting_value}
                      onChange={(e) =>
                        updateEnv(e, set.label, set.setting_code)
                      }
                    >
                      <option value="production">Production</option>
                      <option value="preproduction">Pre-Production</option>
                    </select>
                  </div>
                </div>
              );
            }
            return "";
          })}
        <hr />
        <Typography variant="h6" id="tableTitle">
          Commission
        </Typography>
        {Settings &&
          Settings.status === "200" &&
          Settings.data.map((com, index) => {
            if (
              com.setting_type === "commission" ||
              com.setting_type === "withholding"
            ) {
              return (
                <div className="row p-1" key={Math.random()}>
                  <div className="col">
                    <label className="text-bold">{com.label}</label>
                  </div>
                  <div className="col align-self-center">
                    <div className="booking-form-counter d-flex flex-row w-50">
                      <input
                        type="number"
                        className={`setting${index}`}
                        name={com.setting_code}
                        onKeyUp={(e) => manualComm(e, index)}
                        defaultValue={com.setting_value}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-primary btn-sm btn-block"
                      id={com.setting_code}
                      onClick={() => setUpdateReq(com)}
                      disabled={com.setting_status === "Active" && true}
                    >{`Update ${com.label}`}</button>
                  </div>
                </div>
              );
            } else {
              return "";
            }
          })}
        {addNew && (
          <div className="row p-1">
            <div className="col">
              <input
                type="text"
                className="text-bold"
                id="newLabel"
                onChange={(e) => getText(e)}
                placeholder="Enter Label Here"
              />
            </div>
            <div className="col align-self-center">
              <div className="booking-form-counter d-flex flex-row w-50">
                <input
                  type="number"
                  id="newComm"
                  onChange={(e) => getText(e)}
                />
              </div>
            </div>
            <div className="col">
              <button
                className="btn btn-primary btn-sm btn-block"
                onClick={() => submitComm()}
              >
                Insert
              </button>
            </div>
          </div>
        )}
        {!addNew && (
          <div className="row mt-6 justify-content-center">
            <div className="w-25">
              <button
                className="btn btn-primary btn-sm btn-block"
                onClick={() => setAddNew(!addNew)}
              >
                Add New Commission
              </button>
            </div>
          </div>
        )}
      </Paper>
    </div>
  );
}
