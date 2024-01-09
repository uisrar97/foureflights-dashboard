import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import { Rooms } from '../../../_metronic/_partials';
import MetaTags from 'react-meta-tags';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

function RoomsPage()
{
    const pagelocation = 'Manage Rooms';
    const options = AuthFunction();
    const history = useNavigate();
    const [rooms, setRooms] = useState({});
    const [roomsLoader, setRoomsLoader] = useState(true);
    const [totalRooms, setTotalRooms] = useState(0);
    const [totalOccuRooms, setTotalOccuRooms] = useState(0);

    const calcRooms = useCallback(async() => {
        if(rooms.status === '200')
        {
            setTotalRooms(Number(rooms.vendorTotalRooms));
            if(rooms.data.length > 0)
            {
                let count = 0;
                rooms.data.map((room)=>{
                    count += Number(room.room_quantity);
                    return 0;
                });
                setTotalOccuRooms(count);
            }
        }
    }, [rooms]);

    const fetchrooms = useCallback(async() => {
        Axios(options).get('admin/getrooms')
            .then((response) => {
                const res = response;
                setRooms(res.data);
                calcRooms();
                setRoomsLoader(false);
            });
    }, [options, calcRooms]);

    useEffect(() => {
        if(roomsLoader)
        {
            fetchrooms();
        }
    }, [roomsLoader, fetchrooms]);


    if (roomsLoader)
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
        if ( ( rooms.status === '200' || rooms.status === '400' || rooms.status === '500' ) )
        {
            return <>
                <MetaTags>
                    <title>{pagelocation} | Four-E</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <Rooms rooms={rooms} roomsLoader={roomsLoader} setRoomsLoader={setRoomsLoader} fetchrooms={fetchrooms} totalRooms={totalRooms} totalOccuRooms={totalOccuRooms} />
            </>;
        }
        else
        {
            return history('/logout');
        }
    }
}

export default RoomsPage;