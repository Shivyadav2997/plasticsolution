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
import { login, setLoader } from "features/User/UserSlice";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import { Formik } from "formik";
import * as Yup from "yup";
import { registerUser, sendOtp, checkGST } from "api/api";
import { FaCity, FaLandmark, FaPhoneAlt, FaSearch } from "react-icons/fa";
import { MdBusiness, MdEmail, MdLocationCity } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";
import { BiHome } from "react-icons/bi";
import { TbLetterG, TbMessageCode } from "react-icons/tb";

const Register = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 2000,
  });

  const [mobileAdded, setMobileAdded] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [gstError, setGstError] = useState("");
  const [gstSuccess, setGstSuccess] = useState("");
  const mobileRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    if (mobileRef.current) {
      mobileRef.current.focus();
    }
  }, [mobileRef.current]);

  const verifyMobile = async () => {
    if (mobile.length >= 10) {
      dispatch(setLoader(true));
      const resp = await sendOtp({ b_mobile: mobile });
      dispatch(setLoader(false));
      if (resp.data.sucess == 1) {
        Toast.fire({
          icon: "success",
          title: resp.data.msg,
        });
        setMobileAdded(true);
      } else {
        Toast.fire({
          icon: "error",
          title: resp.data.msg || "Something went wrong",
        });
      }
    } else {
      setMobileAdded(true);
      setMobileError("Invalid mobile number length");
    }
  };

  const addUser = async (payload) => {
    dispatch(setLoader(true));
    const resp = await registerUser(payload);
    dispatch(setLoader(false));
    if (resp.data.success == 1) {
      Toast.fire({
        icon: "success",
        title: resp.data.msg,
      });
      setTimeout(() => {
        history.push("/auth/login");
      }, 1500);
    } else {
      Toast.fire({
        icon: "error",
        title: resp.data.msg || "Something went wrong",
      });
    }
  };
  const autoFillGST = async (formik, gst) => {
    if (gst.length < 15) {
      setGstError("GST invalid");
    } else {
      setGstError("");
      dispatch(setLoader(true));
      const resp = await checkGST(gst);
      dispatch(setLoader(false));
      const data = resp.data;

      if (data.status == "1") {
        formik.setFieldValue("name", data.b_name);
        formik.setFieldValue("owner", data.b_owner);
        formik.setFieldValue("city", data.b_city);
        formik.setFieldValue("add", data.b_add);
      }
      if (data.sts.toLowerCase() == "active") {
        setGstSuccess(data.sts);
      } else {
        setGstError(data.sts);
      }
    }
  };
  const validate = Yup.object({
    otp: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    owner: Yup.string().required("Required"),
    email: Yup.string().email("Email is invalid"),
    city: Yup.string().required("Required"),
  });

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="">
            <div className="text-center text-muted mb-4">
              <small>Create your Account</small>
            </div>
            {!mobileAdded ? (
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <FaPhoneAlt />
                      </InputGroupText>
                    </InputGroupAddon>

                    <CustomInputWoutFormik
                      placeholder="Mobile Number"
                      type="number"
                      onChange={(e) => {
                        setMobileError("");
                        setMobile(e.target.value);
                      }}
                      value={mobile}
                      ref={mobileRef}
                      withFormGroup={false}
                      autofocus
                    />
                  </InputGroup>
                  {mobileError && (
                    <label className="errorMsg">{mobileError}</label>
                  )}
                </FormGroup>
                <div className="text-center">
                  <Button
                    className="my-4"
                    color="primary"
                    type="button"
                    onClick={verifyMobile}
                  >
                    Verify Mobile
                  </Button>
                </div>
              </Form>
            ) : (
              <Formik
                initialValues={{
                  name: "",
                  owner: "",
                  email: "",
                  gst: "",
                  city: "",
                  add: "",
                  otp: "",
                }}
                validationSchema={validate}
                onSubmit={async (values, actions) => {
                  await addUser({
                    b_mobile: mobile,
                    otp: values.otp,
                    b_gst: values.gst,
                    b_name: values.name,
                    b_owner: values.owner,
                    b_email: values.email,
                    b_city: values.city,
                    b_add: values.add,
                  });
                  actions.resetForm();
                }}
                validateOnBlur={false}
                validateOnChange={false}
                // innerRef={inputRef}
              >
                {(formik) => (
                  <div>
                    <Form role="form">
                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <TbMessageCode />
                            </InputGroupText>
                          </InputGroupAddon>

                          <CustomInput
                            placeholder="OTP"
                            name="otp"
                            type="number"
                            withFormGroup={false}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <TbLetterG />
                            </InputGroupText>
                          </InputGroupAddon>

                          <CustomInput
                            placeholder="Bussiness GST No."
                            label="GST No."
                            name="gst"
                            type="text"
                            withFormGroup={false}
                            showError={true}
                            minLength={15}
                            maxLength={15}
                          />
                          <InputGroupAddon addonType="append">
                            <Button
                              className="pt-0 pb-0"
                              color="primary"
                              type="button"
                              onClick={() => {
                                autoFillGST(formik, formik.values.gst);
                              }}
                            >
                              <FaSearch />
                            </Button>
                          </InputGroupAddon>
                        </InputGroup>
                        {gstError && (
                          <label className="errorMsg">{gstError}</label>
                        )}
                      </FormGroup>
                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <MdBusiness />
                            </InputGroupText>
                          </InputGroupAddon>

                          <CustomInput
                            placeholder="Bussiness Name"
                            name="name"
                            type="text"
                            withFormGroup={false}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <BsPerson />
                            </InputGroupText>
                          </InputGroupAddon>

                          <CustomInput
                            placeholder="Owner Name"
                            label=""
                            name="owner"
                            type="text"
                            withFormGroup={false}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <MdEmail />
                            </InputGroupText>
                          </InputGroupAddon>

                          <CustomInput
                            placeholder="Bussiness Email"
                            label="Email"
                            name="email"
                            type="email"
                            withFormGroup={false}
                          />
                        </InputGroup>
                      </FormGroup>

                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <FaCity />
                            </InputGroupText>
                          </InputGroupAddon>

                          <CustomInput
                            placeholder="Bussiness City"
                            label="City"
                            name="city"
                            type="text"
                            withFormGroup={false}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <BiHome />
                            </InputGroupText>
                          </InputGroupAddon>

                          <CustomInput
                            placeholder="Bussiness Address"
                            label="Address"
                            name="add"
                            type="text"
                            withFormGroup={false}
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
                          onClick={() => formik.submitForm()}
                        >
                          Register
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}
              </Formik>
            )}
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="12" className="text-center">
            <a
              className="text-dark"
              style={{ cursor: "pointer" }}
              onClick={() => {
                history.push("/auth/login");
              }}
            >
              <small>Already Have an account ? Login</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Register;
