import {
  Container,
  Row,
  Col,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  FormGroup,
} from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import {
  transportListGet,
  transportAdd,
  transportEdit,
  deleteRecord,
  checkGST,
} from "api/api";
import ReactDOM from "react-dom/client";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loader from "components/Custom/Loader";
import { FaWhatsapp, FaPhoneAlt, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";

const Transport = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const [transporters, setTransporters] = useState([]);
  const { user, fyear } = useSelector((store) => store.user);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [transporter, setTransporter] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  const [gstError, setGstError] = useState("");
  const [gstSuccess, setGstSuccess] = useState("");

  const dispatch = useDispatch();

  const handleToggle = () => {
    if (show) {
      setTransporter(null);
    }
    setShow(!show);
  };
  const handleShowConfirmation = () => {
    if (showDelete) {
      setTransporter(null);
    }
    setShowDelete(!showDelete);
  };
  const validate = Yup.object({
    name: Yup.string().required("Required"),
    add: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
  });

  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Name",
      data: "t_name",
      className: "all",
    },
    {
      title: "Mobile",
      data: "mobile",
    },
    {
      title: "City",
      data: "city",
    },
    {
      title: "GST",
      data: "gst",
    },
    {
      title: "Address",
      data: "address",
    },
    {
      title: "Action",
      data: null,
    },
  ];

  const deleteTransporter = async () => {
    if (transporter != null) {
      handleShowConfirmation();
      dispatch(setLoader(true));
      const resp = await deleteRecord(user.token, {
        type: "transporter",
        id: transporter.id,
      });

      if (resp.data.sucess == 1) {
        Toast.fire({
          icon: "success",
          title: resp.message,
        });
        getTransporters();
        setTransporter(null);
        dispatch(setLoader(false));
      } else {
        Toast.fire({
          icon: "error",
          timer: null,
          showCloseButton: true,
          title: resp.message,
        });
      }
    }
  };

  const deleteClick = (cellData, rowData, row, col) => {
    setTransporter(cellData);
    handleShowConfirmation();
  };

  const editClick = (cellData, rowData, row, col) => {
    console.log(cellData);
    setTransporter(cellData);
    handleToggle();
  };

  const getTransporters = async () => {
    setLoading(true);
    const data = await transportListGet(user.token);
    if (data.data) {
      setTransporters(data.data);
    } else {
      setTransporters([]);
    }

    setLoading(false);
  };

  const addTransporter = async (payload) => {
    dispatch(setLoader(true));
    const resp = await transportAdd(user.token, payload);
    dispatch(setLoader(false));
    if (resp.data.sucess == 1) {
      Toast.fire({
        icon: "success",
        title: resp.message,
      });
      handleToggle();
      getTransporters();
    } else {
      Toast.fire({
        icon: "error",
        timer: null,
        showCloseButton: true,
        title: resp.message,
      });
    }
  };

  const editTransporter = async (payload) => {
    dispatch(setLoader(true));
    const resp = await transportEdit(user.token, payload);
    dispatch(setLoader(false));
    Toast.fire({
      icon: resp.data.sucess == 1 ? "success" : "error",
      title: resp.message,
    });
    if (resp.data.sucess == 1) {
      handleToggle();
      getTransporters();
    }
  };

  useEffect(() => {
    getTransporters();
  }, [fyear]);

  useEffect(() => {
    if (sessionStorage.getItem("openAdd")) {
      handleToggle();
      sessionStorage.removeItem("openAdd");
    }
  }, [sessionStorage.getItem("openAdd")]);

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
        // formik.setFieldValue("owner", data.b_owner);
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

  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <CustomModal
          show={show}
          handleToggle={handleToggle}
          title={`${transporter ? "Edit" : "Add"} Transporter`}
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
        >
          <Formik
            initialValues={{
              name: transporter?.t_name,
              mobile: transporter?.mobile,
              gst: transporter?.gst,
              city: transporter?.city,
              add: transporter?.address,
            }}
            validationSchema={validate}
            onSubmit={(values) => {
              if (transporter) {
                editTransporter({ id: transporter.id, ...values });
              } else {
                addTransporter(values);
              }
            }}
            validateOnBlur={false}
            validateOnChange={false}
            innerRef={inputRef}
          >
            {(formik) => (
              <div>
                <Form>
                  <FormGroup className="mb-1">
                    <label className="form-control-label">GST No.</label>
                    <InputGroup className="input-group-alternative">
                      <CustomInput
                        placeholder="GST No."
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
                    placeholder="Transporter Name"
                    label="Transporter Name"
                    name="name"
                    type="text"
                  />
                  <CustomInput
                    placeholder="Mobile No."
                    label="Mobile No."
                    name="mobile"
                    type="number"
                  />
                  <CustomInput
                    placeholder="City"
                    label="City"
                    name="city"
                    type="text"
                  />
                  <CustomInput
                    placeholder="Address"
                    label="Address"
                    name="add"
                    type="text"
                  />
                </Form>
              </div>
            )}
          </Formik>
        </CustomModal>
        <ConfirmationDialog
          show={showDelete}
          handleToggle={handleShowConfirmation}
          title="Delete"
          handleOkay={deleteTransporter}
          handleCancel={handleShowConfirmation}
        >
          Are You Sure you want to delete this ?
        </ConfirmationDialog>
        <Row sm="2" className="mb-2">
          <Col className="d-none d-sm-block"></Col>
          <Col>
            <Row className="justify-content-end mr-0">
              <Button
                className="btn-md btn-outline-primary"
                onClick={handleToggle}
              >
                Add Transporter
              </Button>
            </Row>
          </Col>
        </Row>
        {loading ? (
          <Loader loading={loading} />
        ) : (
          <>
            <Row>
              <div className="col">
                <CustomTable
                  cols={columns}
                  dark={false}
                  data={transporters}
                  title="TransporterList List"
                  deleteClick={deleteClick}
                  editClick={editClick}
                />
              </div>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Transport;
