import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
const Footer = () => {
  const history = useHistory();
  const { user } = useSelector((store) => store.user);
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}
            <a
              className="font-weight-bold ml-1"
              href="http://prishasoftware.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Prisha Software Pvt Ltd
            </a>
          </div>
        </Col>

        <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end">
            <NavItem>
              <NavLink href="javascript:void(0)">About Us</NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="javascript:void(0)"
                onClick={() => {
                  history.push("/admin/" + user.path + "/contact-us");
                }}
              >
                Contact
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="javascript:void(0)">Privacy</NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
