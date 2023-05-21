import { Container, Row, Col, Button } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import CustomTab from "components/Custom/CustomTab";
import { saleListGet } from "api/api";
import $ from "jquery";
import { format } from "date-fns";
import Loader from "components/Custom/Loader";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ReactDOM from "react-dom/client";
import { purchaseListGet, getMonthName } from "api/api";
import { useHistory } from "react-router-dom";

const Sales = () => {
  const [sales, setSales] = useState({
    all: [],
    monthly: [],
  });

  const history = useHistory();
  const childRef = useRef(null);
  const childRef2 = useRef(null);
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const { user, fyear } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [selMonth, setSelMonth] = useState(0);
  const [monthSales, setmonthSales] = useState([]);

  const formRef = useRef(null);

  //   const handleShowConfirmation = () => {
  //     if (showDelete) {
  //       setExpenseId(null);
  //     }
  //     setShowDelete(!showDelete);
  //   };

  //   const deleteExpense = async () => {
  //     if (expenseId != null) {
  //       handleShowConfirmation();
  //       setLoading(true);
  //       const resp = await deleteRecord(user.token, {
  //         type: "expenses",
  //         id: expenseId,
  //       });
  //       toast(resp.message);
  //       if (resp.data.sucess == 1) {
  //         getExpenses();
  //         setExpenseId(null);
  //       }
  //     }
  //   };

  //   const deleteClick = (cellData, rowData, row, col) => {
  //     setExpenseId(cellData.id);
  //     handleShowConfirmation();
  //   };

  //   const handleToggle = async () => {
  //     if (!show) {
  //       //await getTransactionParties().then(() => setShow(true));
  //       setShow(true);
  //     } else {
  //       setShow(false);
  //     }
  //   };

  var colDefs = [
    {
      targets: -2,
      render: function (data) {
        return new Date(data).toLocaleDateString("en-GB").replaceAll("/", "-");
      },
    },
  ];

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
      title: "BNo",
      data: "bno",
    },
    {
      title: "WithoutAmt",
      data: "withoutAmt",
    },
    {
      title: "BillAmt",
      data: "billamt",
    },

    {
      title: "GST",
      data: "gst",
    },

    {
      title: "Total",
      data: "total",
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

  const columnsMonthly = [
    {
      title: "Month",
      data: "Month",
      className: "all",
    },
    {
      title: "No",
      data: "no",
    },
    {
      title: "WithoutAmt",
      data: "withoutAmt",
    },
    {
      title: "BillAmt",
      data: "billAmt",
    },

    {
      title: "GST",
      data: "gst",
    },

    {
      title: "Total",
      data: "total",
      className: "all",
    },
  ];

  var colDefsMonthly = [
    {
      targets: 0,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        root.render(
          <a
            className="text-primary cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setSelMonth(row + 1);
            }}
          >
            {cellData}
          </a>
        );
      },
    },
  ];

  const getData = async () => {
    setLoading(true);
    var data = {};
    if (selMonth > 0) {
      data = await saleListGet(user.token, "", "", selMonth);
    } else {
      data = await saleListGet(user.token, filterDate.st, filterDate.et);
    }

    if (selMonth > 0) {
      if (data.data) {
        var data2 = data.data;
        setmonthSales(data2.sale);
      } else {
        setmonthSales([]);
      }
    } else {
      if (data.data) {
        var data2 = data.data;
        setSales({
          all: data2.sale || [],
          monthly: data2.monthly_sale || [],
        });
      } else {
        setSales({ all: [], monthly: [] });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [filterDate, selMonth, fyear]);

  //   const addExpense = async (payload) => {
  //     handleToggle();
  //     setLoading(true);
  //     let resp = await expenseAdd(user.token, payload);
  //     toast(resp.message);
  //     if (resp.data.sucess == 1) {
  //       getExpenses();
  //     }
  //   };

  const tabPan = [
    <CustomTable
      cols={columns}
      columndefs={colDefs}
      dark={false}
      data={sales.all}
      title="Sales List"
      withCard={false}
      hasEdit={false}
      custom={true}
      ref={childRef}
      //   deleteClick={deleteClick}
      numColumns={[3, 4, 5, 6]}
    />,
    <CustomTable
      cols={columnsMonthly}
      columndefs={colDefsMonthly}
      dark={false}
      data={sales.monthly}
      title="Monthly List"
      withCard={false}
      hasEdit={false}
      hasDelete={false}
      custom={true}
      ref={childRef2}
      showNoCol={false}
      pageLength={12}
    />,
  ];

  const onChangeEvents = [
    () => {
      childRef.current.setResponsive();
    },
    () => {
      childRef2.current.setResponsive();
    },
  ];

  const dateSelect = (start, end) => {
    setFilterDate({
      st: format(start.toDate(), "yyyy-MM-dd"),
      et: format(end.toDate(), "yyyy-MM-dd"),
    });
  };

  const validate = Yup.object({
    amount: Yup.number().required("Required"),
    type: Yup.string().required("Required"),
    mode: Yup.string().required("Required"),
    date: Yup.date().required("Required"),
  });

  return (
    <>
      {/* <CustomModal
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
            amount: "",
            type: "",
            mode: "",
            date: format(new Date(), "yyyy-MM-dd"),
            desc: "",
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            addExpense(values);
          }}
          innerRef={formRef}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(formik) => (
            <div>
              <Form>
                <CustomInput
                  name="type"
                  type="select"
                  label="Expense Type"
                  options={[
                    { label: "Select Type", value: "" },
                    { label: "Salary", value: "Salary" },
                    { label: "Rent", value: "Rent" },
                    { label: "Machine", value: "Machine" },
                    { label: "Transsport", value: "Transsport" },
                    { label: "Other", value: "Other" },
                  ].map((opt) => {
                    return <option value={opt.value}>{opt.label}</option>;
                  })}
                />
                <CustomInput
                  name="mode"
                  type="select"
                  label="Expense Mode"
                  options={[
                    { label: "Select Mode", value: "" },
                    { label: "Cash", value: "Cash" },
                    { label: "Bank", value: "Bank" },
                  ].map((opt) => {
                    return <option value={opt.value}>{opt.label}</option>;
                  })}
                />
                <CustomInput
                  placeholder="Amount"
                  name="amount"
                  type="number"
                  label="Amount"
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
        handleOkay={deleteExpense}
        handleCancel={handleShowConfirmation}
      >
        Are You Sure you want to delete this ?
      </ConfirmationDialog> */}
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        {selMonth > 0 ? (
          <>
            <Row sm="2" className="mb-2">
              <Col className="">
                <Row className="ml-0">
                  <h1>
                    {selMonth}-{getMonthName(selMonth)} Sales
                  </h1>
                  <Button
                    className="btn-sm btn-outline-primary ml-2 mt-2 mb-2"
                    onClick={() => setSelMonth(0)}
                  >
                    All Sales
                  </Button>
                </Row>
              </Col>
              <Col>
                <Row className="justify-content-end mr-0">
                  <Button
                    className="btn-md btn-outline-primary"
                    onClick={() => history.push("/admin/sales-invoice")}
                  >
                    Create Sales Bill
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
                      data={monthSales}
                    />
                  </div>
                </Row>
              </>
            )}
          </>
        ) : (
          <>
            <Row sm="2" xs="1" className="mb-2">
              <Col>
                <Row className="ml-0">
                  <CustomDatePicker
                    onCallback={dateSelect}
                    text="Sales By Date"
                  />
                  <Button
                    className="btn-md btn-outline-primary mb-1"
                    onClick={() => setFilterDate({ st: "", et: "" })}
                  >
                    All Sales
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
                <Row className="justify-content-md-end mr-0 ml-0">
                  <Button
                    className="btn-md btn-outline-primary"
                    onClick={() => history.push("/admin/sales-invoice")}
                  >
                    Create Sales Bill
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
                      tabnames={["All Sales", "Monthly Sale"]}
                      tabpanes={tabPan}
                      onChangeEvents={onChangeEvents}
                    />
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

export default Sales;
