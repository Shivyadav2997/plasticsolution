import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { yearChange } from "api/api";

import { useDispatch } from "react-redux";
import { logout, toggleSidebar, keepSidebar } from "features/User/UserSlice";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import FinancialYear from "components/Custom/FinancialYear";
const AdminNavbar = (props) => {
  const { user, collapseSidebar, isSidebarOpen } = useSelector(
    (store) => store.user
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const toggleCollapse = () => {
    // setCollapseOpen((data) => !data);
    dispatch(toggleSidebar(!collapseSidebar));
    dispatch(keepSidebar(!isSidebarOpen));
  };
  const logoutClick = () => {
    dispatch(logout());
    history.push("/auth/login");
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark navbar-admin" id="navbar-main">
        <Container fluid>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <Link
            className="h4 mb-0 text-dark text-uppercase d-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative bg-dark">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form> */}
          <FinancialYear className="mb-0 mr-1 ml-auto d-none d-sm-block " />
          <Nav className="align-items-center d-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  {/* <span className="avatar avatar-sm rounded-circle">
                    <img alt="..." src={user.logo} />
                  </span> */}
                  <Media className="ml-2 d-block">
                    <span className="mb-0 text-sm font-weight-bold text-dark">
                      {user.name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>

              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/setting" tag={Link}>
                  <i className="ni ni-settings" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
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
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
