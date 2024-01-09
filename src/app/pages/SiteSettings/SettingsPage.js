import React, { useEffect, useState, useCallback } from "react";
import { SiteSettings } from "../../../_metronic/_partials";
import { useNavigate } from "react-router-dom";
import { AuthFunction } from '../../../_metronic/_helpers/HelperFunctions';
import MetaTags from 'react-meta-tags';
import Axios from './../../service';
import { Plane } from 'react-loader-spinner';

function SettingsPage() {
  const pagelocation = 'Settings';
  const options = AuthFunction();
  const history = useNavigate();
  const [Settings, setSettings] = useState({});
  const [loadings, setLoadings] = useState(true);

  const fetchSettings = useCallback(async () => {
    Axios(options).get('admin/getsettings')
      .then((response) => {
        const res = response.data;
        setSettings(res);
        setLoadings(false);
      });
  }, [options]);

  useEffect(() => {
    if (loadings)
    {
      fetchSettings();
    }
  }, [loadings, fetchSettings]);

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
    if (Settings.status === '200' || Settings.status === '400' || Settings.status === '500')
    {
      return <>
        <MetaTags>
          <title>{pagelocation} | Four-E</title>
          <meta name="description" content="#" />
        </MetaTags>
        <SiteSettings Settings={Settings} fetchSettings={fetchSettings} />
      </>
    }
    else
    {
      return history('/logout');
    }
  }
}

export default SettingsPage;

