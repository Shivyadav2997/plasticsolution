import { Container, Row, Col, Button } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import CustomTab from "components/Custom/CustomTab";
import {
  balanceListGet,
  balanceEntryListGet,
  bankListGet,
  balanceUpdate,
  deleteRecord,
} from "api/apiv2";
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

const Balance = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const [banks, setbanks] = useState([]);
  const [balances, setbalances] = useState([]);
  const [balance, setBalance] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [balanceEntries, setbalanceEntries] = useState([]);
  const [addType, setAddType] = useState(1);
  const childRef = useRef(null);
  const childRef2 = useRef(null);
  const { user, fyear } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [showBalEntry, setshowBalEntry] = useState(false);
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const [show, setShow] = useState(false);

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

  const handleShowConfirmation = () => {
    if (showDelete) {
      setBalance(null);
    }
    setShowDelete(!showDelete);
  };

  const handleToggle = async () => {
    if (!show) {
      getbanks();
    }
    setShow(!show);
  };

  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Type",
      data: "Type",
      className: "all",
    },
    {
      title: "Balance",
      data: "Balance",
    },
  ];

  const columns2 = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Mode",
      data: "mode",
      className: "all",
    },
    {
      title: "Deposit",
      data: "deposite",
    },
    {
      title: "Withdrawl",
      data: "withdrawal",
    },
    {
      title: "Description",
      data: "description",
    },
    {
      title: "Date",
      data: "date",
    },
    {
      title: "Action",
      data: null,
    },
  ];

  const getBalances = async () => {
    setLoading(true);
    var data = await balanceListGet(user.token);
    if (data.data) {
      var data2 = data.data;
      setbalances(data2);
    } else {
      setbalances([]);
    }
    setLoading(false);
  };

  const getBalanceEntries = async () => {
    setLoading(true);
    var data = await balanceEntryListGet(user.token);
    if (data.data) {
      var data2 = data.data;
      setbalanceEntries(data2);
    } else {
      setbalanceEntries([]);
    }
    setLoading(false);
  };

  const validate = Yup.object({
    amount: Yup.number().required("Required"),
    // description: Yup.string().required("Required"),
    balance_mode: Yup.string().required("Required"),
    date: Yup.date().required("Required"),
  });

  const getbanks = async () => {
    dispatch(setLoader(true));
    var data = await bankListGet(user.token);
    dispatch(setLoader(false));
    if (data.data) {
      var data2 = data.data;
      setbanks(data2);
    } else {
      setbanks([]);
    }
  };

  const addBalance = async (payload) => {
    let resp = null;

    dispatch(setLoader(true));
    if (addType == 1) {
      resp = await balanceUpdate(user.token, {
        type: "Withdrawal",
        ...payload,
      });
    } else {
      resp = await balanceUpdate(user.token, {
        type: "Deposit",
        ...payload,
      });
    }
    Toast.fire({
      icon: resp.data.success == 1 ? "success" : "error",
      title:
        resp.data.success == 1
          ? addType == 1
            ? "Withdrawal Added Successfully"
            : "Deposit Added Successfully"
          : "Something wen't wrong",
    });
    dispatch(setLoader(false));
    if (resp.data.success == 1) {
      handleToggle();
      getBalances();
    }
  };

  const deleteBalance = async () => {
    if (balance != null) {
      handleShowConfirmation();
      dispatch(setLoader(true));
      const resp = await deleteRecord(user.token, {
        type: "bank_entry",
        id: balance.id,
      });

      if (resp.data.sucess == 1) {
        Toast.fire({
          icon: "success",
          title: resp.message,
        });
        getBalanceEntries();
        setBalance(null);
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
    setBalance(cellData);
    handleShowConfirmation();
  };

  useEffect(() => {
    setbalanceEntries([]);
    setbalances([]);
    if (showBalEntry) {
      getBalanceEntries();
    } else {
      getBalances();
    }
  }, [showBalEntry, fyear]);

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
        {!showBalEntry ? (
          <>
            <CustomModal
              show={show}
              handleToggle={handleToggle}
              title={addType == 1 ? "Withdrawl" : "Deposit"}
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
                  amount: "",
                  description: "",
                  date: format(new Date(), "yyyy-MM-dd"),
                  balance_mode: "",
                }}
                validationSchema={validate}
                onSubmit={(values) => {
                  addBalance(values);
                }}
                validateOnBlur={false}
                validateOnChange={false}
                innerRef={formRef}
              >
                {(formik) => (
                  <div>
                    <Form>
                      <CustomInput
                        name="balance_mode"
                        type="select"
                        label="Bank"
                        options={[
                          <option value="">Select Bank</option>,
                          <option value="0">Cash</option>,
                          ...banks.map((opt) => {
                            return (
                              <option value={opt.id}>
                                {opt.bank_name}-{opt.ac_holder}
                              </option>
                            );
                          }),
                        ]}
                      />
                      <CustomInput
                        placeholder={
                          addType == 1 ? "Withdrawl Amount" : "Deposit Amount"
                        }
                        name="amount"
                        type="number"
                        label={
                          addType == 1 ? "Withdrawl Amount" : "Deposit Amount"
                        }
                      />

                      <CustomInput
                        placeholder=""
                        name="date"
                        type="date"
                        label="Date"
                      />

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
              <Col>
                <Row className="ml-0">
                  <Button
                    className="btn-md btn-outline-primary mb-1"
                    onClick={() => setshowBalEntry(true)}
                  >
                    Balance Entry
                  </Button>
                </Row>
              </Col>
              <Col>
                <Row className="justify-content-md-end mr-0  ml-0">
                  <Button
                    className="btn-md btn-outline-success"
                    onClick={() => {
                      setAddType(2);
                      handleToggle();
                    }}
                  >
                    Deposit
                  </Button>
                  <Button
                    className="btn-md btn-outline-danger"
                    onClick={() => {
                      setAddType(1);
                      handleToggle();
                    }}
                  >
                    Withdrawl
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
                          data={balances}
                          title="Balance"
                          withCard={true}
                          hasEdit={false}
                          hasDelete={false}
                          custom={true}
                          ref={childRef}
                        />
                      </div>
                    </Row>
                  </>
                )}
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row sm="2" xs="1" className="mb-2">
              <Col>
                <Row className="ml-0">
                  <Button
                    className="btn-md btn-outline-primary mb-1"
                    onClick={() => setshowBalEntry(false)}
                  >
                    Balance List
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
                        <div>
                          <CustomTable
                            cols={columns2}
                            columndefs={colDefs}
                            dark={false}
                            data={balanceEntries}
                            title="Balance"
                            withCard={true}
                            hasEdit={false}
                            custom={true}
                            ref={childRef2}
                            deleteClick={deleteClick}
                          />
                        </div>
                      </div>
                    </Row>
                  </>
                )}
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Balance;
