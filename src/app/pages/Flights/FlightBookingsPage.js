import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Bookings } from "../../../_metronic/_partials";
import { useNavigate } from "react-router-dom";
import { AuthFunction } from "../../../_metronic/_helpers/HelperFunctions";
import MetaTags from "react-meta-tags";
import Axios from "../../service";
import { Plane } from "react-loader-spinner";

// import Pusher from 'pusher-js';

toast.configure();

function FlightBookingsPage() {
  const pagelocation = "Flight Bookings";
  const options = AuthFunction();
  const history = useNavigate();
  const [Flights, setFlights] = useState({});
  const [loadings, setLoadings] = useState(true);

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
    // const pusher = new Pusher('253b8abff9d29c09aa09', {
    //   cluster: 'mt1',
    //   wsHost: '127.0.0.1',
    //   wsPort: 6001,
    //   forceTLS: false
    // });
    // const channel = pusher.subscribe('booking-channel');
    // channel.bind('booking-event', function (PushData) {
    //   fetchBookings();
    //   toast(PushData.data);
    // });
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
      Flights.status === "200" ||
      Flights.status === "400" ||
      Flights.status === "500"
    ) {
      return (
        <>
          <MetaTags>
            <title>{pagelocation} | Four-E</title>
            <meta name="description" content="#" />
          </MetaTags>
          <Bookings bookings={Flights} fetchBookings={fetchBookings} />
        </>
      );
    } else {
      return history("/logout");
    }
  }
}

export default FlightBookingsPage;
