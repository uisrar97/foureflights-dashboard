import React, { useEffect, useState, useCallback, useRef } from "react";
import MetaTags from 'react-meta-tags';
import { Tours } from '../../../_metronic/_partials';
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

function ToursPage()
{
    const isMounted = useRef();

    const pagelocation = 'Tours';
    const options = AuthFunction();
    const navigate = useNavigate();
    const [tours, setTours] = useState({});
    const [regions, setRegions] = useState({});
    const [combinedTours, setCombinedTours] = useState({});
    const [toursLoadings, setToursLoadings] = useState(true);
    const [regionsLoadings, setRegionsLoadings] = useState(true);
    const [combineLoadings, setCombineLoadings] = useState(true);
    let country_tours = [];

    const fetchtours = useCallback(async() => { 
        Axios(options).get('admin/get-tours')
            .then((response) => {
                const res = response.data;
                setTours(res);
                setToursLoadings(false);
            });
    }, [options]);

    const fetchcountries = useCallback(async() => { 
        Axios(options).get('admin/getregions')
            .then((response) => {
                const res = response.data;
                setRegions(res);
                setRegionsLoadings(false);
            });
    }, [options]);

    const combineTours = () => {
        if(regions.status === '200' && tours.status === '200')
        {
            country_tours = regions.data.map((country)=>{
                country.tours = [];
                tours.data.map((tour)=>{
                    if(tour.country_id === country.id)
                    {
                        country.tours.push(tour);
                    }
                });
                return country;
            });
            setCombinedTours(country_tours)
        }
        setCombineLoadings(false);
    }

    useEffect(() => {
        if(isMounted.current)
        {
            return;
        }
        if(regionsLoadings)
        {
            fetchcountries();
        }
        if(toursLoadings)
        {
            fetchtours();
        }
        isMounted.current = true;
    }, [regionsLoadings, toursLoadings, fetchcountries, fetchtours]);


    if (regionsLoadings || toursLoadings)
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
    else if (!regionsLoadings && !toursLoadings)
    {
        if ( (regions.status === '200' || regions.status === '400' || regions.status === '500') && 
        (tours.status === '200' || tours.status === '400' || tours.status === '500') )
        {
            if(combineLoadings)
            {
                combineTours();
            }
            return <>
                <MetaTags>
                    <title>{pagelocation} | Four-E</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <Tours tours = { combinedTours } />
            </>;
        }
        else
        {
            navigate('/logout');
            return '';
        }
    }
}

export default ToursPage;