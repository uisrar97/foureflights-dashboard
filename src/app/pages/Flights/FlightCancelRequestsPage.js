import React, { useEffect, useState, useCallback } from "react";
import { CancelRequests } from "../../../_metronic/_partials";
import { useNavigate } from "react-router-dom";
import { AuthFunction } from "../../../_metronic/_helpers/HelperFunctions";
import MetaTags from "react-meta-tags";
import Axios from "../../service";
import { Plane } from "react-loader-spinner";

function FlightCancelRequestsPage() {
  const pagelocation = "Flight Cancel Requests";
  const options = AuthFunction();
  const history = useNavigate();
  const [Requests, setRequests] = useState({});
  const [loadings, setLoadings] = useState(true);
  const [Flights, setFlights] = useState({});

  const fetchrequests = useCallback(async () => {
    Axios(options)
      .get("admin/getcancelrequests")
      .then((response) => {
        const res = response.data;
        setRequests(res);
        setLoadings(false);
      });
  }, [options]);

  useEffect(() => {
    if (loadings) {
      fetchrequests();
    }
  }, [loadings, fetchrequests]);

  const fetchBookings = useCallback(async () => {
    Axios(options)
      .get("admin/getbookings")
      .then((response) => {
        const res = response.data;
        setFlights(res);
        setLoadings(false);
      });
  }, [options]);
  useEffect(() => {
    if (loadings) {
      fetchBookings();
    }
  }, [loadings, fetchBookings]);

  if (loadings) {
    return (
      <>
        <MetaTags>
          <title>Loading | Four-E</title>
          <meta name="description" content="#" />
        </MetaTags>
        <div className="text-center plane-loader">
          <Plane secondaryColor="#378edd" color="#378edd" />
        </div>
      </>
    );
  } else {
    if (
      Requests.status === "200" ||
      Requests.status === "400" ||
      Requests.status === "500"
    ) {
      return (
        <>
          <MetaTags>
            <title>{pagelocation} | Four-E</title>
            <meta name="description" content="#" />
          </MetaTags>
          <CancelRequests
            bookings={Flights}
            requests={Requests}
            fetchrequests={fetchrequests}
          />
        </>
      );
    } else {
      return history("/logout");
    }
  }
}

export default FlightCancelRequestsPage;
