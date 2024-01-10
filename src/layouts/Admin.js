import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import LoadingOverlay from "react-loading-overlay";
import routes from "routes.js";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "features/User/UserSlice";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, collapseSidebar, fyear, user } = useSelector(
    (store) => store.user
  );
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (
        prop.layout === "/admin"
        // && prop.path.includes("/" + user.path + "/")
      ) {
        if (prop.hasChild) {
          return prop.childRoutes.map((prop2, key2) => {
            return (
              <Route
                path={prop2.layout + prop2.path}
                component={prop2.component}
                key={key2}
              />
            );
          });
        } else {
          return (
            <Route
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            />
          );
        }
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].hasChild) {
        for (let j = 0; j < routes[i].childRoutes.length; j++) {
          if (
            path ==
            routes[i].childRoutes[j].layout + routes[i].childRoutes[j].path
          ) {
            return routes[i].childRoutes[j].name;
          }
        }
      } else if (path.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      } else if (
        path.indexOf(":") !== -1 &&
        path.substring(0, path.lastIndexOf("/")) ==
          (routes[i].layout + routes[i].path).substring(
            0,
            path.lastIndexOf("/")
          )
      ) {
        path.indexOf(":");
      }
    }
    return "Brand";
  };

  return (
    <>
      <LoadingOverlay active={loading} spinner>
        <Sidebar
          {...props}
          routes={routes}
          logo={{
            innerLink: `/admin/${user.path}/dashboard`,
            imgSrc: require("../assets/img/brand/logo.png"),
            imgAlt: "...",
          }}
        />

        <div
          className={`${
            collapseSidebar ? "main-content-open" : "main-content-close"
          } main-content bg-gradient-lightDefault`}
          style={{
            minHeight: "100vh",
          }}
          ref={mainContent}
          onTouchStart={() => dispatch(toggleSidebar(false))}
        >
          <AdminNavbar
            {...props}
            brandText={getBrandText(props.location.pathname)}
          />
          <Switch>
            {getRoutes(routes)}
            <Redirect from="*" to={`/admin/${user.path}/dashboard`} />
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </LoadingOverlay>
    </>
  );
};

export default Admin;
