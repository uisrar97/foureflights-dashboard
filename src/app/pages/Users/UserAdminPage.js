import React, { useState, useEffect, useCallback } from 'react';
import { MetaTags } from 'react-meta-tags';
import { useNavigate } from "react-router-dom";
import { UserAdmin } from '../../../_metronic/_partials';
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

function UserAdminPage()
{
    const pagelocation = 'Manage Admins';
    const options = AuthFunction();
    const history = useNavigate();
    const [adminsList, setAdminList] = useState({});
    const [loadings, setLoadings] = useState(true);

    const fetchadmins = useCallback(async() => { 
        Axios(options).get('/admin/getusers')
            .then((response) => {
                const res = response.data;
                setAdminList(res);
                setLoadings(false);
            });
    }, [options]);

    useEffect(() => {
        if(loadings)
        {
            fetchadmins();
        }
    }, [loadings, fetchadmins]);

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
        if(adminsList.status === '200' || adminsList.status === '400' || adminsList.status === '500')
        {
            return <>
                <MetaTags>
                    <title>{pagelocation} | Four-E</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <UserAdmin admins={adminsList} fetchadmins={fetchadmins} />
            </>;
        }
        else
        {
            return history('/logout');
        }
    }
}

export default UserAdminPage;