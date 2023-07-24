import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
} from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import CustomTab from "components/Custom/CustomTab";
import {
  saleListGet,
  invoiceGet,
  invoiceDownload,
  deleteRecord,
  salejson,
} from "api/api";
import $ from "jquery";
import { format } from "date-fns";
import Loader from "components/Custom/Loader";
import * as Yup from "yup";

import ReactDOM from "react-dom/client";
import { getMonthName } from "api/api";
import { useHistory } from "react-router-dom";
import { FaDownload, FaEye, FaPrint, FaWhatsapp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import HTMLReactParser from "html-react-parser";
import CustomModal from "components/Custom/CustomModal";
import { setIn } from "formik";
import Swal from "sweetalert2";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
const Sales = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });
  const [sales, setSales] = useState({
    all: [],
    monthly: [],
  });

  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const history = useHistory();
  const childRef = useRef(null);
  const childRef2 = useRef(null);
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const { user, fyear } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [selMonth, setSelMonth] = useState(0);
  const [monthSales, setmonthSales] = useState([]);
  const [invoiceHtml, setInvoiceHtml] = useState("");
  const [original, setOriginal] = useState(true);
  const [transport, setTransport] = useState(false);
  const [office, setOffice] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [without, setWithout] = useState(false);
  const dispatch = useDispatch();
  const [invId, setInvId] = useState("");
  const formRef = useRef(null);
  const printIframe = (id) => {
    const iframe = document.frames
      ? document.frames[id]
      : document.getElementById(id);
    const iframeWindow = iframe.contentWindow || iframe;

    iframe.focus();
    iframeWindow.print();

    return false;
  };

  const handleToggle = () => {
    setShow(!show);
  };

  const handleShowConfirmation = () => {
    if (showDelete) {
      setDeleteId(null);
    }
    setShowDelete(!showDelete);
  };

  const deleteInvoice = async () => {
    if (deleteId != null) {
      dispatch(setLoader(true));
      const resp = await deleteRecord(user.token, {
        type: "invoice",
        id: deleteId,
      });
      dispatch(setLoader(false));
      if (resp.data.sucess == 1) {
        Toast.fire({
          icon: "success",
          title: resp.message,
        });
        handleShowConfirmation();
        getData();
      } else {
        Toast.fire({
          icon: "error",
          title: resp.message,
        });
      }
    }
  };

  const deleteClick = (cellData, rowData, row, col) => {
    setDeleteId(cellData.id);
    handleShowConfirmation();
  };

  const viewInvoice = async (rowData) => {
    const id = btoa(Number(rowData.id));
    setInvId(id);
    setOriginal(true);
    setDuplicate(false);
    setOffice(false);
    setTransport(false);
    handleToggle();
    dispatch(setLoader(true));
    const resp = await invoiceGet(user.token, {
      id: id,
      a: 1,
      b: 0,
      c: 0,
      d: 0,
      w: 0,
    });
    setInvoiceHtml(resp.data);
    dispatch(setLoader(false));
  };

  const ewayJson = async (rowData) => {
    const id = btoa(Number(rowData.id));
    dispatch(setLoader(true));
    const resp = await salejson(user.token, id, 1);
    dispatch(setLoader(false));
    if (resp.data.pdfurl) {
      const url = resp.data.pdfurl;
      let alink = document.createElement("a");
      alink.href = url;
      alink.target = "_blank";
      alink.download = url.substring(url.lastIndexOf("/") + 1);
      alink.click();
    }
  };

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
                  onClick={() => viewInvoice(rowData)}
                >
                  <span>
                    <FaEye size={12} />
                  </span>
                </Button>
              </div>
              <div>
                <Button
                  className="btn-outline-info btn-icon btn-sm"
                  color="default"
                  onClick={() => ewayJson(rowData)}
                >
                  <span>EwayBillJSON</span>
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
        setmonthSales(data2.sale || []);
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
      hasDelete={false}
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

  const invoiceWithChecks = async () => {
    dispatch(setLoader(true));
    const resp = await invoiceGet(user.token, {
      id: invId,
      a: original && !without ? 1 : 0,
      b: transport && !without ? 1 : 0,
      c: office && !without ? 1 : 0,
      d: duplicate && !without ? 1 : 0,
      w: without ? 1 : 0,
    });
    setInvoiceHtml(resp.data);
    dispatch(setLoader(false));
  };

  const downloadOrWhatsappInvoice = async (whatsapp) => {
    dispatch(setLoader(true));
    const resp = await invoiceDownload(user.token, {
      id: invId,
      a: original && !without ? 1 : 0,
      b: transport && !without ? 1 : 0,
      c: office && !without ? 1 : 0,
      d: duplicate && !without ? 1 : 0,
      w: without ? 1 : 0,
      wp: whatsapp ? 1 : 0,
    });
    dispatch(setLoader(false));
    if (whatsapp) {
      Toast.fire({
        icon: resp.data.success == 1 ? "success" : "error",
        title: resp.data.msg || "Something went wrong",
      });
    } else {
      const url = resp.data.pdfurl;
      let alink = document.createElement("a");
      alink.href = url;
      alink.target = "_blank";
      alink.download = url.substring(url.lastIndexOf("/") + 1);
      alink.click();
    }
  };

  useEffect(() => {
    if (show) {
      invoiceWithChecks();
    }
  }, [without, original, duplicate, transport, office]);
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
      </CustomModal> */}
      <ConfirmationDialog
        show={showDelete}
        handleToggle={handleShowConfirmation}
        title="Delete"
        handleOkay={deleteInvoice}
        handleCancel={handleShowConfirmation}
      >
        Are You Sure you want to delete this ?
      </ConfirmationDialog>
      <CustomModal
        show={show}
        title="View/Print Invoice"
        handleToggle={handleToggle}
        centered={false}
        iframe={true}
        fullscreen={true}
        footer={
          <>
            <Row className="w-100">
              <Col xs={12} lg={9}>
                <Row className="w-100">
                  <Col xs={6} sm={3} md={2}>
                    <input
                      type="checkbox"
                      id="without"
                      checked={without}
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setOriginal(false);
                          setTransport(false);
                          setOffice(false);
                          setDuplicate(false);
                        } else {
                          setOriginal(true);
                        }

                        setWithout(e.currentTarget.checked);
                      }}
                    />
                    <label className="ml-2" htmlFor="without">
                      Without
                    </label>
                  </Col>
                  <Col xs={6} sm={3} md={2}>
                    <input
                      type="checkbox"
                      id="original"
                      checked={original}
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setWithout(false);
                        }
                        setOriginal(e.currentTarget.checked);
                        if (
                          !e.currentTarget.checked &&
                          !office &&
                          !transport &&
                          !duplicate
                        ) {
                          setOriginal(true);
                        }
                      }}
                    />
                    <label className="ml-2" htmlFor="original">
                      Original
                    </label>
                  </Col>
                  <Col xs={6} sm={3} md={2}>
                    <input
                      type="checkbox"
                      id="transport"
                      checked={transport}
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setWithout(false);
                        }
                        setTransport(e.currentTarget.checked);
                        if (
                          !e.currentTarget.checked &&
                          !office &&
                          !original &&
                          !duplicate
                        ) {
                          setOriginal(true);
                        }
                      }}
                    />
                    <label className="ml-2" htmlFor="transport">
                      Transport
                    </label>
                  </Col>
                  <Col xs={6} sm={3} md={2}>
                    <input
                      type="checkbox"
                      id="office"
                      checked={office}
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setWithout(false);
                        }
                        setOffice(e.currentTarget.checked);
                        if (
                          !e.currentTarget.checked &&
                          !original &&
                          !transport &&
                          !duplicate
                        ) {
                          setOriginal(true);
                        }
                      }}
                    />
                    <label className="ml-2" htmlFor="office">
                      Office
                    </label>
                  </Col>
                  <Col xs={6} sm={3} md={2}>
                    <input
                      type="checkbox"
                      id="duplicate"
                      checked={duplicate}
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setWithout(false);
                        }
                        setDuplicate(e.currentTarget.checked);
                        if (
                          !e.currentTarget.checked &&
                          !office &&
                          !transport &&
                          !original
                        ) {
                          setOriginal(true);
                        }
                      }}
                    />
                    <label className="ml-2" htmlFor=" duplicate">
                      Duplicate
                    </label>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} lg={3}>
                <div className="d-flex">
                  <Button
                    type="submit"
                    className="mr-1 btn-outline-success"
                    size="sm"
                    onClick={() => downloadOrWhatsappInvoice(true)}
                  >
                    <FaWhatsapp color="success" /> Whatsapp
                  </Button>
                  <Button
                    type="submit"
                    className="btn-outline-primary"
                    size="sm"
                    onClick={() => downloadOrWhatsappInvoice(false)}
                  >
                    <FaDownload color="primary" /> Download
                  </Button>{" "}
                  <Button
                    type="submit"
                    className="mr-1 btn-outline-warning"
                    size="sm"
                    onClick={() => printIframe("iframe")}
                  >
                    <FaPrint color="warning" /> Print
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        }
      >
        <div dangerouslySetInnerHTML={{ __html: invoiceHtml }}></div>
      </CustomModal>
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
                    onClick={() => history.push("/admin/v1/sales-invoice")}
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
                    onClick={() => history.push("/admin/v1/sales-invoice")}
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
