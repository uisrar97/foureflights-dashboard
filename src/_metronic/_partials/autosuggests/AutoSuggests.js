import React from "react";
import ErrorBoundary from "./../../../../helper/ErrorBoundary";
import "./autosuggests.css";

export function Autosuggests({
  name,
  value,
  onChange,
  icon,
  AirportListDropdown,
  obj,
}) {
  return (
    <ErrorBoundary>
      <div className="col-md-12 mb-2 p-0">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text city-icon" id="basic-addon1">
              {icon}
            </span>
          </div>
          <input
            type="search"
            className="form-control border-0 pl-2 city-field"
            onClick={() => {
              AirportListDropdown(name);
            }}
            name={name}
            value={value}
            autoComplete="off"
            aria-describedby="basic-addon1"
            onChange={(e) => {
              onChange(e.target.value, false, obj);
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Autosuggests;
