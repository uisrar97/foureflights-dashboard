import React, { useEffect, useState, useCallback } from "react";
import { HCancelRequests } from "../../../_metronic/_partials";
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import MetaTags from 'react-meta-tags';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

function HotelCancelRequestsPage() {
  const pagelocation = 'Hotel Cancel Requests';
  const options = AuthFunction();
  const history = useNavigate();
  const [Requests, setRequests] = useState({});
  const [loadings, setLoadings] = useState(true);

  const fetchrequests = useCallback(async () => {
    Axios(options).get('admin/getcancelrequests')
      .then((response) => {
        const res = response.data;
        setRequests(res);
        setLoadings(false);
      });
  }, [options]);
  
  useEffect(() => {
    if (loadings)
    {
      fetchrequests();
    }
  }, [loadings, fetchrequests]);


  if (loadings) {
    return <>
      <MetaTags>
        <title>Loading | Four-E</title>
        <meta name="description" content="#" />
      </MetaTags>
      <div className='text-center plane-loader'>
        <Plane secondaryColor='#378edd' color="#378edd" />
      </div>
    </>;
  }
  else {
    if (Requests.status === '200' || Requests.status === '400' || Requests.status === '500') {
      return <>
        <MetaTags>
          <title>{pagelocation} | Four-E</title>
          <meta name="description" content="#" />
        </MetaTags>
        <HCancelRequests requests={Requests} fetchrequests={fetchrequests} setLoadings={setLoadings} />
      </>;
    }
    else {
      return history('/logout');
    }
  }
}

export default HotelCancelRequestsPage;