import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  FormFeedback,
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
import { useState, useEffect, useRef } from "react";
import { loginApi } from "api/api";
import { toast } from "react-toastify";
const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const [errorUname, setErrorUname] = useState("");
  const [errorPass, setErrorPass] = useState();
  const unameRef = useRef(null);
  const loginSubmit = async () => {
    if (uname === "") {
      setErrorUname("User name is required");
    }
    if (pass === "") {
      setErrorPass("Password is required");
    }
    if (uname && pass) {
      const loginResponse = await loginApi(uname, pass);
      if (loginResponse.sucess) {
        dispatch(login(loginResponse));
        history.push("/admin/index");
      } else {
        // alert(loginResponse.msg);
        toast(loginResponse.msg);
      }
    }
  };

  useEffect(() => {
    if (unameRef.current) {
      unameRef.current.focus();
    }
  }, [unameRef.current]);

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="">
            <div className="text-center text-muted mb-4">
              <small>Log in to start your session </small>
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
                    onChange={(e) => {
                      setUname(e.target.value);
                      setErrorUname("");
                    }}
                    ref={unameRef}
                    autoFocus
                    // invalid={errorUname !== ""}
                    // valid={errorUname === ""}
                  />
                </InputGroup>
                {errorUname && <label className="errorMsg">{errorUname}</label>}
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
                    onChange={(e) => {
                      setPass(e.target.value);
                      setErrorPass("");
                    }}
                  />
                </InputGroup>
                {errorPass && <label className="errorMsg">{errorPass}</label>}
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
              className="text-dark"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          {/* <Col className="text-right" xs="6">
            <a
              className="text-dark"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Contact : 9662779868</small>
            </a>
          </Col> */}
        </Row>
      </Col>
    </>
  );
};

export default Login;
