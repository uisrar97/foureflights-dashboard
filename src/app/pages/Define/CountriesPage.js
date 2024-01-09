import React, { useEffect, useState, useCallback } from "react";
import MetaTags from 'react-meta-tags';
import { Countries } from '../../../_metronic/_partials';
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

function CountriesPage()
{
    const pagelocation = 'Countries';
    const options = AuthFunction();
    const navigate = useNavigate();
    const [continents, setContinents] = useState({});
    const [regions, setRegions] = useState({});
    const [continentsLoadings, setContinentsLoadings] = useState(true);
    const [regionsLoadings, setRegionsLoadings] = useState(true);

    const fetchcontinents = useCallback(async() => { 
        Axios(options).get('admin/getcontinents')
            .then((response) => {
                const res = response.data;
                setContinents(res);
                setContinentsLoadings(false);
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
        if(regionsLoadings)
        {
            fetchcountries();
        }
        if(continentsLoadings)
        {
            fetchcontinents();
        }
        
    }, [regionsLoadings, continentsLoadings, fetchcountries, fetchcontinents]);


    if (regionsLoadings || continentsLoadings)
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
    else if (!regionsLoadings && !continentsLoadings)
    {
        if ( (regions.status === '200' || regions.status === '400' || regions.status === '500') && 
        (continents.status === '200' || continents.status === '400' || continents.status === '500') )
        {
            return <>
                <MetaTags>
                    <title>{pagelocation} | Four-E</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <Countries regions={regions} continents={continents} fetchcountries={fetchcountries} />
            </>;
        }
        else
        {
            navigate('/logout');
            return '';
        }
    }
}

export default CountriesPage;