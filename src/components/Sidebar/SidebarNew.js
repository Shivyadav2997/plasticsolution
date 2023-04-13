import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
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
import FinancialYear from "components/Custom/FinancialYear";

const SidebarNew = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((store) => store.user);
  let allStates = { sales: false, purchase: false };
  const [collapseOpen, setCollapseOpen] = useState();
  const [submenuOpen, setSubMenuOpen] = useState(allStates);
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        if (prop.hasChild) {
          return (
            <NavItem key={key}>
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
                <div style={{ display: isOpen ? "block" : "none" }}>
                  {prop.name}
                </div>
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
                          <div style={{ display: isOpen ? "block" : "none" }}>
                            {prop2.name}
                          </div>
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
                <div style={{ display: isOpen ? "block" : "none" }}>
                  {prop.name}
                </div>
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
  return (
    <div className="container">
      <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            Logo
          </h1>
          <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {createLinks(routes)}
        {/* {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeclassName="active"
          >
            <div className="icon">{item.icon}</div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className="link_text"
            >
              {item.name}
            </div>
          </NavLink>
        ))} */}
      </div>
    </div>
  );
};

export default SidebarNew;
