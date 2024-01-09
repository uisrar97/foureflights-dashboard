import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { LayoutSplashScreen } from "../_metronic/layout";
import { DashboardPage } from "./pages/DashboardPage";

// Define Imports
import ContinentsPage from "./pages/Define/ContinentsPage";
import CountriesPage from "./pages/Define/CountriesPage";
import CitiesPage from "./pages/Define/CitiesPage";
import AreasPage from "./pages/Define/AreasPage";

// CMS Imports
import ToursPage from "./pages/CMS/ToursPage";

// Flights Imports
import FlightBookingsPage from "./pages/Flights/FlightBookingsPage";
import FlightCancelRequestsPage from "./pages/Flights/FlightCancelRequestsPage";

// Hotel Imports
import HotelBookingsPage from "./pages/Hotels/HotelBookingsPage";
import HotelCancelRequestsPage from "./pages/Hotels/HotelCancelRequestsPage";

// Vendors Imports
import VendorPage from "./pages/Vendors/VendorPage";

// Rooms Import
import RoomsPage from "./pages/Rooms/RoomsPage";

// Users Imports
import UserRightsPage from "./pages/Users/UserRightsPage";
import UserRolesPage from "./pages/Users/UserRolesPage";
import UserAdminPage from "./pages/Users/UserAdminPage";

// Site Settings Imports
import SettingsPage from "./pages/SiteSettings/SettingsPage";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import {
  RightsFilter,
  AuthUserData,
} from "../_metronic/_helpers/HelperFunctions";
import SalesPage from "./pages/Flights/SalesPage";
import PromosPage from "./pages/promos/PromosPage";
import MyBooking from "./pages/Flights/MyBooking";
export default function BasePage() {
  const userData = AuthUserData();
  return (
    <Routes fallback={<LayoutSplashScreen />}>
      <Route exact path="/" element={<Navigate to="/dashboard" replace />} />
      <Route exact path={"/dashboard"} element={<DashboardPage />} />

      {/* Define Menu */}
      {RightsFilter("define") && (
        <Route exact path="/continents" element={<ContinentsPage />} />
      )}
      {RightsFilter("define") && (
        <Route exact path="/countries" element={<CountriesPage />} />
      )}
      {RightsFilter("define") && (
        <Route exact path="/cities" element={<CitiesPage />} />
      )}
      {RightsFilter("define") && (
        <Route exact path="/areas" element={<AreasPage />} />
      )}

      {/* CMS Menu */}
      {RightsFilter("tours") && (
        <Route exact path="/tours" element={<ToursPage />} />
      )}

      {/* Flights Menu */}
      {RightsFilter("flight-bookings") && (
        <Route exact path="/flight-bookings" element={<FlightBookingsPage />} />
      )}
      {RightsFilter("sales") && (
        <Route exact path="/sales-page" element={<SalesPage />} />
      )}
      {RightsFilter("flight-cancel-requests") && (
        <Route
          exact
          path="/flight-cancel-requests"
          element={<FlightCancelRequestsPage />}
        />
      )}
      {RightsFilter("flight-pnr-request") && (
        <Route exact path="/flight-pnr-request" element={<MyBooking />} />
      )}

      {/* Hotels Menu */}
      {RightsFilter("hotel-bookings") && (
        <Route exact path="/hotel-bookings" element={<HotelBookingsPage />} />
      )}
      {RightsFilter("hotel-booking-cancellation") && (
        <Route
          exact
          path="/hotel-cancel-requests"
          element={<HotelCancelRequestsPage />}
        />
      )}

      {RightsFilter("promos") && (
        <Route exact path="/promos-page" element={<PromosPage />} />
      )}
      {/* Vendors Menu */}
      {RightsFilter("vendors") && (
        <Route exact path="/vendors" element={<VendorPage />} />
      )}

      {/* Rooms Menu */}
      {RightsFilter("rooms") && (
        <Route exact path="/rooms" element={<RoomsPage />} />
      )}

      {/* Users Menu */}
      {RightsFilter("manage-user-rights") && (
        <Route exact path="/manage-user-rights" element={<UserRightsPage />} />
      )}
      {RightsFilter("manage-user-roles") && (
        <Route exact path="/manage-user-roles" element={<UserRolesPage />} />
      )}
      {RightsFilter("manage-admins") && Number(userData.parent_id) === 0 && (
        <Route exact path="/manage-admins" element={<UserAdminPage />} />
      )}

      {/* Site Settings */}
      {RightsFilter("site-settings") && (
        <Route exact path="/site-settings" element={<SettingsPage />} />
      )}
      <Route element={<ErrorsPage />} />
    </Routes>
  );
}
