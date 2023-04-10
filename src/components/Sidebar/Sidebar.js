import { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import { useSelector } from "react-redux";
// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  FormGroup,
  Input,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { logout } from "features/User/UserSlice";
import { useHistory } from "react-router-dom";
var ps;

const Sidebar = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((store) => store.user);
  let allStates = { sales: false, purchase: false };
  const [collapseOpen, setCollapseOpen] = useState();
  const [submenuOpen, setSubMenuOpen] = useState(allStates);
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  function getFinancialYear(pastYear = false) {
    var fiscalyear = "";
    var today = new Date();
    if (pastYear) {
      today = new Date(new Date().setFullYear(today.getFullYear() - 1));
    }
    if (today.getMonth() + 1 <= 3) {
      fiscalyear =
        (today.getFullYear() - 1).toString().substring(2, 4) +
        "-" +
        today.getFullYear().toString().substring(2, 4);
    } else {
      fiscalyear =
        today.getFullYear().toString().substring(2, 4) +
        "-" +
        (today.getFullYear() + 1).toString().substring(2, 4);
    }
    return fiscalyear;
  }

  const logoutClick = () => {
    dispatch(logout());
    history.push("/auth/login");
  };
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        if (prop.hasChild) {
          return (
            <NavItem>
              <NavLink
                onClick={() => {
                  const updStates = { ...submenuOpen };
                  updStates[prop.state] = !updStates[prop.state];
                  setSubMenuOpen(updStates);
                }}
                style={{ cursor: "pointer" }}
              >
                <i className={prop.icon}>
                  {prop.iconCmp && (
                    <prop.iconCmp style={{ fontSize: "18px" }} />
                  )}
                </i>
                {prop.name}
              </NavLink>
              <Collapse isOpen={submenuOpen[prop.state]}>
                <Nav>
                  {prop.childRoutes.map((prop2, key2) => {
                    return (
                      <NavItem key={key2}>
                        <NavLink
                          to={prop2.layout + prop2.path}
                          tag={NavLinkRRD}
                          onClick={closeCollapse}
                          activeClassName="active"
                          className="pl-5"
                        >
                          <i className={prop2.icon}>
                            {prop2.iconCmp && (
                              <prop2.iconCmp style={{ fontSize: "18px" }} />
                            )}
                          </i>
                          {prop2.name}
                        </NavLink>
                      </NavItem>
                    );
                  })}
                </Nav>
              </Collapse>
            </NavItem>
          );
        } else {
          return (
            <NavItem key={key}>
              <NavLink
                to={prop.layout + prop.path}
                tag={NavLinkRRD}
                onClick={closeCollapse}
                activeClassName="active"
              >
                <i className={prop.icon}>
                  {prop.iconCmp && (
                    <prop.iconCmp style={{ fontSize: "18px" }} />
                  )}
                </i>
                {prop.name}
              </NavLink>
            </NavItem>
          );
        }
      } else {
        return null;
      }
    });
  };

  const { bgColor, routes, logo } = props;

  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white "
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : (
          "Account Digital"
        )}
        <FormGroup className="mb-0 mr-1 ml-auto d-md-none">
          <Input type="select" size="sm">
            <option value={2}>{getFinancialYear(true)}</option>
            <option value={1} selected>
              {getFinancialYear()}
            </option>
          </Input>
        </FormGroup>
        {/* User */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <DropdownMenu
              aria-labelledby="navbar-default_dropdown_1"
              className="dropdown-menu-arrow"
              right
            >
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Something else here</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={require("../../assets/img/theme/team-1-800x800.jpg")}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                href="#pablo"
                onClick={(e) => {
                  e.preventDefault();
                  logoutClick();
                }}
              >
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                      Account Digital
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                      Account Digital
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* <hr className="my-3 d-md-block d-none" />
          <h3 className="d-flex justify-content-center mb-0">{user.name}</h3>
          <hr className="my-3" /> */}
          {/* Navigation */}
          <Nav navbar>{createLinks(routes)}</Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
