import React from "react";
import { typeOf } from "react-is";

import "./autosuggests.css";

export function Autosuggests({
  name,
  indexval,
  value,
  defaultValue,
  onChange,
  icon,
  AirportListDropdown,
  obj,
  addClass,
  onRoutes,
}) {
  return (
    <div className="col-md-12 mb-2 p-0">
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text city-icon" id="basic-addon1">
            {icon}
          </span>
        </div>
        <input
          type="search"
          className={`form-control  pl-2 ${addClass}`}
          onClick={() => {
            AirportListDropdown(name);
          }}
          name={name}
          value={value}
          autoComplete="off"
          aria-describedby="basic-addon1"
          onChange={(e) => {
            onChange(e.target.value, false, indexval);
            onRoutes(e, indexval);
          }}
        />
      </div>
    </div>
  );
}

export default Autosuggests;
