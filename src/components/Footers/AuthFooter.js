import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

const Login = () => {
  return (
    <>
      <footer className="py-2">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <div className="copyright text-center text-xl-left text-muted">
                © {new Date().getFullYear()}{" "}
                <a
                  className="font-weight-bold ml-1"
                  href="http://prishasoftware.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Prisha Software Pvt Ltd
                </a>
              </div>
            </Col>
            <Col xl="6">
              <Nav className="nav-footer justify-content-center justify-content-xl-end">
                <NavItem>
                  <NavLink href="#">About Us</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="">Contact</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="">Privacy</NavLink>
                </NavItem>
              </Nav>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Login;
