import React, { StrictMode } from "react";
import "index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { store } from "store";
import { Provider } from "react-redux";
import ProtectedRoute from "pages/ProtectedRoute";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <Switch>
        <Route
          path="/admin"
          render={(props) => (
            <ProtectedRoute>
              <AdminLayout {...props} />
            </ProtectedRoute>
          )}
        />
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        <Redirect from="/" to="/admin/index" />
      </Switch>
    </Provider>
  </BrowserRouter>
  // </StrictMode>
);
