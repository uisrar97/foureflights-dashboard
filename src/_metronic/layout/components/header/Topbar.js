import React, { useMemo, useState, useEffect, useCallback } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { UserNotificationsDropdown } from "../extras/dropdowns/UserNotificationsDropdown";
import { QuickUserToggler } from "../extras/QuiclUserToggler";
import Axios from "../../../../app/service";
import { AuthFunction, RightsFilter } from "../../../_helpers/HelperFunctions";
// import Pusher from 'pusher-js';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

export function Topbar() {
  const uiService = useHtmlClassService();
  const options = AuthFunction();
  const layoutProps = useMemo(() => {
    return {
      viewSearchDisplay: objectPath.get(
        uiService.config,
        "extras.search.display"
      ),
      viewNotificationsDisplay: objectPath.get(
        uiService.config,
        "extras.notifications.display"
      ),
      viewQuickActionsDisplay: objectPath.get(
        uiService.config,
        "extras.quick-actions.display"
      ),
      viewCartDisplay: objectPath.get(uiService.config, "extras.cart.display"),
      viewQuickPanelDisplay: objectPath.get(
        uiService.config,
        "extras.quick-panel.display"
      ),
      viewLanguagesDisplay: objectPath.get(
        uiService.config,
        "extras.languages.display"
      ),
      viewUserDisplay: objectPath.get(uiService.config, "extras.user.display"),
    };
  }, [uiService]);

  //hooks for notifications
  const [Notifications, setNotifications] = useState({});
  const [loadings, setLoadings] = useState(true);

  const fetchrequests = useCallback(async () => {
    Axios(options)
      .get("admin/getnotifications")
      .then((response) => {
        const res = response.data;
        setNotifications(res);
        setLoadings(false);
      });
  }, [options]);

  useEffect(() => {
    // const pusher = new Pusher('253b8abff9d29c09aa09', {
    //   cluster: 'mt1',
    //   wsHost: '127.0.0.1',
    //   wsPort: 6001,
    //   forceTLS: false
    // });
    // const channel = pusher.subscribe('notification-channel');
    // channel.bind('notification-event', function (PushData) {
    //   fetchrequests();
    //   if (Notifications && Notifications.length > 0) {
    //     toast(PushData.data);
    //   }

    // });
    if (loadings === true) {
      fetchrequests();
    }
  }, [Notifications, loadings, fetchrequests]);

  return (
    <div className="topbar">
      {layoutProps.viewNotificationsDisplay && RightsFilter("notification") && (
        <UserNotificationsDropdown
          Notifications={Notifications}
          loadings={loadings}
          fetchrequests={fetchrequests}
        />
      )}

      {layoutProps.viewUserDisplay && <QuickUserToggler />}
    </div>
  );
}
