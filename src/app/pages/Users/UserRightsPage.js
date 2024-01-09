import React, { useState, useEffect, useCallback } from 'react';
import { UserRights } from "../../../_metronic/_partials";
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import MetaTags from 'react-meta-tags';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

function UserRightsPage()
{
    const pagelocation = 'Manage User Rights';
    const options = AuthFunction();
    const history = useNavigate();
    const [rights, setRights] = useState({});
    const [loadings, setLoadings] = useState(true);

    const fetchrights = useCallback(async() => { 
        Axios(options).get('admin/getrights')
            .then((response) => {
                const res = response.data;
                setRights(res);
                setLoadings(false);
            });
    }, [options]);

    useEffect(() => {
        if (loadings)
        {
            fetchrights();
        }
    }, [loadings, fetchrights]);


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
        if ( rights.status === '200' || rights.status === '400' || rights.status === '500' )
        {
            return <>
                <MetaTags>
                    <title>{pagelocation} | Four-E</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <UserRights rights={rights} fetchrights={fetchrights} />
            </>;
        }
        else
        {
            return history('/logout');
        }
    }
}

export default UserRightsPage;