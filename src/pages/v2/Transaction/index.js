import { Container, Row, Col, Button } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import CustomTab from "components/Custom/CustomTab";
import {
  transactionListget,
  transactionPartyGet,
  transactionRecieveAdd,
  transactionPaymentAdd,
  deleteRecord,
  bankListGet,
  sendTransactionWp,
  sendTransactionWpReceipt,
  downloadTransactionPdf,
} from "api/apiv2";
import { Input } from "reactstrap";
import $ from "jquery";
import { format, parse } from "date-fns";
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
import WhatsappModal from "components/Custom/WhatsappModal";
import { FaDownload, FaWhatsapp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Transaction = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const [transactions, setTransactions] = useState({
    payment: [],
    recive: [],
    transection: [],
  });
  const [banks, setbanks] = useState([]);
  const [parties, setParties] = useState([]);
  const childRef = useRef(null);
  const childRef2 = useRef(null);
  const childRef3 = useRef(null);
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const { user, fyear } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [transId, setTransId] = useState(null);
  const [addType, setAddType] = useState(1);
  const [wpData, setWPData] = useState({
    show: false,
    mobile: "",
    receipt: false,
    tid: 0,
  });
  const dispatch = useDispatch();

  const formRef = useRef(null);

  const toggleWPModal = async (payload) => {
    setWPData({ ...wpData, show: !wpData.show });
  };
  const handleShowConfirmation = () => {
    if (showDelete) {
      setTransId(null);
    }
    setShowDelete(!showDelete);
  };

  const deleteTransaction = async () => {
    if (transId != null) {
      handleShowConfirmation();
      dispatch(setLoader(true));
      const resp = await deleteRecord(user.token, {
        type: "transection",
        id: transId,
      });
      Toast.fire({
        icon: resp.data.sucess == 1 ? "success" : "error",
        title: resp.message,
      });
      dispatch(setLoader(false));
      if (resp.data.sucess == 1) {
        getTransactions();
        setTransId(null);
      }
    }
  };

  const deleteClick = (cellData, rowData, row, col) => {
    setTransId(cellData.id);
    handleShowConfirmation();
  };

  const getTransactionParties = async () => {
    dispatch(setLoader(true));
    var data = await transactionPartyGet(user.token);
    dispatch(setLoader(false));
    if (data.data) {
      setParties(data.data);
    }
  };
  const handleToggle = async () => {
    if (!show) {
      await getTransactionParties();
      await getbanks();
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const sendWhatsapp = (cellData, rowData, row, col) => {
    setWPData({
      mobile: rowData.mobile || "",
      show: true,
      receipt: false,
      tid: rowData.id,
    });
  };

  const sendWhatsappPdf = (cellData, rowData, row, col) => {
    setWPData({
      mobile: rowData.mobile || "",
      show: true,
      receipt: true,
      tid: rowData.id,
    });
  };

  const whatsappPdfReceipt = async (download = 0, mo = "") => {
    if (download == 0) {
      let resp;
      if (wpData.receipt) {
        dispatch(setLoader(true));
        resp = await sendTransactionWpReceipt(user.token, {
          tid: wpData.tid,
          mo: mo,
        });
        dispatch(setLoader(false));
      } else {
        dispatch(setLoader(true));
        resp = await sendTransactionWp(user.token, {
          tid: wpData.tid,
          mo: mo,
        });
        dispatch(setLoader(false));
      }
      if (resp.data.sucess == 1) {
        toggleWPModal();
        Toast.fire({
          icon: "success",
          title: resp.data.msg || "Sent Successfully !!",
        });
      } else {
        Toast.fire({
          icon: "error",
          timer: null,
          showCloseButton: true,
          title: resp.data.msg || "Something went wrong",
        });
      }
    } else {
      dispatch(setLoader(true));
      const resp = await downloadTransactionPdf(user.token, {
        tid: download,
      });
      dispatch(setLoader(false));
      if (resp.data.pdf && resp.data.success) {
        const url = resp.data.pdf;
        window.open(url, "_blank");
      }
    }
  };

  var colDefs = [
    {
      targets: -2,
      render: function (data, type, row, meta) {
        return new Date(data).toLocaleDateString("en-GB").replaceAll("/", "-");
      },
    },
    {
      targets: 2,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        root.render(
          <span style={{ color: `${cellData == "payment" ? "red" : "green"}` }}>
            {cellData}
          </span>
        );
      },
    },
  ];

  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Party",
      data: "pid",
      className: "all",
    },
    {
      title: "Type",
      data: "type",
    },
    {
      title: "Mode",
      data: "mode",
    },
    {
      title: "BillAmt",
      data: "tpaku",
      type: "number",
    },
    {
      title: "Date",
      data: "Date",
    },
  ];

  const getTransactions = async () => {
    setLoading(true);
    var data = await transactionListget(
      user.token,
      filterDate.st,
      filterDate.et
    );
    if (data.data) {
      var data2 = data.data;
      setTransactions({
        payment: data2.payment || [],
        recive: data2.recive || [],
        transection: data2.transection || [],
      });
    } else {
      setTransactions({ payment: [], recive: [], transection: [] });
    }
    setLoading(false);
  };

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

  useEffect(() => {
    getTransactions();
  }, [filterDate, fyear]);

  useEffect(() => {
    const open = sessionStorage.getItem("openAdd");
    if (open != null) {
      setAddType(open);
      handleToggle();
      sessionStorage.removeItem("openAdd");
    }
  }, []);

  const addTransaction = async (payload) => {
    let resp = null;

    dispatch(setLoader(true));
    if (addType == 1) {
      resp = await transactionRecieveAdd(user.token, payload);
    } else {
      resp = await transactionPaymentAdd(user.token, payload);
    }
    Toast.fire({
      icon: resp.data.sucess == 1 ? "success" : "error",
      title: resp.message,
    });
    dispatch(setLoader(false));
    if (resp.data.sucess == 1) {
      handleToggle();
      getTransactions();
    }
  };

  // const rowCallBack = (row, data, index) => {
  //   if (data.type == "payment") {
  //     $(row).css("color", "red");
  //   } else {
  //     $(row).css("color", "green");
  //   }
  // };

  const tabPan = [
    <CustomTable
      // rowCallBack={rowCallBack}
      cols={[
        ...columns,
        {
          title: "Action",
          data: null,
          createdCell: (td, cellData, rowData, row, col) => {
            const root = ReactDOM.createRoot(td);
            root.render(
              <>
                {" "}
                <div className="d-flex gap-10">
                  <div>
                    <Button
                      className="btn-outline-info btn-icon btn-sm"
                      onClick={() => sendWhatsapp(cellData, rowData, row, col)}
                    >
                      <span>
                        <FaWhatsapp size={12} />
                      </span>
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="btn-outline-success btn-icon btn-sm"
                      onClick={() =>
                        sendWhatsappPdf(cellData, rowData, row, col)
                      }
                    >
                      <span>
                        <FaWhatsapp size={12} /> Receipt
                      </span>
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="btn-outline-info btn-icon btn-sm"
                      onClick={() => whatsappPdfReceipt(rowData.id)}
                    >
                      <span>
                        <FaDownload size={12} />
                      </span>
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="btn-danger btn-icon btn-sm"
                      onClick={() => deleteClick(cellData, rowData, row, col)}
                    >
                      <span>
                        <MdDelete size={16} />
                      </span>
                    </Button>
                  </div>
                </div>
              </>
            );
          },
          className: "all",
        },
      ]}
      columndefs={colDefs}
      dark={false}
      data={transactions.transection}
      title="Transaction List"
      withCard={false}
      hasEdit={false}
      hasDelete={false}
      custom={true}
      ref={childRef}
      numColumns={[4, 5]}
    />,
    <CustomTable
      cols={[
        ...columns,
        {
          title: "Action",
          data: null,
        },
      ]}
      columndefs={[colDefs[0]]}
      dark={false}
      data={transactions.recive}
      title="Recieve List"
      withCard={false}
      hasEdit={false}
      custom={true}
      ref={childRef2}
      deleteClick={deleteClick}
    />,
    <CustomTable
      cols={[
        ...columns,
        {
          title: "Action",
          data: null,
        },
      ]}
      columndefs={[colDefs[0]]}
      dark={false}
      data={transactions.payment}
      title="Payment List"
      withCard={false}
      hasEdit={false}
      custom={true}
      ref={childRef3}
      deleteClick={deleteClick}
    />,
  ];

  const onChangeEvents = [
    () => {
      childRef.current.setResponsive();
    },
    () => {
      childRef2.current.setResponsive();
    },
    () => {
      childRef3.current.setResponsive();
    },
  ];

  const dateSelect = (start, end) => {
    setFilterDate({
      st: format(start.toDate(), "yyyy-MM-dd"),
      et: format(end.toDate(), "yyyy-MM-dd"),
    });
  };

  const validate = Yup.object({
    pid: Yup.string().required("Required"),
    amount: Yup.number().required("Required"),
    type: Yup.string().required("Required"),
    mode: Yup.string().required("Required"),
    date: Yup.date().required("Required"),
  });

  return (
    <>
      <CustomModal
        show={show}
        title={addType == 1 ? `Recieve` : `Payment`}
        handleToggle={handleToggle}
        footer={
          <Button
            type="submit"
            className="mr-1"
            color="primary"
            block
            size="md"
            onClick={() => formRef.current.handleSubmit()}
          >
            Save
          </Button>
        }
      >
        <Formik
          initialValues={{
            pid: "",
            wAmount: "",
            bAmount: "",
            amount: "",
            type: "BillAmt",
            mode: "",
            date: format(new Date(), "yyyy-MM-dd"),
            desc: "",
            discount: "",
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            addTransaction(values);
          }}
          innerRef={formRef}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {(formik) => (
            <div>
              <Form>
                <CustomInput
                  name="pid"
                  type="select"
                  label="Party"
                  onChange={(e) => {
                    formik.handleChange(e);
                    const party = parties.find((x) => x.pid == e.target.value);
                    formik.setFieldValue("bAmount", party ? party.billamt : "");
                  }}
                  options={[
                    <option value="">Select Account</option>,
                    ...parties.map((opt) => {
                      return <option value={opt.pid}>{opt.b_name}</option>;
                    }),
                  ]}
                />

                <Row xs="2">
                  <Col xs={12}>
                    <CustomInput
                      placeholder=""
                      name="bAmount"
                      type="text"
                      label="Bill Amt. (Outstanding)"
                      disabled
                    />
                  </Col>
                </Row>

                <CustomInput
                  placeholder={addType == 1 ? "Credit Amount" : "Debit Amount"}
                  name="amount"
                  type="number"
                  label={addType == 1 ? "Credit Amount" : "Debit Amount"}
                />

                <CustomInput
                  placeholder={"Discount"}
                  name="discount"
                  type="number"
                  label={"Discount"}
                />

                <CustomInput
                  name="type"
                  type="select"
                  // label="Type"
                  options={[
                    { label: "Select Type", value: "" },
                    { label: "BillAmt", value: "BillAmt" },
                  ].map((opt) => {
                    return <option value={opt.value}>{opt.label}</option>;
                  })}
                  className="d-none"
                />

                <CustomInput
                  name="mode"
                  type="select"
                  label="Mode"
                  options={[
                    <option value="">Select Mode</option>,
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
                  placeholder=""
                  name="date"
                  type="date"
                  label="Date"
                />
                <CustomInput
                  placeholder=""
                  name="desc"
                  type="textarea"
                  label="Note"
                />
              </Form>
            </div>
          )}
        </Formik>
      </CustomModal>
      <WhatsappModal
        show={wpData.show}
        handleToggle={toggleWPModal}
        mobile={wpData.mobile}
        withMsg={false}
        api={whatsappPdfReceipt}
        params={[0]}
      />
      <ConfirmationDialog
        show={showDelete}
        handleToggle={handleShowConfirmation}
        title="Delete"
        handleOkay={deleteTransaction}
        handleCancel={handleShowConfirmation}
      >
        Are You Sure you want to delete this ?
      </ConfirmationDialog>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <Row sm="2" xs="1" className="mb-2">
          <Col>
            <Row className="ml-0 mb-1">
              <CustomDatePicker
                onCallback={dateSelect}
                text="Transaction By Date"
              />
              <Button
                className="btn-md btn-outline-primary mb-1 ml-0"
                onClick={() => setFilterDate({ st: "", et: "" })}
              >
                All Transactions
              </Button>

              <h1>
                <span style={{ fontSize: "18px" }}>
                  {filterDate.st != "" &&
                    ` (${filterDate.st} to ${filterDate.et})`}
                </span>{" "}
              </h1>
            </Row>
          </Col>
          <Col>
            <Row className="justify-content-md-end mr-0  ml-0">
              <Button
                className="btn-md btn-outline-success"
                onClick={() => {
                  setAddType(1);
                  handleToggle();
                }}
              >
                Receive
              </Button>
              <Button
                className="btn-md btn-outline-danger"
                onClick={() => {
                  setAddType(2);
                  handleToggle();
                }}
              >
                Payment
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
                <CustomTab
                  tabnames={["Transaction", "Receive", "Payment"]}
                  tabpanes={tabPan}
                  onChangeEvents={onChangeEvents}
                />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Transaction;
