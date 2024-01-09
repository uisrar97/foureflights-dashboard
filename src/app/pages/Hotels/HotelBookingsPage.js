import React, { useEffect, useState , useCallback} from "react";
import { toast } from 'react-toastify';
import { HBookings } from "../../../_metronic/_partials";
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import MetaTags from 'react-meta-tags';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

// import Pusher from 'pusher-js';

toast.configure()

function HotelBookingsPage()
{
  const pagelocation = 'Hotel Bookings';
  const options = AuthFunction();
  const navigate = useNavigate();
  const [Hotels, setHotels] = useState({});
  const [loadings, setLoadings] = useState(true);

  const fetchHotelBookings = useCallback(async() => { 
    Axios(options).get('admin/gethotelbookings',)
      .then((response) => {
        const res = response.data;
        setHotels(res);
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
    //   fetchHotelBookings();
    //   toast(PushData.data);
    // });
    if (loadings)
    {
        fetchHotelBookings();
    }
  }, [loadings, fetchHotelBookings]);

  if (loadings)
  {
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
  else
  {
    if(Hotels.status === '200' || Hotels.status === '400' || Hotels.status === '500')
    {
      return <>
        <MetaTags>
          <title>{pagelocation} | Four-E</title>
          <meta name="description" content="#" />
        </MetaTags>
        <HBookings bookings={Hotels} fetchHotelBookings={fetchHotelBookings} setLoadings={setLoadings} />
      </>
    }
    else
    {
      navigate('/logout');
      return '';
    }
  }
}

export default HotelBookingsPage;

