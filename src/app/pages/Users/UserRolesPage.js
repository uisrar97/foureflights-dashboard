import React, { useEffect, useState, useCallback } from "react";
import MetaTags from 'react-meta-tags';
import { UserRoles } from "../../../_metronic/_partials";
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

function UserRolesPage()
{
    const pagelocation = 'Manage User Roles';
    const options = AuthFunction();
    const history = useNavigate();
    const [roles, setRoles] = useState({});
    const [rights, setRights] = useState({});
    const [rightsLoadings, setRightsLoadings] = useState(true);
    const [rolesLoadings, setRolesLoadings] = useState(true);

    const fetchrights = useCallback(async() => { 
        Axios(options).get('admin/getrights')
            .then((response) => {
                const res = response.data;
                setRights(res);
                setRightsLoadings(false);
            });
    }, [options]);

    const fetchroles = useCallback(async() => { 
        Axios(options).get('admin/getroles')
            .then((response) => {
                const res = response.data;
                setRoles(res);
                setRolesLoadings(false);
            });
    }, [options]);

    useEffect(() => {
        if(rightsLoadings)
        {
            fetchroles();
        }
        if(rolesLoadings)
        {
            fetchrights();
        }
    }, [rightsLoadings, fetchroles, rolesLoadings, fetchrights]);


    if (rightsLoadings || rolesLoadings)
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
        if ( ( roles.status === '200' || roles.status === '400' || roles.status === '500' ) && 
        ( rights.status === '200' || rights.status === '400' || rights.status === '500' ) )
        {
            return <>
                <MetaTags>
                    <title>{pagelocation} | Four-E</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <UserRoles rights={rights.data} roles={roles} fetchroles={fetchroles} />
            </>;
        }
        else
        {
            return history('/logout');
        }
    }
}

export default UserRolesPage;