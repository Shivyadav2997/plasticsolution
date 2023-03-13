import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { login } from "features/User/UserSlice";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { loginApi } from "api/api";
const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const loginSubmit = async () => {
    const loginResponse = await loginApi(uname, pass);
    if (loginResponse.sucess) {
      dispatch(login({ token: loginResponse.token, name: loginResponse.name }));
      history.push("/admin/index");
    } else {
      alert(loginResponse.msg);
    }
  };
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Log in to start your session</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="User Name"
                    type="text"
                    autoComplete="new-email"
                    onChange={(e) => setUname(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    onChange={(e) => setPass(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="button"
                  // onClick={() => {
                  //   dispatch(login({ id: 1, name: "shiv", lname: "yadav" }));
                  //   history.push("/admin/index");
                  // }}
                  onClick={loginSubmit}
                >
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Contact : 9662779868</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
