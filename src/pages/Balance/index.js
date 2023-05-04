import { Container, Row, Col, Button } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import CustomTab from "components/Custom/CustomTab";
import { balanceListGet, balanceEntryListGet } from "api/api";
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

  const [balances, setbalances] = useState([]);
  const [balanceEntries, setbalanceEntries] = useState([]);

  const childRef = useRef(null);
  const childRef2 = useRef(null);
  const { user, fyear } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [showBalEntry, setshowBalEntry] = useState(false);
  const dispatch = useDispatch();
  const formRef = useRef(null);

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
      title: "Type",
      data: "Type",
    },
    {
      title: "Balance",
      data: "Balance",
    },
    {
      title: "Action",
      data: null,
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
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        {!showBalEntry ? (
          <>
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
                  <Button className="btn-md btn-outline-success">
                    Deposit
                  </Button>
                  <Button className="btn-md btn-outline-danger">
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
                          custom={true}
                          ref={childRef}
                          // deleteClick={deleteClick}
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
                            // deleteClick={deleteClick}
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
