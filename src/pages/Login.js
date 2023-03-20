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
import { useState } from "react";
import { loginApi } from "api/api";
import { toast } from "react-toastify";
import { Formik, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import { TextField } from "components/Custom/TextField";
const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const [errorUname, setErrorUname] = useState("");
  const [errorPass, setErrorPass] = useState();
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

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
        dispatch(
          login({ token: loginResponse.token, name: loginResponse.name })
        );
        history.push("/admin/index");
      } else {
        // alert(loginResponse.msg);
        toast(loginResponse.msg);
      }
    }
  };

  const validate = Yup.object({
    firstName: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Required"),
    lastName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 charaters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password must match")
      .required("Confirm password is required"),
  });

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Log in to start your session</small>
            </div>
            <Button onClick={handleToggle}></Button>
            {/* <Form role="form">
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
            </Form> */}
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validate}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {(formik) => (
                <div>
                  <h1 className="my-4 font-weight-bold .display-4">Sign Up</h1>
                  <Form>
                    <TextField
                      label="First Name"
                      name="firstName"
                      type="text"
                    />
                    <TextField label="last Name" name="lastName" type="text" />
                    <TextField label="Email" name="email" type="email" />
                    <TextField
                      label="password"
                      name="password"
                      type="password"
                    />
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                    />
                    <button className="btn btn-dark mt-3" type="submit">
                      Register
                    </button>
                    <button className="btn btn-danger mt-3 ml-3" type="reset">
                      Reset
                    </button>
                  </Form>
                </div>
              )}
            </Formik>
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
