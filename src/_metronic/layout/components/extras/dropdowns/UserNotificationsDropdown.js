/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import Axios from "../../../../../app/service";
import {AuthFunction} from '../../../../_helpers/HelperFunctions';


const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

export function UserNotificationsDropdown({ Notifications, loadings, fetchrequests }) {
  const options = AuthFunction();
  const [key, setKey] = useState("Alerts");
  const [showNoti, setShowNoti] = useState(false);
  const history = useNavigate();

  const styles = {
    notifications: {
      position: 'absolute',
      inset: '0px auto auto 0px',
      margin: '0px',
      transform: 'translate(-302px, 65px)'
    }
  }


  let notiRef = useRef();

  useEffect(() => {

    let handler = (event) => {
      if (!notiRef.current.contains(event.target)) {
        setShowNoti(false)
      }
    };

    document.addEventListener("mousedown", handler);

    return () => { document.removeEventListener("mousedown", handler) };
  });

  async function markasread(id) {
    Axios(options).get('admin/marknotificationsasread?id=' + id);
    fetchrequests();
    setShowNoti(false);
  }


  let rows = [];
  let count = 0;
  if (loadings === false && Notifications.data.length > 0) {
    count = Notifications.data.length;
    rows = Notifications.data.map((notification) => {
      let id = notification.id;
      let text = notification.notification_text;
      let notification_type = notification.notification_type;

      return { id, text, notification_type };
    });
  }

  const bgImage = toAbsoluteUrl("/media/misc/bg-1.jpg");

  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      offcanvas:
        objectPath.get(uiService.config, "extras.notifications.layout") ===
        "offcanvas",
    };
  }, [uiService]);
  
  return (
    <>

      {!layoutProps.offcanvas && (
        <Dropdown drop="down" align={{ lg: 'end' }} ref={notiRef}>
          <Dropdown.Toggle
            as={DropdownTopbarItemToggler}
            id="kt_quick_notifications_toggle"
            onClick={() => { setShowNoti(!showNoti) }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="user-notification-tooltip">
                  User Notifications
                </Tooltip>
              }
            >
              <div
                className="btn btn-icon btn-clean btn-lg mr-1 pulse pulse-primary"
                id="kt_quick_notifications_toggle"
              >
                <span className="svg-icon svg-icon-xl svg-icon-primary notify">
                    <i className="fas fa-envelope"/>
                </span>
                {
                  (count > 0) &&
                  <>
                    <span className="pulse-ring" />
                    <span className="pulse-ring" />
                  </>
                }
              </div>
            </OverlayTrigger>
          </Dropdown.Toggle>

          <div className={(showNoti) ? "dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg show" : "dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg"} style={styles.notifications}>
            <form>
              {/** Head */}
              <div
                className="d-flex flex-column pt-12 bgi-size-cover bgi-no-repeat rounded-top"
                style={{ backgroundImage: `url(${bgImage})` }}
              >
                <h4 className="d-flex flex-center rounded-top">
                  <span className="text-white">User Notifications</span>
                  <span className="btn btn-text btn-success btn-sm font-weight-bold btn-font-md ml-2">
                    {count} new
                  </span>
                </h4>

                <Tab.Container defaultActiveKey={key}>
                  <Tab.Content className="tab-content">
                    <Tab.Pane eventKey="Alerts">
                      <PerfectScrollbar
                        options={perfectScrollbarOptions}
                        className="scroll"
                        style={{ maxHeight: "300px", position: "relative" }}
                      >
                        {
                          rows.length > 0 ? rows.map((row, index) => {
                            return (
                              <div key={Math.random()}>
                                <div className="d-flex align-items-center pt-4 pb-0 pl-4 pr-4" onClick={() => {
                                  history('/flight-cancel-requests');
                                  markasread(row.id)
                                }}>
                                  <Link
                                      to="/flight-cancel-requests"
                                      className="d-flex text-dark text-hover-primary mb-1 font-size-lg"
                                    >
                                  <div className="symbol symbol-40 symbol-light-info mr-5">
                                    <span className="symbol-label">
                                      <i className="fas fa-bell h3 pt-2 text-dark"/>
                                    </span>
                                  </div>
                                  <div className="d-flex flex-column font-weight-bold">
                                    {row.notification_type === "cancel_booking" ? "Cancel Request" : "Other Notification"}
                                    <span className="text-muted">
                                      {row.text}
                                    </span>
                                  </div>
                                  </Link> 
                                </div>
                                <hr className="p-0 m-0" />
                              </div>
                            );
                          })
                            :
                            <div className="d-flex flex-center text-center text-muted min-h-200px">
                              All caught up!
                              <br />
                              No new notifications.
                            </div>
                        }
                      </PerfectScrollbar>
                    </Tab.Pane>
                    <Tab.Pane eventKey="Logs" id="topbar_notifications_logs">
                      <div className="d-flex flex-center text-center text-muted min-h-200px">
                        All caught up!
                        <br />
                        No new notifications.
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </form>
          </div>
        </Dropdown>
      )}
    </>
  );
}