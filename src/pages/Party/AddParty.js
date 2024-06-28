import { Button, InputGroup, InputGroupAddon, FormGroup } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as React from "react";
import { useState } from "react";
import {
  partyAdd,
  partyEdit,
  checkGST,
  stateCodeGet,
  groupNameGet,
} from "api/api";
import ReactDOM from "react-dom/client";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FaWhatsapp, FaPhoneAlt, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";

const AddParty = ({ show, party, Toast, callbackFunction, toggle }) => {
  const [stateL, setStateL] = useState([]);
  const [groupname, setGroupName] = useState([]);
  const inputRef = useRef(null);
  const { user, fyear } = useSelector((store) => store.user);
  const [gstError, setGstError] = useState("");
  const [gstSuccess, setGstSuccess] = useState("");
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [validationSchema, setValidationSchema] = useState(
    Yup.object({
      name: Yup.string().required("Required"),
      gpname: Yup.string().required("Required"),
      email: Yup.string().email("Email is invalid"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
    })
  );
  const dispatch = useDispatch();

  const getStateList = async () => {
    var data = await stateCodeGet(user.token);
    if (data.data) {
      setStateL(data.data);
    }
  };

  const getGroupNameList = async () => {
    var data = await groupNameGet(user.token);
    if (data.data) {
      setGroupName(data.data);
    }
  };

  const handleToggle = async () => {
    toggle();
    setGstError("");
    setGstSuccess("");
  };

  const getDefaultData = async () => {
    dispatch(setLoader(true));
    await getStateList();
    await getGroupNameList();
    dispatch(setLoader(false));
  };

  useEffect(() => {
    if (show) {
      getDefaultData();
    }
  }, [show]);

  useEffect(() => {
    if (showExtraFields) {
      setValidationSchema(
        Yup.object({
          name: Yup.string().required("Required"),
          gpname: Yup.string().required("Required"),
          email: Yup.string().email("Email is invalid"),
          city: Yup.string().required("Required"),
          state: Yup.string().required("Required"),
        })
      );
    } else {
      setValidationSchema(
        Yup.object({
          name: Yup.string().required("Required"),
          gpname: Yup.string().required("Required"),
          email: Yup.string().email("Email is invalid"),
        })
      );
    }
  }, [showExtraFields]);
  const addPartyApi = async (payload) => {
    dispatch(setLoader(true));
    const resp = await partyAdd(user.token, payload);
    dispatch(setLoader(false));
    if (resp.data.sucess == 1) {
      Toast.fire({
        icon: "success",
        title: resp.message,
      });
      handleToggle();
      //   getParties();
      if (callbackFunction) {
        callbackFunction();
      }
    } else {
      Toast.fire({
        icon: "error",
        timer: null,
        showCloseButton: true,
        title: resp.message,
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
        if (data.pincode) {
          formik.setFieldValue("pincode", data.pincode);
        }
        if (data.pancard) {
          formik.setFieldValue("pancard", data.pancard);
        }
        if (data.state) {
          formik.setFieldValue("state", data.state);
        }
      }
      if (data.sts.toLowerCase() == "active") {
        setGstSuccess(data.sts);
      } else {
        setGstError(data.sts);
      }
    }
  };

  const editParty = async (payload) => {
    dispatch(setLoader(true));
    const resp = await partyEdit(user.token, payload);
    dispatch(setLoader(false));
    Toast.fire({
      icon: resp.data.sucess == 1 ? "success" : "error",
      title: resp.message,
    });
    if (resp.data.sucess == 1) {
      handleToggle();
      //   getParties();
      if (callbackFunction) {
        callbackFunction();
      }
    }
  };

  return (
    <CustomModal
      show={show}
      handleToggle={handleToggle}
      title={`${party ? "Edit" : "Add"} Account`}
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
          Save
        </Button>
      }
      size={showExtraFields ? "lg" : undefined}
    >
      <Formik
        initialValues={{
          name: party?.b_name,
          owner: party?.b_owner,
          mobile: party?.mobile,
          email: party?.email,
          gst: party?.gst,
          city: party?.b_city,
          add: party?.b_add,
          pincode: party?.pincode,
          pancard: party?.pancard,
          credit_day: party?.credit_day,
          credit_limit: party?.credit_limit,
          reg_type: party?.reg_type,
          gpname: party?.gpname,
          state: party?.b_state,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (party) {
            editParty({ id: party.id, ...values });
          } else {
            addPartyApi(values);
          }
        }}
        validateOnBlur={false}
        validateOnChange={false}
        innerRef={inputRef}
      >
        {(formik) => (
          <div>
            <Form
              style={{ display: "flex", flexDirection: "row", gap: "30px" }}
            >
              <div style={{ flex: "1" }}>
                <FormGroup className="mb-1">
                  <label className="form-control-label">GST No.</label>
                  <InputGroup className="input-group-alternative">
                    <CustomInput
                      placeholder="Business GST No."
                      name="gst"
                      type="text"
                      withFormGroup={false}
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
                  {gstError && <label className="errorMsg">{gstError}</label>}
                  {gstSuccess && (
                    <label className="text-success">{gstSuccess}</label>
                  )}
                </FormGroup>
                <CustomInput
                  placeholder="Account Name"
                  label="Account Name"
                  name="name"
                  type="text"
                />
                <CustomInput
                  name="gpname"
                  type="select"
                  label="Group Name"
                  options={[
                    <option value="">Select Group Name</option>,
                    ...groupname.map((opt) => {
                      return <option value={opt.id}>{opt.name}</option>;
                    }),
                  ]}
                  onChange={(e) => {
                    const group = groupname.find((x) => x.id == e.target.value);
                    setShowExtraFields(group?.phide == "1");
                    formik.handleChange(e);
                  }}
                />
              </div>

              {showExtraFields && (
                <div style={{ flex: "1" }}>
                  <CustomInput
                    placeholder="Owner Name"
                    label="Owner Name"
                    name="owner"
                    type="text"
                  />
                  <CustomInput
                    placeholder="Business Mobile No."
                    label="Mobile No."
                    name="mobile"
                    type="number"
                  />
                  <CustomInput
                    placeholder="Business Email"
                    label="Email"
                    name="email"
                    type="email"
                  />

                  <CustomInput
                    placeholder="Business City"
                    label="City"
                    name="city"
                    type="text"
                  />
                  <CustomInput
                    name="state"
                    type="select"
                    label="State"
                    options={[
                      <option value="">Select State</option>,
                      ...stateL.map((opt) => {
                        return <option value={opt.code}>{opt.state}</option>;
                      }),
                    ]}
                  />

                  <CustomInput
                    name="reg_type"
                    type="select"
                    label="Reg. Type"
                    options={[
                      { label: "Select Type", value: "" },
                      { label: "Regular", value: "Regular" },
                      { label: "Consumer", value: "Consumer" },
                      { label: "Unregistered", value: "Unregistered" },
                      { label: "Composition", value: "Composition" },
                    ].map((opt) => {
                      return <option value={opt.value}>{opt.label}</option>;
                    })}
                  />
                  <CustomInput
                    placeholder="Business Address"
                    label="Address"
                    name="add"
                    type="text"
                  />
                  <CustomInput
                    placeholder="Pincode"
                    label="Pincode"
                    name="pincode"
                    type="number"
                  />
                  <CustomInput
                    placeholder="Credit Limit"
                    label="Credit Limit"
                    name="credit_limit"
                    type="number"
                  />
                  <CustomInput
                    placeholder="Credit Days"
                    label="Credit Days"
                    name="credit_day"
                    type="number"
                  />
                  <CustomInput
                    placeholder="PAN Card"
                    label="PAN Card"
                    name="pancard"
                    type="text"
                    maxLength={10}
                  />
                </div>
              )}
            </Form>
          </div>
        )}
      </Formik>
    </CustomModal>
  );
};

export default AddParty;
