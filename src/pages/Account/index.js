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
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
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
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

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
    console.log(data);
    setCreditDebit(data.data.account_list);
    setLoading(false);
  };

  useEffect(() => {
    if (showAccount) {
      getAccounts();
    } else {
      getCreditDebitList();
    }
  }, [showAccount]);

  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        {showAccount ? (
          <>
            <Row sm="2" className="mb-2">
              <Col>
                <Row className="ml-0">
                  <Button
                    className="btn-md btn-outline-primary"
                    onClick={() => setShowAccount(false)}
                  >
                    Debit/Credit Entry List
                  </Button>
                </Row>
              </Col>
              <Col>
                <Row className="justify-content-end mr-0">
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
