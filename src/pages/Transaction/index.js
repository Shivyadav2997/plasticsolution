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
} from "api/api";
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
  const [parties, setParties] = useState([]);
  const childRef = useRef(null);
  const childRef2 = useRef(null);
  const childRef3 = useRef(null);
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [transId, setTransId] = useState(null);
  const [addType, setAddType] = useState(1);
  const dispatch = useDispatch();

  const formRef = useRef(null);

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
    var data = await transactionPartyGet(user.token);
    if (data.data) {
      setParties(data.data);
    }
  };
  const handleToggle = async () => {
    if (!show) {
      await getTransactionParties().then(() => setShow(true));
    } else {
      setShow(false);
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
      title: "WithAmt",
      data: "tkachu",
      type: "number",
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
    {
      title: "Action",
      data: null,
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

  useEffect(() => {
    getTransactions();
  }, [filterDate]);

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
      cols={columns}
      columndefs={colDefs}
      dark={false}
      data={transactions.transection}
      title="Transaction List"
      withCard={false}
      hasEdit={false}
      custom={true}
      ref={childRef}
      deleteClick={deleteClick}
      numColumns={[4, 5]}
    />,
    <CustomTable
      cols={columns}
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
      cols={columns}
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
        title={`Recieve`}
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
            type: "",
            mode: "",
            date: format(new Date(), "yyyy-MM-dd"),
            desc: "",
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
                    formik.setFieldValue(
                      "wAmount",
                      party ? party.withoutamt : ""
                    );
                    formik.setFieldValue("bAmount", party ? party.billamt : "");
                  }}
                  options={[
                    <option value="">Select Party</option>,
                    ...parties.map((opt) => {
                      return <option value={opt.pid}>{opt.b_name}</option>;
                    }),
                  ]}
                />

                <Row xs="2">
                  <Col>
                    <CustomInput
                      placeholder=""
                      name="wAmount"
                      type="text"
                      label="Without Amt. (Outstanding)"
                      disabled
                    />
                  </Col>
                  <Col>
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
                  name="type"
                  type="select"
                  label="Type"
                  options={[
                    { label: "Select Type", value: "" },
                    { label: "WithoutAmt", value: "WithoutAmt" },
                    { label: "BillAmt", value: "BillAmt" },
                  ].map((opt) => {
                    return <option value={opt.value}>{opt.label}</option>;
                  })}
                />

                <CustomInput
                  name="mode"
                  type="select"
                  label="Mode"
                  options={[
                    { label: "Select Mode", value: "" },
                    { label: "Cash", value: "cash" },
                    { label: "Bank", value: "bank" },
                  ].map((opt) => {
                    return <option value={opt.value}>{opt.label}</option>;
                  })}
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
            <Row className="ml-0">
              <CustomDatePicker
                onCallback={dateSelect}
                text="Transaction By Date"
              />
              <Button
                className="btn-md btn-outline-primary"
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
            <Row className="justify-content-md-end mr-0">
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
