/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from "react";
import { Routes as RT, Route, Navigate } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";

export function Routes() {
  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null,
    }),
    shallowEqual
  );

  return (
    <RT>
      {!isAuthorized ? (
        /*Render auth page when user at `/auth` and not authorized.*/
        <Route path='*' element={ <AuthPage /> }>
          
        </Route>
      ) : (
        /*Otherwise redirect to root page (`/`)*/
        // <Route from="/auth" to="/dashboard" />
        <Route path="/auth/login" element={<Navigate to="/dashboard" replace />} />
      )}

      <Route path="/error" element={<ErrorsPage/>} />
      <Route path="/logout" element={<Logout/>} />

      {!isAuthorized ? (
        /*Redirect to `/auth` when user is not authorized*/
        <Route to="/auth/login" />
      ) : (
        <Route path="*" element={ <Layout children={<BasePage />} />}>
          <Route path="*" element={ <BasePage /> } />
        </Route>
      )}
    </RT>
  );
}
