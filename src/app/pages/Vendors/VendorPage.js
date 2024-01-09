import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import {Vendors} from '../../../_metronic/_partials';
import MetaTags from 'react-meta-tags';
import Axios from '../../service';
import { Plane } from 'react-loader-spinner';

function VendorPage()
{
    const pagelocation = 'Manage Vendors';
    const options = AuthFunction();
    const history = useNavigate();
    const [vendors, setVendors] = useState({});
    const [vendorsLoader, setVendorsLoader] = useState(true);
    const [sectors, setSectors] = useState({});
    const [sectorsLoader, setSectorsLoader] = useState(true);

    const fetchcities = useCallback(async() => { 
        Axios(options).get('admin/getsectors')
            .then((response) => {
                const res = response.data;
                setSectors(res);
                setSectorsLoader(false);
            });
    }, [options]);

    const fetchvendors = useCallback(async() => {
        Axios(options).get('admin/getvendors')
            .then((response) => {
                const res = response.data;
                setVendors(res);
                setVendorsLoader(false);
                fetchcities();
            });
    }, [options, fetchcities]);


    useEffect(() => {
        if(vendorsLoader)
        {
            fetchvendors();
        }
    }, [vendorsLoader, fetchvendors]);

    if (vendorsLoader || sectorsLoader)
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
        if ( ( vendors.status === '200' || vendors.status === '400' || vendors.status === '500' ) && 
        ( sectors.status === '200' || sectors.status === '400' || sectors.status === '500' ) )
        {
            return <>
                <MetaTags>
                    <title>{pagelocation} | Four-E</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <Vendors vendors={vendors} sectors={sectors} fetchvendors={fetchvendors} setVendorsLoader={setVendorsLoader} />
            </>;
        }
        else
        {
            return history('/logout');
        }
    }
}

export default VendorPage;