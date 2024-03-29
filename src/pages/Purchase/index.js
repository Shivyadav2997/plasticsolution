import { Container, Row, Col, Button } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import CustomTab from "components/Custom/CustomTab";
import {
  purchaseListGet,
  invoiceGet,
  invoiceDownload,
  deleteRecord,
  transactionPartyGet,
  monthlyInvoice,
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
import CustomModal from "components/Custom/CustomModal";
import Swal from "sweetalert2";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import WhatsappModal from "components/Custom/WhatsappModal";
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";
import { BiEditAlt } from "react-icons/bi";

const Purchase = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });
  const [purchases, setPurchases] = useState({
    all: [],
    monthly: [],
  });

  const [parties, setParties] = useState([]);
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
  const [monthPurchases, setMonthPurchases] = useState([]);
  const [invoiceHtml, setInvoiceHtml] = useState("");
  const [original, setOriginal] = useState(true);
  const [without, setWithout] = useState(false);
  const dispatch = useDispatch();
  const [invId, setInvId] = useState("");
  const [wpData, setWPData] = useState({
    show: false,
    mobile: "",
    t: 0,
  });
  const [monthlywpData, setMonthlyWPData] = useState({
    show: false,
    mobile: "",
    month: 0,
  });
  const [selParty, setSelParty] = useState({ id: null, name: "" });
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
          timer: null,
          showCloseButton: true,
          title: resp.message,
        });
      }
    }
  };

  const deleteClick = (cellData, rowData, row, col) => {
    setDeleteId(cellData.id);
    handleShowConfirmation();
  };

  const editClick = (cellData, rowData, row, col) => {
    const id = btoa(Number(cellData.id));
    history.push(`/admin/v1/purchase-invoice?invoice=${id}`);
  };

  const viewInvoice = async (rowData) => {
    const id = btoa(Number(rowData.id));
    setInvId(id);
    setOriginal(true);
    setWPData({ ...wpData, mobile: rowData.mobile ?? "" });
    handleToggle();
    dispatch(setLoader(true));
    const resp = await invoiceGet(user.token, {
      id: id,
      p: 1,
      a: 1,
      w: 0,
    });
    setInvoiceHtml(resp.data);
    dispatch(setLoader(false));
  };

  var colDefs = [
    {
      targets: 1,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        root.render(
          <a
            className="text-primary cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setSelParty({ id: rowData.pid, name: rowData.b_name });
            }}
          >
            {cellData}
          </a>
        );
      },
    },
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
                  className="btn-neutral btn-icon btn-sm"
                  color="default"
                  onClick={() => editClick(cellData, rowData, row, col)}
                >
                  <span>
                    <BiEditAlt size={16} />
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
                  className="btn-outline-success btn-icon btn-sm"
                  onClick={() =>
                    setMonthlyWPData({
                      show: true,
                      mobile: rowData.mobile,
                      month: row + 1,
                    })
                  }
                >
                  <span>
                    <FaWhatsapp size={12} />
                  </span>
                </Button>
              </div>
              <div>
                <Button
                  className="btn-outline-info btn-icon btn-sm"
                  onClick={() =>
                    downloadOrWhatsappMonthlyInvoice(false, row + 1, "")
                  }
                >
                  <span>
                    <FaDownload size={12} />
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
      data = await purchaseListGet(user.token, "", "", selMonth);
    } else {
      data = await purchaseListGet(
        user.token,
        filterDate.st,
        filterDate.et,
        "",
        selParty.id
      );
    }

    if (selMonth > 0) {
      if (data.data) {
        var data2 = data.data;
        setMonthPurchases(data2.purchase || []);
      } else {
        setMonthPurchases([]);
      }
    } else {
      if (data.data) {
        var data2 = data.data;
        setPurchases({
          all: data2.purchase || [],
          monthly: data2.monthly_purchase || [],
        });
      } else {
        setPurchases({ all: [], monthly: [] });
      }
    }
    setLoading(false);
  };

  const getTransactionParties = async () => {
    dispatch(setLoader(true));
    var data = await transactionPartyGet(user.token);
    dispatch(setLoader(false));
    if (data.data) {
      setParties(data.data);
    }
  };

  useEffect(() => {
    getData();
  }, [filterDate, selMonth, fyear, selParty.id]);

  useEffect(() => {
    getTransactionParties();
  }, []);

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
      data={purchases.all}
      title="Purchase List"
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

  const invoiceWithChecks = async () => {
    dispatch(setLoader(true));
    const resp = await invoiceGet(user.token, {
      id: invId,
      p: 1,
      a: original && !without ? 1 : 0,
      w: without ? 1 : 0,
    });
    setInvoiceHtml(resp.data);
    dispatch(setLoader(false));
  };

  const downloadOrWhatsappInvoice = async (whatsapp, mob) => {
    dispatch(setLoader(true));
    const resp = await invoiceDownload(user.token, {
      id: invId,
      p: 1,
      a: original && !without ? 1 : 0,
      w: without ? 1 : 0,
      wp: whatsapp ? 1 : 0,
      mo: mob,
    });
    dispatch(setLoader(false));
    if (whatsapp) {
      toggleWPModal();
      Toast.fire({
        icon: resp.data.success == 1 ? "success" : "error",
        title: resp.data.msg || "Something went wrong",
      });
    } else {
      const url = resp.data.pdfurl;
      window.open(url, "_blank");
    }
  };

  const downloadOrWhatsappMonthlyInvoice = async (whatsapp, m, mob) => {
    dispatch(setLoader(true));
    const resp = await monthlyInvoice(user.token, {
      type: "p",
      m: m,
      wp: whatsapp ? 1 : 0,
      mo: mob,
    });
    dispatch(setLoader(false));
    if (whatsapp) {
      toggleMonthlyWPModal();
      Toast.fire({
        icon: resp.data.success == 1 ? "success" : "error",
        title: resp.data.msg || "Something went wrong",
      });
    } else {
      const url = resp.data.pdfurl;
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    if (show) {
      invoiceWithChecks();
    }
  }, [without, original]);

  const toggleWPModal = () => {
    setWPData({ ...wpData, show: !wpData.show });
  };

  const toggleMonthlyWPModal = () => {
    setMonthlyWPData({ ...monthlywpData, show: !monthlywpData.show });
  };

  return (
    <>
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
                        if (e.currentTarget.checked && original) {
                          setWithout(true);
                          setOriginal(false);
                        }
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
                        if (e.currentTarget.checked && without) {
                          setWithout(false);
                          setOriginal(true);
                        }
                      }}
                    />
                    <label className="ml-2" htmlFor="original">
                      Original
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
                    onClick={toggleWPModal}
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
                    {selMonth}-{getMonthName(selMonth)} Purchases
                  </h1>
                  <Button
                    className="btn-sm btn-outline-primary ml-2 mt-2 mb-2"
                    onClick={() => setSelMonth(0)}
                  >
                    All Purchases
                  </Button>
                </Row>
              </Col>
              <Col>
                <Row className="justify-content-end mr-0">
                  <Button
                    className="btn-md btn-outline-primary"
                    onClick={() => history.push("/admin/v1/purchase-invoice")}
                  >
                    Create Purchase Bill
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
                      data={monthPurchases}
                    />
                  </div>
                </Row>
              </>
            )}
          </>
        ) : (
          <>
            <Row sm="4" md="6" xs="1" className="mb-2">
              <Col>
                <Row className="ml-0"></Row>
                <CustomInputWoutFormik
                  type="select"
                  value={selParty.id ?? 0}
                  options={[
                    <option value={0}>All Parties</option>,
                    ...parties.map((opt) => {
                      return <option value={opt.pid}>{opt.b_name}</option>;
                    }),
                  ]}
                  withFormGroup={false}
                  onChange={(e) => {
                    setSelParty({
                      id: e.target.value,
                      name: parties.find((x) => x.pid == e.target.value).b_name,
                    });
                  }}
                />
              </Col>
            </Row>
            <Row sm="2" xs="1" className="mb-2">
              <Col>
                <Row className="ml-0">
                  <CustomDatePicker
                    onCallback={dateSelect}
                    text="Purchases By Date"
                  />
                  <Button
                    className="btn-md btn-outline-primary mb-1"
                    onClick={() => {
                      setFilterDate({ st: "", et: "" });
                      setSelParty({ id: null, name: "" });
                    }}
                  >
                    All Purchase
                  </Button>

                  <h1>
                    <span style={{ fontSize: "18px" }}>
                      {selParty.id != null && `${selParty.name} Purchases`}
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
                    onClick={() => history.push("/admin/v1/purchase-invoice")}
                  >
                    Create Purchase Bill
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
          </>
        )}
      </Container>
      <WhatsappModal
        show={wpData.show}
        handleToggle={toggleWPModal}
        mobile={wpData.mobile}
        withMsg={false}
        api={downloadOrWhatsappInvoice}
        params={[true]}
      />
      <WhatsappModal
        show={monthlywpData.show}
        handleToggle={toggleMonthlyWPModal}
        mobile={monthlywpData.mobile}
        withMsg={false}
        api={downloadOrWhatsappMonthlyInvoice}
        params={[true, monthlywpData.month]}
      />
    </>
  );
};

export default Purchase;
