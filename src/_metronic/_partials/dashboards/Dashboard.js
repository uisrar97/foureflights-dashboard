import React, { useMemo } from "react";
import MetaTags from 'react-meta-tags';
import objectPath from "object-path";
import { useHtmlClassService } from "../../layout";
import { FoureDashboard } from "./FoureDashboard";

export function Dashboard() {
    const pagelocation = 'Dashboard';
    const uiService = useHtmlClassService();
    const layoutProps = useMemo(() => {
        return {
            demo: objectPath.get(
                uiService.config,
                "demo"
            )
        };
    }, [uiService]);
    return <>
        <MetaTags>
            <title>{pagelocation} | Four-E</title>
            <meta name="description" content="#" />
        </MetaTags>
        {layoutProps.demo === 'demo1' && <FoureDashboard />}
    </>;
}
