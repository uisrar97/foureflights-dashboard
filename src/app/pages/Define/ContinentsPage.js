import React, { useEffect, useState, useCallback } from "react";
import MetaTags from 'react-meta-tags';
import { Continents } from '../../../_metronic/_partials';
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

function ContinentsPage()
{
    const pagelocation = 'Continents';
    const options = AuthFunction();
    const navigate = useNavigate();
    const [continents, setContinents] = useState({});
    const [loadings, setLoadings] = useState(true);

    const fetchcontinents = useCallback(async() => { 
        Axios(options).get('admin/getcontinents')
            .then((response) => {
                const res = response.data;
                setContinents(res);
                setLoadings(false);
            });
    }, [options]);

    useEffect(() => {
        if(loadings)
        {
            fetchcontinents();
        }
        
    }, [loadings,fetchcontinents]);


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
        if (continents.status === '200' || continents.status === '400' || continents.status === '500')
        {
            return <>
                <MetaTags>
                    <title>{pagelocation} | Four-E</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <Continents continents={continents} fetchcontinents={fetchcontinents} />
            </>;
        }
        else
        {
            navigate('/logout');
            return '';
        }
    }
}

export default ContinentsPage;