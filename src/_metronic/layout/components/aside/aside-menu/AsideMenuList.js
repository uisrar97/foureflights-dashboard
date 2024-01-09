/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { checkIsActive } from "../../../../_helpers";
import { RightsFilter } from "../../../../_helpers/HelperFunctions";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();

  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${
          !hasSubmenu && "menu-item-active"
        } menu-item-open menu-item-not-hightlighted`
      : "";
  };
  const [flightMenu, setFlightMenu] = useState(false);
  const [defineMenu, setDefineMenu] = useState(false);
  const [hotelMenu, setHotelMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [vendorMenu, setVendorMenu] = useState(false);
  const [roomMenu, setRoomMenu] = useState(false);
  const [cmsMenu, setCmsMenu] = useState(false);

  if (
    (location.pathname === "/continents" ||
      location.pathname === "/countries" ||
      location.pathname === "/cities" ||
      location.pathname === "/areas") &&
    !defineMenu
  ) {
    setDefineMenu(!defineMenu);
  }
  if (
    (location.pathname === "/flight-bookings" ||
      location.pathname === "/flight-pnr-request" ||
      location.pathname === "/sales-page" ||
      location.pathname === "/flight-cancel-requests") &&
    !flightMenu
  ) {
    setFlightMenu(!flightMenu);
  }
  if (
    (location.pathname === "/hotel-bookings" ||
      location.pathname === "/hotel-cancel-requests") &&
    !hotelMenu
  ) {
    setHotelMenu(!hotelMenu);
  }
  if (location.pathname === "/manage-vendors" && !vendorMenu) {
    setVendorMenu(!vendorMenu);
  }
  if (location.pathname === "/rooms" && !roomMenu) {
    setRoomMenu(!roomMenu);
  }
  if (
    (location.pathname === "/manage-admins" ||
      location.pathname === "/manage-user-roles" ||
      location.pathname === "/manage-user-rights") &&
    !userMenu
  ) {
    setUserMenu(!userMenu);
  }
  if (location.pathname === "/tours" && !cmsMenu) {
    setCmsMenu(!cmsMenu);
  }

  const clearAll = () => {
    setDefineMenu(false);
    setFlightMenu(false);
    setHotelMenu(false);
    setVendorMenu(false);
    setRoomMenu(false);
    setUserMenu(false);
    setCmsMenu(false);
  };

  return (
    <>
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        <li
          className={
            location.pathname === "/"
              ? `menu-item ${getMenuItemActive("/", false)}`
              : `menu-item ${getMenuItemActive("/dashboard", false)}`
          }
          onClick={() => {
            clearAll();
          }}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <i className="fas fa-tachometer-alt" />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {RightsFilter("define") && (
          <li
            className={
              defineMenu
                ? "menu-item menu-item-active menu-item-open menu-item-not-hightlighted"
                : "menu-item"
            }
            onClick={() => {
              clearAll();
              setDefineMenu(!defineMenu);
            }}
            aria-haspopup="true"
          >
            <div className={defineMenu ? "menu-link active" : "menu-link"}>
              <span className="svg-icon menu-icon">
                <i className="fas fa-compass" />
              </span>
              <span className="menu-text">Define</span>
              <i className="menu-arrow" />
            </div>
            <div className="menu-submenu ">
              <ul className="menu-subnav">
                <li
                  className={`menu-item menu-item-submenu ${getMenuItemActive(
                    "/continents",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link menu-toggle" to="/continents">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Continents</span>
                  </NavLink>
                </li>
                <li
                  className={`menu-item menu-item-submenu ${getMenuItemActive(
                    "/countries",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link menu-toggle" to="/countries">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Countries</span>
                  </NavLink>
                </li>
                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/cities",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link menu-toggle" to="/cities">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Cities</span>
                  </NavLink>
                </li>
                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/areas",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link menu-toggle" to="/areas">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Areas</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
        )}
        {RightsFilter("cms") && (
          <li
            className={
              cmsMenu
                ? "menu-item menu-item-active menu-item-open menu-item-not-hightlighted"
                : "menu-item"
            }
            onClick={() => {
              clearAll();
              setCmsMenu(!cmsMenu);
            }}
            aria-haspopup="true"
          >
            <div className={cmsMenu ? "menu-link active" : "menu-link"}>
              <span className="svg-icon menu-icon">
                <i className="fa-solid fa-folder-tree" />
              </span>
              <span className="menu-text">CMS</span>
              <i className="menu-arrow" />
            </div>
            <div className="menu-submenu ">
              <ul className="menu-subnav">
                {RightsFilter("tours") && (
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                      "/tours",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink className="menu-link menu-toggle" to="/tours">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Tours</span>
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </li>
        )}
        {RightsFilter("flights") && (
          <li
            className={
              flightMenu
                ? "menu-item menu-item-active menu-item-open menu-item-not-hightlighted"
                : "menu-item"
            }
            onClick={() => {
              clearAll();
              setFlightMenu(!flightMenu);
            }}
            aria-haspopup="true"
          >
            <div className={flightMenu ? "menu-link active" : "menu-link"}>
              <span className="svg-icon menu-icon">
                <i className="fas fa-plane-departure" />
              </span>
              <span className="menu-text">Flights</span>
              <i className="menu-arrow" />
            </div>
            <div className="menu-submenu ">
              <ul className="menu-subnav">
                {RightsFilter("flight-bookings") && (
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                      "/flight-bookings",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/flight-bookings"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Flight Bookings</span>
                    </NavLink>
                  </li>
                )}
                {RightsFilter("sales") && (
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                      "/sales-page",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink className="menu-link menu-toggle" to="/sales-page">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Sales Page</span>
                    </NavLink>
                  </li>
                )}
                {RightsFilter("flight-cancel-requests") && (
                  <li
                    className={`menu-item menu-item-submenu  ${getMenuItemActive(
                      "/flight-cancel-requests",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/flight-cancel-requests"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Flight Cancel Requests</span>
                    </NavLink>
                  </li>
                )}
                {RightsFilter("flight-pnr-request") && (
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                      "/flight-pnr-request",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/flight-pnr-request"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Get Booking by PNR </span>
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </li>
        )}
        {RightsFilter("hotels") && (
          <li
            className={
              hotelMenu
                ? "menu-item menu-item-active menu-item-open menu-item-not-hightlighted"
                : "menu-item"
            }
            onClick={() => {
              clearAll();
              setHotelMenu(!hotelMenu);
            }}
            aria-haspopup="true"
          >
            <div className={hotelMenu ? "menu-link active" : "menu-link"}>
              <span className="svg-icon menu-icon">
                <i className="fas fa-hotel" />
              </span>
              <span className="menu-text">Hotels</span>
              <i className="menu-arrow" />
            </div>
            <div className="menu-submenu ">
              <ul className="menu-subnav">
                {RightsFilter("hotel-bookings") && (
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                      "/hotel-bookings",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/hotel-bookings"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Hotel Bookings</span>
                    </NavLink>
                  </li>
                )}
                {RightsFilter("hotel-cancel-requests") && (
                  <li
                    className={`menu-item menu-item-submenu  ${getMenuItemActive(
                      "/hotel-cancel-requests",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/hotel-cancel-requests"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Hotel Cancel Requests</span>
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </li>
        )}
        {RightsFilter("promos") && (
          <li
            className={`menu-item ${getMenuItemActive("/promos-page", false)}`}
            onClick={() => {
              clearAll();
            }}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/promos-page">
              <span className="svg-icon menu-icon">
                <i className="fas fa-handshake" />
              </span>
              <span className="menu-text">Promos</span>
            </NavLink>
          </li>
        )}
        {RightsFilter("vendors") && (
          <li
            className={`menu-item ${getMenuItemActive("/vendors", false)}`}
            onClick={() => {
              clearAll();
            }}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/vendors">
              <span className="svg-icon menu-icon">
                <i className="fas fa-handshake" />
              </span>
              <span className="menu-text">Vendors</span>
            </NavLink>
          </li>
        )}

        {RightsFilter("rooms") && (
          <li
            className={`menu-item ${getMenuItemActive("/rooms", false)}`}
            onClick={() => {
              clearAll();
            }}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/rooms">
              <span className="svg-icon menu-icon">
                <i className="fas fa-door-open" />
              </span>
              <span className="menu-text">Rooms</span>
            </NavLink>
          </li>
        )}
        {RightsFilter("users") && (
          <li
            className={
              userMenu
                ? "menu-item menu-item-active menu-item-open menu-item-not-hightlighted"
                : "menu-item"
            }
            onClick={() => {
              clearAll();
              setUserMenu(!userMenu);
            }}
            aria-haspopup="true"
          >
            <div className={userMenu ? "menu-link active" : "menu-link"}>
              <span className="svg-icon menu-icon">
                <i className="fas fa-users" />
              </span>
              <span className="menu-text">Users</span>
              <i className="menu-arrow" />
            </div>
            <div className="menu-submenu ">
              <ul className="menu-subnav">
                {RightsFilter("manage-user-rights") && (
                  <li
                    className={`menu-item menu-item-submenu  ${getMenuItemActive(
                      "/manage-user-rights",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/manage-user-rights"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Manage User Rights</span>
                    </NavLink>
                  </li>
                )}
                {RightsFilter("manage-user-roles") && (
                  <li
                    className={`menu-item menu-item-submenu  ${getMenuItemActive(
                      "/manage-user-roles",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/manage-user-roles"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Manage User Roles</span>
                    </NavLink>
                  </li>
                )}
                {RightsFilter("manage-admins") && (
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                      "/manage-admins",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/manage-admins"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Manage Admins</span>
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </li>
        )}
        {RightsFilter("site-settings") && (
          <li
            className={`menu-item ${getMenuItemActive(
              "/site-settings",
              false
            )}`}
            onClick={() => {
              clearAll();
            }}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/site-settings">
              <span className="svg-icon menu-icon">
                <i className="fas fa-cogs" />
              </span>
              <span className="menu-text">Site Settings</span>
            </NavLink>
          </li>
        )}
      </ul>
    </>
  );
}
