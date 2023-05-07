import { Container, Row, Col, Button } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import CustomTab from "components/Custom/CustomTab";
import {
  bankListGet,
  bankNameGet,
  bankAdd,
  bankUpdate,
  deleteRecord,
} from "api/api";
import $ from "jquery";
import { format } from "date-fns";
import Loader from "components/Custom/Loader";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";

const Bank = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const [banks, setbanks] = useState([]);
  const [bankNames, setBankNames] = useState([]);
  const [show, setShow] = useState(false);
  const [bank, setBank] = useState(null);
  const childRef = useRef(null);
  const { user, fyear } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const [showDelete, setShowDelete] = useState(false);

  var colDefs = [
    // {
    //   targets: -2,
    //   // createdCell: (td, cellData, rowData, row, col) => {
    //   //   const root = ReactDOM.createRoot(td);
    //   //   root.render(
    //   //     <>{format(parse(cellData, "yyyy-MM-dd", new Date()), "dd-MM-yyyy")}</>
    //   //   );
    //   // },
    //   render: function (data, type, row, meta) {
    //     return new Date(data).toLocaleDateString("en-GB").replaceAll("/", "-");
    //   },
    // },
  ];

  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "BankName",
      data: "bank_name",
      className: "all",
    },
    {
      title: "Holder",
      data: "ac_holder",
    },
    {
      title: "Ac No",
      data: "ac",
    },
    {
      title: "IFSC",
      data: "ifsc",
    },
    {
      title: "Branch",
      data: "branch",
    },
    {
      title: "Desc",
      data: "description",
    },
    {
      title: "Action",
      data: null,
    },
  ];

  const getbanks = async () => {
    setLoading(true);
    var data = await bankListGet(user.token);
    if (data.data) {
      var data2 = data.data;
      setbanks(data2);
    } else {
      setbanks([]);
    }
    setLoading(false);
  };

  const getBankNames = async () => {
    dispatch(setLoader(true));
    var data = await bankNameGet(user.token);
    dispatch(setLoader(false));
    if (data.data) {
      var data2 = data.data;
      setBankNames(data2);
    } else {
      setBankNames([]);
    }
  };

  const handleToggle = async () => {
    if (show) {
      setBank(null);
    } else {
      await getBankNames();
    }
    setShow(!show);
  };

  const validate = Yup.object({
    bank_name: Yup.string().required("Required"),
    ac_holder: Yup.string().required("Required"),
    // ac: Yup.string().required("Required"),
    // op: Yup.number().when("ac", {
    //   is: bank == null,
    //   then: Yup.number().required("Required"),
    // }),
    // ifsc: Yup.string().required("Required"),
    // branch: Yup.string().required("Required"),
    // description: Yup.string().required("Required"),
  });

  const addBank = async (payload) => {
    let resp = null;

    dispatch(setLoader(true));
    resp = await bankAdd(user.token, payload);
    Toast.fire({
      icon: resp.data.success == 1 ? "success" : "error",
      title:
        resp.data.success == 1
          ? "Bank Added Successfully"
          : "Something wen't wrong",
    });
    dispatch(setLoader(false));
    if (resp.data.success == 1) {
      handleToggle();
      getbanks();
    }
  };

  const updateBank = async (payload) => {
    let resp = null;

    dispatch(setLoader(true));
    resp = await bankUpdate(user.token, payload);
    Toast.fire({
      icon: resp.data.success == 1 ? "success" : "error",
      title:
        resp.data.success == 1
          ? "Bank Updated Successfully"
          : "Something wen't wrong",
    });
    dispatch(setLoader(false));
    if (resp.data.success == 1) {
      handleToggle();
      getbanks();
    }
  };

  const handleShowConfirmation = () => {
    if (showDelete) {
      setBank(null);
    }
    setShowDelete(!showDelete);
  };

  const deleteClick = (cellData, rowData, row, col) => {
    setBank(cellData);
    handleShowConfirmation();
  };

  const deleteBalance = async () => {
    if (bank != null) {
      handleShowConfirmation();
      dispatch(setLoader(true));
      const resp = await deleteRecord(user.token, {
        type: "bank",
        id: bank.id,
      });

      if (resp.data.sucess == 1) {
        Toast.fire({
          icon: "success",
          title: resp.message,
        });
        getbanks();
        setBank(null);
        dispatch(setLoader(false));
      } else {
        Toast.fire({
          icon: "error",
          title: resp.message,
        });
      }
    }
  };

  const editClick = (cellData, rowData, row, col) => {
    setBank(cellData);
    handleToggle();
  };

  useEffect(() => {
    getbanks();
  }, [fyear]);

  return (
    <>
      <ConfirmationDialog
        show={showDelete}
        handleToggle={handleShowConfirmation}
        title="Delete"
        handleOkay={deleteBalance}
        handleCancel={handleShowConfirmation}
      >
        Are You Sure you want to delete this ?
      </ConfirmationDialog>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <>
          <CustomModal
            show={show}
            handleToggle={handleToggle}
            title={`${bank ? "Edit" : "Add"} Bank`}
            footer={
              <Button
                type="submit"
                className="mr-1"
                color="primary"
                block
                size="md"
                onClick={() => {
                  formRef.current.handleSubmit();
                }}
              >
                Save
              </Button>
            }
          >
            <Formik
              initialValues={{
                bank_name: bank?.bank_name,
                ac_holder: bank?.ac_holder,
                ac: bank?.ac,
                op: "",
                ifsc: bank?.ifsc,
                branch: bank?.branch,
                description: bank?.description,
              }}
              validationSchema={validate}
              onSubmit={(values) => {
                if (bank) {
                  updateBank({ id: bank.id, ...values });
                } else {
                  addBank(values);
                }
              }}
              validateOnBlur={false}
              validateOnChange={false}
              innerRef={formRef}
            >
              {(formik) => (
                <div>
                  <Form>
                    <CustomInput
                      name="bank_name"
                      type="select"
                      label="Bank"
                      // onChange={(e) => {
                      //   formik.handleChange(e);
                      //   const party = parties.find(
                      //     (x) => x.pid == e.target.value
                      //   );
                      //   formik.setFieldValue(
                      //     "wAmount",
                      //     party ? party.withoutamt : ""
                      //   );
                      //   formik.setFieldValue(
                      //     "bAmount",
                      //     party ? party.billamt : ""
                      //   );
                      // }}
                      options={[
                        <option value="">Select Bank</option>,
                        ...bankNames.map((opt) => {
                          return (
                            <option value={opt.name.toUpperCase()}>
                              {opt.name.toUpperCase()}
                            </option>
                          );
                        }),
                      ]}
                    />
                    <CustomInput
                      placeholder="Account Holder Name"
                      label="Account Holder Name"
                      name="ac_holder"
                      type="text"
                    />

                    <CustomInput
                      placeholder="Account No"
                      label="Account No"
                      name="ac"
                      type="text"
                    />
                    <CustomInput
                      placeholder="IFSC"
                      label="IFSC"
                      name="ifsc"
                      type="text"
                    />
                    <CustomInput
                      placeholder="Branch Name"
                      label="Branch Name"
                      name="branch"
                      type="text"
                    />
                    {bank == null && (
                      <CustomInput
                        placeholder="Opening Balance"
                        label="Opening Balance"
                        name="op"
                        type="number"
                      />
                    )}
                    <CustomInput
                      placeholder="Description"
                      label="Description"
                      name="description"
                      type="text"
                    />
                  </Form>
                </div>
              )}
            </Formik>
          </CustomModal>
          <Row sm="2" xs="1" className="mb-2">
            <Col className="d-none d-sm-block"></Col>
            <Col>
              <Row className="justify-content-md-end mr-0  ml-0">
                <Button
                  className="btn-md btn-outline-primary"
                  onClick={handleToggle}
                >
                  Add Bank
                </Button>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              {loading ? (
                <Loader loading={loading} />
              ) : (
                <>
                  <Row>
                    <div className="col">
                      <CustomTable
                        cols={columns}
                        columndefs={colDefs}
                        dark={false}
                        data={banks}
                        title="Bank"
                        withCard={true}
                        custom={true}
                        ref={childRef}
                        deleteClick={deleteClick}
                        editClick={editClick}
                      />
                    </div>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </>
      </Container>
    </>
  );
};

export default Bank;
