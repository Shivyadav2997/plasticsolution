import { Container, Row, Col, Button } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import CustomTab from "components/Custom/CustomTab";
import {
  expensesListGet,
  deleteRecord,
  expenseAdd,
  bankListGet,
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
import { getExpenseGroup } from "api/api";

const Expense = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const [expenses, setExpenses] = useState({
    all: [],
    monthly: [],
  });

  const [expenseGroups, setExpenseGroups] = useState([]);
  const childRef = useRef(null);
  const childRef2 = useRef(null);
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const { user, fyear } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [expenseId, setExpenseId] = useState(null);
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const [banks, setbanks] = useState([]);

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

  const handleShowConfirmation = () => {
    if (showDelete) {
      setExpenseId(null);
    }
    setShowDelete(!showDelete);
  };

  const deleteExpense = async () => {
    if (expenseId != null) {
      handleShowConfirmation();
      dispatch(setLoader(true));
      const resp = await deleteRecord(user.token, {
        type: "expenses",
        id: expenseId,
      });
      Toast.fire({
        icon: "success",
        title: resp.message,
      });
      dispatch(setLoader(false));
      if (resp.data.sucess == 1) {
        getExpenses();
        setExpenseId(null);
      }
    }
  };

  const deleteClick = (cellData, rowData, row, col) => {
    setExpenseId(cellData.id);
    handleShowConfirmation();
  };

  const handleToggle = async () => {
    if (!show) {
      await getbanks();
      setShow(true);
    } else {
      setShow(false);
    }
  };

  var colDefs = [
    {
      targets: -2,
      // createdCell: (td, cellData, rowData, row, col) => {
      //   const root = ReactDOM.createRoot(td);
      //   root.render(
      //     <>{format(parse(cellData, "yyyy-MM-dd", new Date()), "dd-MM-yyyy")}</>
      //   );
      // },
      render: function (data, type, row, meta) {
        return new Date(data).toLocaleDateString("en-GB").replaceAll("/", "-");
      },
    },
  ];

  const columnsExpenses = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Type",
      data: "type",
      className: "all",
    },
    {
      title: "Mode",
      data: "mode",
    },
    {
      title: "Amount",
      data: "amount",
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

  const columnsMonthlyExpenses = [
    {
      title: "Month",
      data: "Month",
      className: "all",
    },
    {
      title: "Expenses Amount",
      data: "Amount",
      className: "all",
    },
  ];

  const getExpenses = async () => {
    setLoading(true);
    var data = await expensesListGet(user.token, filterDate.st, filterDate.et);
    if (data.data) {
      var data2 = data.data;
      setExpenses({
        all: data2.expenses || [],
        monthly: data2.monthly_expenses || [],
      });
    } else {
      setExpenses({ all: [], monthly: [] });
    }
    setLoading(false);
  };

  const getExpenseGroups = async () => {
    setLoading(true);
    var data = await getExpenseGroup(user.token);
    if (data.data) {
      setExpenseGroups(data.data);
    } else {
      setExpenseGroups([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getExpenses();
  }, [filterDate, fyear]);

  useEffect(() => {
    if (sessionStorage.getItem("openAdd")) {
      handleToggle();
      sessionStorage.removeItem("openAdd");
    }
  }, []);

  useEffect(() => {
    if (show) getExpenseGroups();
  }, [show]);
  const addExpense = async (payload) => {
    dispatch(setLoader(true));
    let resp = await expenseAdd(user.token, payload);
    Toast.fire({
      icon: resp.data.sucess == 1 ? "success" : "error",
      title: resp.message,
    });
    dispatch(setLoader(false));
    if (resp.data.sucess == 1) {
      handleToggle();
      getExpenses();
    }
  };

  const tabPan = [
    <CustomTable
      cols={columnsExpenses}
      columndefs={colDefs}
      dark={false}
      data={expenses.all}
      title="Expense List"
      withCard={false}
      hasEdit={false}
      custom={true}
      ref={childRef}
      deleteClick={deleteClick}
    />,
    <CustomTable
      cols={columnsMonthlyExpenses}
      dark={false}
      data={expenses.monthly}
      title="Monthly Expense List"
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
    id: Yup.string().required("Required"),
    mode: Yup.string().required("Required"),
    date: Yup.date().required("Required"),
  });

  return (
    <>
      <CustomModal
        show={show}
        title={`Expense`}
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
            id: "",
            mode: "",
            date: format(new Date(), "yyyy-MM-dd"),
            desc: "",
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            const type =
              expenseGroups.find((x) => x.id == values.id)?.name ?? "";
            addExpense({ ...values, type: type });
          }}
          innerRef={formRef}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(formik) => (
            <div>
              <Form>
                <CustomInput
                  name="id"
                  type="select"
                  label="Expense Type"
                  options={[
                    { label: "Select Type", value: "" },
                    ...expenseGroups.map((option) => ({
                      label: option.name,
                      value: option.id,
                    })),
                  ].map((opt) => {
                    return <option value={opt.value}>{opt.label}</option>;
                  })}
                />
                <CustomInput
                  name="mode"
                  type="select"
                  label="Expense Mode"
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
      </ConfirmationDialog>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <Row sm="2" xs="1" className="mb-2">
          <Col>
            <Row className="ml-0">
              <CustomDatePicker
                onCallback={dateSelect}
                text="Expenses By Date"
              />
              <Button
                className="btn-md btn-outline-primary mb-1"
                onClick={() => setFilterDate({ st: "", et: "" })}
              >
                All Expenses
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
                onClick={() => {
                  handleToggle();
                }}
              >
                Add Expense
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
                  tabnames={["All Expenses", "Monthly Expenses"]}
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

export default Expense;
