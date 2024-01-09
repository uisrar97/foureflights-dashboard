import React, { useEffect, useState, useCallback } from "react";

import Axios from "../../service";
import { Plane } from "react-loader-spinner";
import { Promos } from "../../../_metronic/_partials/promos/Promos";
import { useNavigate } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { AuthFunction } from "../../../_metronic/_helpers/HelperFunctions";
const PromosPage = () => {
  const pagelocation = "Flight Promos";
  const options = AuthFunction();
  const history = useNavigate();
  const [Flights, setFlights] = useState({});
  const [loadings, setLoadings] = useState(true);

  const fetchPromos = useCallback(async () => {
    Axios(options)
      .get("admin/get-promos")
      .then((response) => {
        const res = response.data;
        setFlights(res);
        setLoadings(false);
      });
  }, [options]);
  useEffect(() => {
    if (loadings) {
      fetchPromos();
    }
  }, [loadings, fetchPromos]);

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
    return (
      <>
        <MetaTags>
          <title>{pagelocation} | Four-E</title>
          <meta name="description" content="#" />
        </MetaTags>
        <Promos promos={Flights} fetchPromos={fetchPromos} />
      </>
    );
  }
};

export default PromosPage;
