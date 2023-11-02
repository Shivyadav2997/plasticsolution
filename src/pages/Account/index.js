import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  creditDebitListGet,
  accountListGet,
  transactionPartyGet,
  bankListGet,
  addCreditDebit,
  deleteRecord,
  accountpdf,
} from "api/api";
import { useHistory } from "react-router-dom";
import ReactDOM from "react-dom/client";
import CustomModal from "components/Custom/CustomModal";
import WhatsappModal from "components/Custom/WhatsappModal";
import { CustomInput } from "components/Custom/CustomInput";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loader from "components/Custom/Loader";
import { FaWhatsapp, FaPhoneAlt, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { setLoader } from "features/User/UserSlice";
import { format, parse } from "date-fns";

const Party = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  let history = useHistory();
  const childRef = useRef(null);
  const childRef2 = useRef(null);
  const [parties, setParties] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [banks, setbanks] = useState([]);
  const [creditDebit, setCreditDebit] = useState([]);
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [showAccount, setShowAccount] = useState(true);
  const { user, fyear } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [addType, setAddType] = useState(1);
  const [showDelete, setShowDelete] = useState(false);
  const [wpData, setWPData] = useState({ show: false, mobile: "", msg: "" });
  const dispatch = useDispatch();
  const formRef = useRef(null);

  const viewInvoice = (cellData, rowData, row, col) => {
    sessionStorage.setItem("party", rowData.party);
    const id = btoa(Number(rowData.pid));
    history.push(`/admin/v1/viewAccount/${id}`);
  };
  const sendWhatsapp = (cellData, rowData, row, col) => {
    const { party, withoutamt, billamt, total } = rowData;

    const withoutDebit = withoutamt.includes("Dr") ? "Debit" : "Credit";
    const billDebit = billamt.includes("Dr") ? "Debit" : "Credit";
    const totalDebit = total.includes("Dr") ? "Debit" : "Credit";

    const msg = `Account Ledger(${format(new Date(), "dd-MM-yyyy")})
${party}
Without ${withoutDebit} = ${withoutamt
      .replace("&nbsp;", "")
      .replace("Dr", "")
      .replace("Cr", "")}
Bill ${billDebit} = ${billamt
      .replace("&nbsp;", "")
      .replace("Dr", "")
      .replace("Cr", "")}
Total ${totalDebit} = ${total
      .replace("&nbsp;", "")
      .replace("Dr", "")
      .replace("Cr", "")}`;
    setWPData({ mobile: rowData.mobile, msg: msg, show: true });
  };
  const sendWhatsappPdf = async (cellData, rowData, row, col) => {
    const id = btoa(Number(rowData.pid));
    dispatch(setLoader(true));
    const resp = await accountpdf(user.token, id, 10, 0, 1);
    dispatch(setLoader(false));
    if (resp.data.success == 1) {
      Toast.fire({
        icon: "success",
        title: resp.data.msg || "Sent Successfully !!",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: resp.data.msg || "Something went wrong",
      });
    }
  };

  const handleShowConfirmation = () => {
    if (showDelete) {
      setDeleteEntry(null);
    }
    setShowDelete(!showDelete);
  };

  const deleteCreditDebitEntry = async () => {
    if (deleteEntry != null) {
      handleShowConfirmation();
      dispatch(setLoader(true));
      const resp = await deleteRecord(user.token, {
        type: "creditdebit",
        id: deleteEntry.id,
      });

      if (resp.data.sucess == 1) {
        Toast.fire({
          icon: "success",
          title: resp.message,
        });
        getCreditDebitList();
        setDeleteEntry(null);
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
    setDeleteEntry(cellData);
    handleShowConfirmation();
  };

  const validate = Yup.object({
    pid: Yup.string().required("Required"),
    amount: Yup.number().required("Required"),
    billtype: Yup.string().required("Required"),
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
  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Party Name",
      data: "party",
      className: "all",
    },
    {
      title: "Without Outstanding",
      data: "withoutamt",
    },
    {
      title: "Bill Outstanding",
      data: "billamt",
    },
    {
      title: "Total",
      data: "total",
    },
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
                  className="btn-outline-primary btn-icon btn-sm"
                  color="default"
                  onClick={() => viewInvoice(cellData, rowData, row, col)}
                >
                  <span>
                    <FaEye size={12} />
                  </span>
                </Button>
              </div>
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
                  onClick={() => sendWhatsappPdf(cellData, rowData, row, col)}
                >
                  <span>
                    <FaWhatsapp size={12} /> Pdf
                  </span>
                </Button>
              </div>
            </div>
          </>
        );
      },
      className: "all",
    },
  ];

  const columns2 = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Party Name",
      data: "party",
      className: "all",
    },
    {
      title: "Type",
      data: "type",
    },
    {
      title: "Invoice",
      data: "invoice",
    },
    {
      title: "WithoutAmt",
      data: "withoutamt",
    },
    {
      title: "BillAmt",
      data: "billamt",
    },
    {
      title: "Desc",
      data: "desc",
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

  var colDefs = [];

  const addRecord = async (payload) => {
    let resp = null;

    dispatch(setLoader(true));
    if (addType == 1) {
      resp = await addCreditDebit(user.token, {
        type: "credit",
        ...payload,
      });
    } else {
      resp = await addCreditDebit(user.token, {
        type: "debit",
        ...payload,
      });
    }
    Toast.fire({
      icon: resp.data.success == 1 ? "success" : "error",
      title:
        resp.data.success == 1
          ? addType == 1
            ? "Credit Added Successfully"
            : "Debit Added Successfully"
          : "Something wen't wrong",
    });
    dispatch(setLoader(false));
    if (resp.data.success == 1) {
      handleToggle();
      getAccounts();
    }
  };

  const getAccounts = async () => {
    setLoading(true);
    const data = await accountListGet(user.token);
    if (data.data) {
      setAccounts(data.data.account_list);
    } else {
      setAccounts([]);
    }
    setLoading(false);
  };

  const getCreditDebitList = async () => {
    setLoading(true);
    const data = await creditDebitListGet(user.token);
    if (data.data) {
      setCreditDebit(data.data.account_list);
    } else {
      setCreditDebit([]);
    }
    setLoading(false);
  };

  const toggleWPModal = async (payload) => {
    setWPData({ ...wpData, show: !wpData.show });
  };

  useEffect(() => {
    if (showAccount) {
      getAccounts();
    } else {
      getCreditDebitList();
    }
  }, [showAccount, fyear]);

  return (
    <>
      <CustomModal
        show={show}
        title={addType == 1 ? "Credt" : "Debit"}
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
            billtype: "",
            date: format(new Date(), "yyyy-MM-dd"),
            description: "",
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            addRecord(values);
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
                  name="billtype"
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
                {/* 
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
                /> */}

                <CustomInput
                  placeholder=""
                  name="date"
                  type="date"
                  label="Date"
                />
                <CustomInput
                  placeholder="Description"
                  name="description"
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
        msg={wpData.msg}
        withMsg={true}
      />
      <ConfirmationDialog
        show={showDelete}
        handleToggle={handleShowConfirmation}
        title="Delete"
        handleOkay={deleteCreditDebitEntry}
        handleCancel={handleShowConfirmation}
      >
        Are You Sure you want to delete this ?
      </ConfirmationDialog>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        {showAccount ? (
          <>
            <Row sm="2" xs="1" className="mb-2">
              <Col>
                <Row className="ml-0 mb-1">
                  <Button
                    className="btn-md btn-outline-primary"
                    onClick={() => setShowAccount(false)}
                  >
                    Debit/Credit Entry List
                  </Button>
                </Row>
              </Col>
              <Col>
                <Row className="justify-content-end mr-0 ml-0">
                  <Button
                    className="btn-md btn-outline-success"
                    onClick={() => {
                      setAddType(1);
                      handleToggle();
                    }}
                  >
                    Add Credit
                  </Button>
                  <Button
                    className="btn-md btn-outline-danger"
                    onClick={() => {
                      setAddType(2);
                      handleToggle();
                    }}
                  >
                    Add Debit
                  </Button>
                </Row>
              </Col>
            </Row>

            {loading ? (
              <Loader loading={loading} />
            ) : (
              <Row>
                <div className="col">
                  <CustomTable
                    cols={columns}
                    dark={false}
                    data={accounts}
                    // columndefs={colDefs}
                    title="Account List"
                    ref={childRef}
                    hasEdit={false}
                    hasDelete={false}
                  />
                </div>
              </Row>
            )}
          </>
        ) : (
          <>
            <Row sm="2" className="mb-2">
              <Col>
                <Row className="ml-0">
                  <Button
                    className="btn-md btn-outline-primary"
                    onClick={() => setShowAccount(true)}
                  >
                    Account List
                  </Button>
                </Row>
              </Col>
            </Row>
            {loading ? (
              <Loader loading={loading} />
            ) : (
              <Row>
                <div className="col">
                  <div>
                    <CustomTable
                      cols={columns2}
                      dark={false}
                      data={creditDebit}
                      title="CreditDebit List"
                      ref={childRef2}
                      hasEdit={false}
                      deleteClick={deleteClick}
                    />
                  </div>
                </div>
              </Row>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Party;
