import { Container, Row, Col, Button } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import CustomTab from "components/Custom/CustomTab";
import { purchaseListGet } from "api/api";
import $ from "jquery";
import { format } from "date-fns";
import Loader from "components/Custom/Loader";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Purchase = () => {
  const [purchases, setPurchases] = useState({
    all: [],
    monthly: [],
  });

  const childRef = useRef(null);
  const childRef2 = useRef(null);
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [expenseId, setExpenseId] = useState(null);

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
    },
  ];

  const getData = async () => {
    setLoading(true);
    var data = await purchaseListGet(user.token, filterDate.st, filterDate.et);
    if (data.data) {
      var data2 = data.data;
      setPurchases({
        all: data2.purchase || [],
        monthly: data2.monthly_purchase || [],
      });
    } else {
      setPurchases({ all: [], monthly: [] });
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [filterDate]);

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
      // columndefs={colDefs}
      dark={false}
      data={purchases.all}
      title="Purchase List"
      withCard={false}
      hasEdit={false}
      custom={true}
      ref={childRef}
      //   deleteClick={deleteClick}
      numColumns={[3, 4, 5, 6]}
    />,
    <CustomTable
      cols={columnsMonthly}
      dark={false}
      data={purchases.monthly}
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
        <Row sm="2" xs="1" className="mb-2">
          <Col>
            <Row className="ml-0">
              <CustomDatePicker
                onCallback={dateSelect}
                text="Purchases By Date"
              />
              <Button
                className="btn-md btn-outline-primary"
                onClick={() => setFilterDate({ st: "", et: "" })}
              >
                All Purchase
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
                className="btn-md btn-outline-primary"
                onClick={() => {
                  //   handleToggle();
                }}
              >
                Add Purchase
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
                  tabnames={["All Purchases", "Monthly Purchase"]}
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

export default Purchase;
