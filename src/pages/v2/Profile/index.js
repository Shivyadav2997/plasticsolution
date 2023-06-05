import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  FormGroup,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import { useEffect, useState } from "react";
import { profileGet, updateProfile, updatePassword } from "api/apiv2";
import { useDispatch, useSelector } from "react-redux";
import { setLoader, logout } from "features/User/UserSlice";
import logo from "assets/img/brand/logo.png";
import { CustomInput } from "components/Custom/CustomInput";
import CustomModal from "components/Custom/CustomModal";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const Profile = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });
  const dispatch = useDispatch();
  const { user, fyear } = useSelector((store) => store.user);
  const [showPass, setShowPass] = useState(false);
  const [showNPass, setShowNPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const inputRef = useRef(null);
  const [show, setShow] = useState(false);
  const history = useHistory();
  const [profile, setProfile] = useState({
    id: "",
    b_name: "",
    b_owner: "",
    b_mo: "",
    b_mo2: null,
    b_mo3: null,
    b_mo4: null,
    b_add: "",
    b_city: "",
    b_gst: "",
    email: "",
    logo: "",
    lat: "",
    lng: "",
    letterpad: "",
    create_date: "",
  });

  const profUpdate = async (payload) => {
    dispatch(setLoader(true));
    var resp = await updateProfile(user.token, payload);
    dispatch(setLoader(false));
    if (resp.data.success == 1) {
      Toast.fire({
        icon: "success",
        title: resp.data.msg,
      });
    } else {
      Toast.fire({
        icon: "error",
        title: resp.data.msg || "Something wen't wrong",
      });
    }
  };
  const getProfile = async () => {
    dispatch(setLoader(true));
    var data = await profileGet(user.token);
    if (data.data.length > 0) {
      setProfile(data.data[0]);
    } else {
      setProfile({
        id: "",
        b_name: "",
        b_owner: "",
        b_mo: "",
        b_mo2: "",
        b_mo3: "",
        b_mo4: "",
        b_add: "",
        b_city: "",
        b_gst: "",
        email: "",
        logo: "",
        lat: "",
        lng: "",
        letterpad: "",
        create_date: "",
      });
    }
    dispatch(setLoader(false));
  };

  const updatePass = async (payload) => {
    dispatch(setLoader(true));
    const resp = await updatePassword(user.token, payload);
    dispatch(setLoader(false));
    if (resp.data.success == 1) {
      Toast.fire({
        icon: "success",
        title: resp.data.msg,
      });
      setShow(!show);
      setTimeout(() => {
        dispatch(logout());
        history.push("/auth/login");
      }, 1500);
    } else {
      Toast.fire({
        icon: "error",
        title: resp.data.msg || "Something wen't wrong",
      });
    }
  };
  const validate = Yup.object({
    email: Yup.string().email("Email is invalid"),
    city: Yup.string().required("Required"),
  });

  const validatePass = Yup.object({
    pass: Yup.string().required("Required"),
    npass: Yup.string().required("Required"),
    cpass: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("npass")], "Your passwords do not match."),
  });

  useEffect(() => {
    getProfile();
  }, [fyear]);

  const handleToggle = (e) => {
    e.preventDefault();
    setShow(!show);
  };
  return (
    <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <CustomModal
        show={show}
        handleToggle={handleToggle}
        title={`Change Password`}
        footer={
          <Button
            type="submit"
            className="mr-1"
            color="primary"
            block
            size="md"
            onClick={() => {
              inputRef.current.handleSubmit();
            }}
          >
            Update Password
          </Button>
        }
      >
        <Formik
          initialValues={{
            pass: "",
            npass: "",
            cpass: "",
          }}
          validationSchema={validatePass}
          onSubmit={(values) => {
            console.log("passValue", values);
            updatePass({ oldpass: values.pass, newpass: values.cpass });
          }}
          validateOnBlur={false}
          validateOnChange={false}
          innerRef={inputRef}
        >
          {(formik) => (
            <div>
              <Form>
                <FormGroup className="mb-1">
                  <label className="form-control-label">Current Password</label>
                  <InputGroup className="input-group-alternative">
                    <CustomInput
                      placeholder="Current Password"
                      label=""
                      name="pass"
                      type={showPass ? "text" : "password"}
                      withFormGroup={false}
                    />
                    <InputGroupAddon addonType="append" className="ml-0">
                      <Button
                        className="pt-0 pb-0 btn-outline-primary"
                        type="button"
                        onClick={() => {
                          setShowPass(!showPass);
                        }}
                      >
                        <FaEye />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
                <FormGroup className="mb-1">
                  <label className="form-control-label">New Password</label>
                  <InputGroup className="input-group-alternative">
                    <CustomInput
                      placeholder="New Password"
                      label="New Password"
                      name="npass"
                      type={showNPass ? "text" : "password"}
                      withFormGroup={false}
                    />
                    <InputGroupAddon addonType="append" className="ml-0">
                      <Button
                        className="pt-0 pb-0 btn-outline-primary"
                        type="button"
                        onClick={() => {
                          setShowNPass(!showNPass);
                        }}
                      >
                        <FaEye />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
                <FormGroup className="mb-1">
                  <label className="form-control-label">Confirm Password</label>
                  <InputGroup className="input-group-alternative">
                    <CustomInput
                      placeholder="Confirm Password"
                      label="Confirm Password"
                      name="cpass"
                      type={showCPass ? "text" : "password"}
                      withFormGroup={false}
                    />
                    <InputGroupAddon addonType="append" className="ml-0">
                      <Button
                        className="pt-0 pb-0 btn-outline-primary"
                        type="button"
                        onClick={() => {
                          setShowCPass(!showCPass);
                        }}
                      >
                        <FaEye />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Form>
            </div>
          )}
        </Formik>
      </CustomModal>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card style={{ borderTop: "3px solid #007bff" }}>
            <CardBody>
              <div className="text-center">
                <img src={logo} alt="plastic-logo" style={{ width: "200px" }} />
              </div>
              <h3
                className="text-center"
                style={{ fontSize: "21px", marginTop: "5px" }}
              >
                {profile.b_name}
              </h3>
              <p className="text-center text-muted">
                {profile.b_owner}
                <b>
                  <br />
                  Renew{" "}
                  {Math.floor(
                    (new Date().getTime() -
                      new Date(profile.create_date).getTime()) /
                      (1000 * 3600 * 24)
                  )}{" "}
                  Days Left
                </b>
              </p>
              <Formik
                initialValues={{
                  email: profile?.email,
                  gst: profile?.b_gst,
                  city: profile?.b_city,
                  add: profile?.b_add,
                  lat: profile?.lat,
                  long: profile?.lng,
                  mob2: profile?.b_mo2,
                  mob3: profile?.b_mo3,
                  mob4: profile?.b_mo4,
                }}
                onSubmit={(values) => {
                  profUpdate({
                    b_mobile2: values.mob2,
                    b_mobile3: values.mob3,
                    b_mobile4: values.mob4,
                    b_email: values.email,
                    b_gst: values.gst,
                    b_city: values.city,
                    b_add: values.add,
                    lat: values.lat,
                    lng: values.long,
                    b_name: "Plastic Solution",
                    b_owner: "Jignesh Lakkad",
                  });
                }}
                validationSchema={validate}
                validateOnBlur={false}
                validateOnChange={false}
                enableReinitialize={true}
              >
                {(formik) => (
                  <div>
                    <Form>
                      <ListGroup>
                        <ListGroupItem className="border-left-0 border-right-0">
                          <b>Mobile No. {profile.b_mo}</b>
                          <a className="float-right">
                            Create Date :{" "}
                            {profile.create_date != ""
                              ? format(
                                  new Date(profile.create_date),
                                  "dd-MMM-yyyy"
                                )
                              : ""}
                          </a>
                        </ListGroupItem>
                        <ListGroupItem className="border-left-0 border-right-0">
                          <Row>
                            <Col md={6}>
                              <b>Email</b>
                              <CustomInput size="sm" name="email" type="text" />
                            </Col>
                            <Col md={6}>
                              <b>Gst No.</b>
                              <CustomInput size="sm" name="gst" type="text" />
                            </Col>
                          </Row>
                        </ListGroupItem>
                        <ListGroupItem className="border-left-0 border-right-0">
                          <Row>
                            <Col md={6}>
                              <b>Mobile Number 2</b>
                              <CustomInput
                                size="sm"
                                name="mob2"
                                type="number"
                              />
                            </Col>
                            <Col md={6}>
                              <b>Mobile Number 3</b>
                              <CustomInput
                                size="sm"
                                name="mob3"
                                type="number"
                              />
                            </Col>
                          </Row>
                        </ListGroupItem>

                        <ListGroupItem className="border-left-0 border-right-0">
                          <Row>
                            <Col md={6}>
                              <b>Mobile Number 4</b>
                              <CustomInput
                                size="sm"
                                name="mob4"
                                type="number"
                              />
                            </Col>
                            <Col md={6}>
                              <b>City</b>
                              <CustomInput size="sm" name="city" type="text" />
                            </Col>
                          </Row>
                        </ListGroupItem>
                        <ListGroupItem className="border-left-0 border-right-0">
                          <Row>
                            <Col xs={12}>
                              <b>Address</b>
                              <CustomInput size="sm" name="add" type="text" />
                            </Col>
                          </Row>
                        </ListGroupItem>
                        <ListGroupItem className="border-left-0 border-right-0 border-bottom-0">
                          <Row>
                            <Col md={6}>
                              <b>Latitude</b>
                              <CustomInput size="sm" name="lat" type="text" />
                            </Col>
                            <Col md={6}>
                              <b>Longitude</b>
                              <CustomInput size="sm" name="long" type="text" />
                            </Col>
                          </Row>
                        </ListGroupItem>
                      </ListGroup>
                      <Row>
                        <Col md={6}>
                          <Button
                            type="submit"
                            className="mr-1"
                            color="primary"
                            block
                            size="md"
                            onClick={(e) => {
                              e.preventDefault();
                              formik.submitForm();
                            }}
                          >
                            Update Profile
                          </Button>
                        </Col>
                        <Col md={6}>
                          <Button
                            type="submit"
                            className="mr-1"
                            color="primary"
                            block
                            size="md"
                            onClick={(e) => {
                              handleToggle(e);
                            }}
                          >
                            Change Password
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
