import React, { StrictMode } from "react";
import "pages/arsha.css";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Index from "pages/Index";
import ContactUs from "pages/contactus";
import Pricing from "pages/pricing";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <StrictMode>
  <BrowserRouter>
    <ToastContainer position="top-center" autoClose={1250} />
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
        <Route path="/contactus" component={ContactUs} />
        <Route path="/pricing" component={Pricing} />

        <Route path="/" component={Index} />
      </Switch>
    </Provider>
  </BrowserRouter>
  // </StrictMode>
);
