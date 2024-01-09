import React, { useState, useEffect, useCallback } from 'react';
import MetaTags from 'react-meta-tags';
import { Cities } from '../../../_metronic/_partials';
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

function CitiesPage()
{
    const pagelocation = 'Cities';
    const options = AuthFunction();
    const navigate = useNavigate();
    const [SectorsList, setSectorsList] = useState({});
    const [regions, setRegions] = useState({});
    const [regionsLoadings, setRegionsLoadings] = useState(true);
    const [sectorLoadings, setsectorLoadings] = useState(true);

    const fetchcities = useCallback(async() => { 
        Axios(options).get('admin/getsectors')
            .then((response) => {
                const res = response.data;
                setSectorsList(res);
                setsectorLoadings(false);
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
    
    useEffect(() => {
        if (regionsLoadings)
        {
            fetchcountries();
        }
        if (sectorLoadings)
        {
            fetchcities();
        }
    }, [regionsLoadings, sectorLoadings, fetchcities, fetchcountries]);


    if ((regionsLoadings && sectorLoadings) || (regionsLoadings || sectorLoadings))
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
    else if (!regionsLoadings && !sectorLoadings)
    {
        if ( (regions.status === '200' || regions.status === '400' || regions.status === '500') && 
        (SectorsList.status === '200' || SectorsList.status === '400' || SectorsList.status === '500') )
        {
            return <>
                <MetaTags>
                    <title>{pagelocation} | Four-E</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <Cities sectors={SectorsList} regions={regions.data} fetchcities={fetchcities} />
            </>;
        }
        else
        {
            navigate('/logout');
            return '';
        }
    }
}

export default CitiesPage;