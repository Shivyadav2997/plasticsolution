import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import { creditDebitListGet, accountListGet } from "api/api";
import ReactDOM from "react-dom/client";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loader from "components/Custom/Loader";
import { FaWhatsapp, FaPhoneAlt, FaEye } from "react-icons/fa";
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

  const childRef = useRef(null);
  const childRef2 = useRef(null);
  const [accounts, setAccounts] = useState([]);
  const [creditDebit, setCreditDebit] = useState([]);
  const [showAccount, setShowAccount] = useState(true);
  const { user, fyear } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const viewInvoice = (cellData, rowData, row, col) => {
    console.log(rowData);
  };
  const sendWhatsapp = (cellData, rowData, row, col) => {
    console.log(rowData);
  };
  const sendWhatsappPdf = (cellData, rowData, row, col) => {
    console.log(rowData);
  };
  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Party Name",
      data: "party",
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

  const getAccounts = async () => {
    setLoading(true);
    const data = await accountListGet(user.token);
    setAccounts(data.data.account_list);
    setLoading(false);
  };

  const getCreditDebitList = async () => {
    setLoading(true);
    const data = await creditDebitListGet(user.token);
    setCreditDebit(data.data.account_list);
    setLoading(false);
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
                  <Button className="btn-md btn-outline-success">
                    Add Credit
                  </Button>
                  <Button className="btn-md btn-outline-danger">
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
