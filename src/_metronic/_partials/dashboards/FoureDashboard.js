import React from "react";
import { MixedWidget1, ListsWidget9 } from "../widgets";
export function FoureDashboard() {
  return (
    <>
      <div className="row">
        <div className="col-lg-6 col-xxl-4">
          <MixedWidget1 className="card-stretch gutter-b" />
        </div>
        <div className="col-lg-6 col-xxl-4">
          <ListsWidget9 className="card-stretch gutter-b" />
        </div>
      </div>
    </>
  );
}
