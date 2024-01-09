/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { useSelector } from "react-redux";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";

export function UserProfileDropdown() {
  const { user } = useSelector((state) => state.auth);
  const uiService = useHtmlClassService();
  const history = useNavigate();
  const layoutProps = useMemo(() => {
    return {
      light:
        objectPath.get(uiService.config, "extras.user.dropdown.style") ===
        "light",
    };
  }, [uiService]);
  const [drop, setDrop] = useState(false);

  const styles = {
    dropdown: {
      backgroundColor: "#fff",
      right: "0%",
      top: "100%",
      width: "400px",
      boxShadow: "0 2px 5px 1px rgb(64 60 67 / 35%)",
    },
  };

  let menuRef = useRef();
  useEffect(() => {
    let handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setDrop(false);
      }
    };
    function timeout() {
      setTimeout(function () {
        timeout();
        // }, 1800000);
      }, 86400000);
      if (document.hidden && window.location.pathname !== "/auth/login") {
        history("/logout");
      }
    }

    setTimeout(() => {
      if (document.hidden && window.location.pathname !== "/auth/login") {
        timeout();
      }
      // },1800000);
    }, 86400000);

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return (
    <Dropdown drop="down" align={{ lg: "end" }} ref={menuRef}>
      <Dropdown.Toggle
        as={DropdownTopbarItemToggler}
        id="dropdown-toggle-user-profile"
        onClick={() => {
          setDrop(!drop);
        }}
      >
        <div
          className={
            "btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
          }
        >
          <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
            Hello,
          </span>
          {user.firstName}
          <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3"></span>
          <span className="symbol symbol-35 symbol-light-primary">
            <span className="symbol-label font-size-h5 font-weight-bold">
              {user.firstName.slice(0, 1)}
            </span>
          </span>
        </div>
      </Dropdown.Toggle>
      {drop && (
        <div className="position-absolute" style={styles.dropdown}>
          <>
            {/** ClassName should be 'dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
            {layoutProps.light && (
              <>
                <div className="d-flex align-items-center p-8 rounded-top">
                  <div className="symbol symbol-md bg-light-primary mr-3 flex-shrink-0">
                    <img
                      src={toAbsoluteUrl("/media/users/300_21.jpg")}
                      alt=""
                    />
                  </div>
                  <div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">
                    {/* {user.firstName} {user.lastName} */}
                  </div>
                  <span className="label label-light-success label-lg font-weight-bold label-inline">
                    3 messages
                  </span>
                </div>
                <div className="separator separator-solid"></div>
              </>
            )}
            <div
              className="d-flex align-items-center justify-content-between flex-wrap p-8 bgi-size-cover bgi-no-repeat rounded-top"
              style={{
                backgroundImage: `url(${toAbsoluteUrl(
                  "/media/misc/bg-1.jpg"
                )})`,
              }}
            >
              <div className="symbol bg-white-o-15 mr-3">
                <span className="symbol-label text-success font-weight-bold font-size-h4">
                  {user.firstName.slice(0, 1)}
                </span>
                {/* <img alt="Pic" className="hidden" src={user.pic} /> */}
              </div>
              <div className="text-white m-0 flex-grow-1 mr-3 font-size-h5">
                {user.firstName} {user.lastName}
              </div>
            </div>
          </>

          <div className="navi navi-spacer-x-0 pt-5">
            <div className="navi-footer  px-8 py-5">
              <Link
                to="/logout"
                className="btn btn-light-primary font-weight-bold"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      )}
    </Dropdown>
  );
}
