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

import { useDispatch } from "react-redux";
import { logout } from "features/User/UserSlice";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
const AdminNavbar = (props) => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const logoutClick = () => {
    dispatch(logout());
    history.push("/auth/login");
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
  return (
    <>
      <Navbar className="navbar-top navbar-dark" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-dark text-uppercase d-none d-lg-inline-block"
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
          <FormGroup className="mb-0 mr-1 ml-auto d-none d-md-block">
            <Input type="select" size="sm">
              <option value={2}>{getFinancialYear(true)}</option>
              <option value={1} selected>
                {getFinancialYear()}
              </option>
            </Input>
          </FormGroup>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img alt="..." src={user.logo} />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
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
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
