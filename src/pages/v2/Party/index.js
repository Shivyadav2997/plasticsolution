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
  partyListGet,
  partyAdd,
  partyEdit,
  deleteRecord,
  checkGST,
} from "api/apiv2";
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

const Party = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const [parties, setParties] = useState([]);
  const { user, fyear } = useSelector((store) => store.user);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  const [gstError, setGstError] = useState("");
  const [gstSuccess, setGstSuccess] = useState("");

  const dispatch = useDispatch();

  const handleToggle = () => {
    if (show) {
      setParty(null);
    }
    setShow(!show);
  };
  const handleShowConfirmation = () => {
    if (showDelete) {
      setParty(null);
    }
    setShowDelete(!showDelete);
  };
  const validate = Yup.object({
    name: Yup.string().required("Required"),
    owner: Yup.string().required("Required"),
    email: Yup.string().email("Email is invalid"),
    mobile: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
  });

  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Name",
      data: "b_name",
      className: "all",
    },
    {
      title: "Owner",
      data: "b_owner",
    },
    {
      title: "Email/GST",
      data: "email",
    },
    {
      title: "Action",
      data: null,
    },
  ];

  var colDefs = [
    {
      targets: 1,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        root.render(
          <div
            style={{ widhth: "100%" }}
            className="d-flex justify-content-between"
          >
            <strong>{rowData.b_name}</strong>
            <span>
              <Button className="btn-neutral btn-icon btn-sm" color="default">
                <a href={`tel:${rowData.mobile}`}>
                  <FaPhoneAlt size={16} />
                </a>
              </Button>
              <Button className="btn-neutral btn-icon btn-sm">
                <a
                  className="ml-1"
                  href={`whatsapp://send?phone=:${rowData.mobile}`}
                >
                  <FaWhatsapp size={18} className="text-success" />
                </a>
              </Button>
            </span>
          </div>
        );
      },
    },
    {
      targets: 3,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        rowData.gst
          ? root.render(
              <div>
                {rowData.email}
                <br />
                {rowData.gst}
              </div>
            )
          : root.render(<div>{cellData}</div>);
      },
    },
  ];

  const deleteParty = async () => {
    if (party != null) {
      handleShowConfirmation();
      dispatch(setLoader(true));
      const resp = await deleteRecord(user.token, {
        type: "party",
        id: party.id,
      });

      if (resp.data.sucess == 1) {
        Toast.fire({
          icon: "success",
          title: resp.message,
        });
        getParties();
        setParty(null);
        dispatch(setLoader(false));
      } else {
        Toast.fire({
          icon: "error",
          title: resp.message,
        });
      }
    }
  };

  const deleteClick = (cellData, rowData, row, col) => {
    setParty(cellData);
    handleShowConfirmation();
  };

  const editClick = (cellData, rowData, row, col) => {
    setParty(cellData);
    handleToggle();
  };

  const getParties = async () => {
    setLoading(true);
    const data = await partyListGet(user.token);
    if (data.data) {
      setParties(data.data);
    } else {
      setParties([]);
    }
    setLoading(false);
  };

  const addParty = async (payload) => {
    dispatch(setLoader(true));
    const resp = await partyAdd(user.token, payload);
    dispatch(setLoader(false));
    if (resp.data.sucess == 1) {
      Toast.fire({
        icon: "success",
        title: resp.message,
      });
      handleToggle();
      getParties();
    } else {
      Toast.fire({
        icon: "error",
        title: resp.message,
      });
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
      getParties();
    }
  };

  useEffect(() => {
    getParties();
  }, [fyear]);

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
  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <CustomModal
          show={show}
          handleToggle={handleToggle}
          title={`${party ? "Edit" : "Add"} Party`}
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
              name: party?.b_name,
              owner: party?.b_owner,
              mobile: party?.mobile,
              email: party?.email,
              gst: party?.gst,
              city: party?.b_city,
              add: party?.b_add,
            }}
            validationSchema={validate}
            onSubmit={(values) => {
              if (party) {
                editParty({ id: party.id, ...values });
              } else {
                addParty(values);
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
                        placeholder="Bussiness GST No."
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
                    placeholder="Bussiness Name"
                    label="Bussiness Name"
                    name="name"
                    type="text"
                  />

                  <CustomInput
                    placeholder="Owner Name"
                    label="Owner Name"
                    name="owner"
                    type="text"
                  />
                  <CustomInput
                    placeholder="Bussiness Mobile No."
                    label="Mobile No."
                    name="mobile"
                    type="number"
                  />
                  <CustomInput
                    placeholder="Bussiness Email"
                    label="Email"
                    name="email"
                    type="email"
                  />

                  <CustomInput
                    placeholder="Bussiness City"
                    label="City"
                    name="city"
                    type="text"
                  />
                  <CustomInput
                    placeholder="Bussiness Address"
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
          handleOkay={deleteParty}
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
                Add Party
              </Button>
              <Button className="btn-md btn-outline-default">Add File</Button>
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
                  data={parties}
                  columndefs={colDefs}
                  title="Party List"
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

export default Party;
