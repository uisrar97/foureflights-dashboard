import React from "react";
import { AuthUserData } from "../../../_metronic/_helpers/HelperFunctions";

const ShowTicket = ({ pnr, last_name }) => {
  let userData = AuthUserData();
  const userId = userData.userId;
  const url = `https://foureflights.com/get-flight-booking/pnr=${pnr}&last_name=${last_name}&pre=200&user_id=${userId}`;
  return (
    <div>
      <div
        style={{
          // Set your custom height here
          overflow: "hidden", // Hide the iframe scrollbars
          border: "none", // Remove the frame border
        }}
      >
        <iframe
          title="Embedded Content"
          src={url}
          width="100%"
          height="2200"
          frameBorder="0"
          allowFullScreen
          scrolling="no"
        ></iframe>
      </div>
    </div>
  );
};

export default ShowTicket;
