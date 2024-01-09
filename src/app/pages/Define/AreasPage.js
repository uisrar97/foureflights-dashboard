import React, { useState, useEffect, useCallback } from 'react';
import { Areas } from '../../../_metronic/_partials';
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import MetaTags from 'react-meta-tags';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

function AreasPage()
{
    const pagelocation = 'Areas';
    const options = AuthFunction();
    const navigate = useNavigate();
    const [areas, setAreas] = useState({});
    const [SectorsList, setSectorsList] = useState({});
    const [areaLoadings, setAreaLoadings] = useState(true);
    const [sectorLoadings, setsectorLoadings] = useState(true);

    const fetchcities = useCallback(async() => { 
        Axios(options).get('admin/getsectors')
            .then((response) => {
                const res = response.data;
                setSectorsList(res);
                setsectorLoadings(false);
            });
    }, [options]);
    const fetchareas = useCallback(async() => { 
        Axios(options).get('admin/getareas')
            .then((response) => {
                const res = response.data;
                setAreas(res);
                setAreaLoadings(false);
            });
    }, [options]);

    useEffect(() => {
        if(areaLoadings)
        {
            fetchareas();
        }
        if(sectorLoadings)
        {
            fetchcities();
        }
    }, [areaLoadings, sectorLoadings, fetchcities, fetchareas]);


    if ((areaLoadings && sectorLoadings) || (areaLoadings || sectorLoadings))
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
    else if (!areaLoadings && !sectorLoadings)
    {
        if ( (areas.status === '200' || areas.status === '400' || areas.status === '500') && 
        (SectorsList.status === '200' || SectorsList.status === '400' || SectorsList.status === '500') )
        {
            return <>
                <MetaTags>
                    <title>{pagelocation} | Four-E</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <Areas areas={areas} sectors={SectorsList.data} fetchareas={fetchareas} />
            </>;
        }
        else
        {
            navigate('/logout');
            return '';
        }
    }
}

export default AreasPage;