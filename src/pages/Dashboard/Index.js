import { useEffect, useState } from "react";
import { NavLink as NavLinkRRD, Link, useHistory } from "react-router-dom";
import {
  ListGroup,
  ListGroupItem,
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  CardTitle,
  Collapse,
} from "reactstrap";
import {
  FaWhatsapp,
  FaDatabase,
  FaWallet,
  FaShoppingCart,
  FaDownload,
  FaMoneyBill,
} from "react-icons/fa";
import { TbPackageExport, TbPackageImport } from "react-icons/tb";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { BiRupee } from "react-icons/bi";
import { dashboardDataGet, dashboardSendReport } from "api/api";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import { format } from "date-fns";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";
const Index = (props) => {
  let history = useHistory();

  const dispatch = useDispatch();
  const { user, fyear } = useSelector((store) => store.user);

  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });
  const [dashboardData, setDashboardData] = useState({
    totalsale: {
      WithtAmt: "0.00",
      billAmt: "0.00",
      gst: "0.00",
      total: "0.00",
    },
    totalpurchase: {
      WithtAmt: "0.00",
      billAmt: "0.00",
      gst: "0.00",
      total: "0.00",
    },
    balance: {
      cash: "0.00",
      bank: "0.00",
    },
    current_sale: {
      title: "",
      WithtAmt: "0.00",
      billAmt: "0.00",
      gst: "0.00",
      total: "0.00",
    },
    current_purchase: {
      title: "",
      WithtAmt: "0.00",
      billAmt: "0.00",
      gst: "0.00",
      total: "0.00",
    },
    expenses: {
      daily: "0.00",
      monthly: "0.00",
      yearly: "0.00",
    },
    debit: {
      WithtAmt: "0.00",
      billAmt: "0.00",
      total: "0.00",
    },
    credit: {
      WithtAmt: "0.00",
      billAmt: "0.00",
      total: "0.00",
    },
    closing: {
      WithtAmt: "0.00",
      billAmt: "0.00",
      total: "0.00",
    },
    sale_list: [],
    purchase_list: [],
  });

  const sendReport = async (type, d = 0, dt = null) => {
    dispatch(setLoader(true));
    const resp = await dashboardSendReport(user.token, type, d, dt);
    dispatch(setLoader(false));
    if (d == 0) {
      if (resp.data.success == 1) {
        Toast.fire({
          icon: "success",
          title: resp.data.msg,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: resp.data.msg || "Something went wrong",
        });
      }
    } else if (resp.data.pdfurl) {
      const url = resp.data.pdfurl;
      let alink = document.createElement("a");
      alink.href = url;
      alink.target = "_blank";
      alink.download = url.substring(url.lastIndexOf("/") + 1);
      alink.click();
    }
  };

  const getDashboardData = async () => {
    const data = await dashboardDataGet(user.token);
    setDashboardData(data.data);
  };

  useEffect(() => {
    getDashboardData();
  }, [fyear]);
  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <Row mb={2}>
          <Col sm={12}>
            <ListGroup horizontal className="float-sm-right">
              <ListGroupItem
                className="border-0 pb-0"
                style={{ background: "none" }}
              >
                <Button className="btn-md text-success mb-1 ml-0">
                  Daily Report
                  <br />
                  <Button
                    className="btn-sm btn-outline-success mb-1 ml-0"
                    onClick={() =>
                      sendReport(6, 0, format(new Date(), "yyyy-MM-dd"))
                    }
                  >
                    <FaWhatsapp size={18} color="primary" />
                  </Button>
                  <Button
                    className="btn-sm btn-outline-primary mb-1 ml-0"
                    onClick={() =>
                      sendReport(6, 1, format(new Date(), "yyyy-MM-dd"))
                    }
                  >
                    <FaDownload size={18} color="primary" />
                  </Button>
                </Button>
                <Button className="btn-md text-primary mb-1 ml-0">
                  Get Stock
                  <br />
                  <Button
                    className="btn-sm btn-outline-success mb-1 ml-0"
                    onClick={() => sendReport(2)}
                  >
                    <FaWhatsapp size={18} color="primary" />
                  </Button>
                  <Button
                    className="btn-sm btn-outline-primary mb-1 ml-0"
                    onClick={() => sendReport(2, 1)}
                  >
                    <FaDownload size={18} color="primary" />
                  </Button>
                </Button>
                <Button className="btn-md text-danger mb-1 ml-0">
                  Debit Ledger
                  <br />
                  <Button
                    className="btn-sm btn-outline-success mb-1 ml-0"
                    onClick={() => sendReport(3)}
                  >
                    <FaWhatsapp size={18} color="primary" />
                  </Button>
                  <Button
                    className="btn-sm btn-outline-primary mb-1 ml-0"
                    onClick={() => sendReport(3, 1)}
                  >
                    <FaDownload size={18} color="primary" />
                  </Button>
                </Button>
                <Button className="btn-md  text-success  mb-1 ml-0">
                  Credit Ledger
                  <br />
                  <Button
                    className="btn-sm btn-outline-success mb-1 ml-0"
                    onClick={() => sendReport(4)}
                  >
                    <FaWhatsapp size={18} color="primary" />
                  </Button>
                  <Button
                    className="btn-sm btn-outline-primary mb-1 ml-0"
                    onClick={() => sendReport(4, 1)}
                  >
                    <FaDownload size={18} color="primary" />
                  </Button>
                </Button>
                <Button className="btn-md text-primary mb-1 ml-0">
                  Full Ledger
                  <br />
                  <Button
                    className="btn-sm btn-outline-success mb-1 ml-0"
                    onClick={() => sendReport(5)}
                  >
                    <FaWhatsapp size={18} color="primary" />
                  </Button>
                  <Button
                    className="btn-sm btn-outline-primary mb-1 ml-0"
                    onClick={() => sendReport(5, 1)}
                  >
                    <FaDownload size={18} color="primary" />
                  </Button>
                </Button>
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col sm={12}>
            <ListGroup horizontal className="float-sm-right">
              <ListGroupItem
                className="border-0"
                style={{ background: "none" }}
              >
                <Button
                  className="btn-md btn-outline-primary mb-1 ml-0"
                  onClick={() => history.push("/admin/v1/sales-invoice")}
                >
                  <FaShoppingCart size={18} color="primary" /> Sale Invoice
                </Button>
                <Button
                  className="btn-md btn-outline-info mb-1 ml-0"
                  onClick={() => history.push("/admin/v1/purchase-invoice")}
                >
                  <FaShoppingCart size={18} color="info" /> Purchase Invoice
                </Button>
                <Button
                  className="btn-md btn-outline-default mb-1 ml-0"
                  onClick={() => {
                    sessionStorage.setItem("openAdd", true);
                    history.push("/admin/v1/expenses");
                  }}
                >
                  <FaMoneyBill size={18} color="default" /> Expense
                </Button>
                <Button
                  className="btn-md btn-outline-success mb-1 ml-0"
                  onClick={() => {
                    sessionStorage.setItem("openAdd", 1);
                    history.push("/admin/v1/transaction");
                  }}
                >
                  <BsArrowDownLeft size={18} color="success" />
                  Receive
                </Button>
                <Button
                  className="btn-md btn-outline-danger mb-1 ml-0"
                  onClick={() => {
                    sessionStorage.setItem("openAdd", 2);
                    history.push("/admin/v1/transaction");
                  }}
                >
                  <BsArrowUpRight size={18} />
                  Payment
                </Button>
                <Button
                  className="btn-md btn-outline-success mb-1 ml-0"
                  onClick={() => history.push("/admin/v1/day-book")}
                >
                  <FaWallet size={18} color="success" /> DayBook
                </Button>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={4}>
            <Card className="mb-4">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      {dashboardData?.current_sale?.title} Sale
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">
                      ₹ {dashboardData?.current_sale?.total}
                    </span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                      <TbPackageExport />
                    </div>
                  </Col>
                </Row>
                <Table
                  className="align-items-center table-flush "
                  responsive
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td>WithtAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.current_sale?.WithtAmt}
                      </td>
                    </tr>
                    <tr>
                      <td>BillAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.current_sale?.billAmt}
                      </td>
                    </tr>
                    <tr>
                      <td>GST</td>
                      <td className="text-right">
                        ₹ {dashboardData?.current_sale?.gst}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card className="mb-4">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      {dashboardData?.current_purchase?.title} Purchase
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">
                      ₹ {dashboardData?.current_purchase?.total}
                    </span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                      <TbPackageImport />
                    </div>
                  </Col>
                </Row>
                <Table
                  className="align-items-center table-flush "
                  responsive
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td>WithtAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.current_purchase?.WithtAmt}
                      </td>
                    </tr>
                    <tr>
                      <td>BillAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.current_purchase?.billAmt}
                      </td>
                    </tr>
                    <tr>
                      <td>GST</td>
                      <td className="text-right">
                        ₹ {dashboardData?.current_purchase?.gst}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card className="mb-4">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      Expenses
                    </CardTitle>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                      <i className="ni ni-money-coins" />
                    </div>
                  </Col>
                </Row>
                <Table
                  className="align-items-center table-flush "
                  responsive
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td>Daily</td>
                      <td className="text-right">
                        ₹ {dashboardData?.expenses?.daily}
                      </td>
                    </tr>
                    <tr>
                      <td>Monthly</td>
                      <td className="text-right">
                        ₹ {dashboardData?.expenses?.monthly}
                      </td>
                    </tr>
                    <tr>
                      <td>Yearly</td>
                      <td className="text-right">
                        ₹ {dashboardData?.expenses?.yearly}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <Card className="mb-4">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      Total Sale
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">
                      ₹ {dashboardData?.totalsale?.total}
                    </span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                      <TbPackageExport />
                    </div>
                  </Col>
                </Row>
                <Table
                  className="align-items-center table-flush "
                  responsive
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td>WithtAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.totalsale?.WithtAmt}
                      </td>
                    </tr>
                    <tr>
                      <td>BillAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.totalsale?.billAmt}
                      </td>
                    </tr>
                    <tr>
                      <td>GST</td>
                      <td className="text-right">
                        ₹ {dashboardData?.totalsale?.gst}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card className="mb-4">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      Total Purchase
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">
                      ₹ {dashboardData?.totalpurchase?.total}
                    </span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                      <TbPackageImport />
                    </div>
                  </Col>
                </Row>
                <Table
                  className="align-items-center table-flush "
                  responsive
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td>WithtAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.totalpurchase?.WithtAmt}
                      </td>
                    </tr>
                    <tr>
                      <td>BillAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.totalpurchase?.billAmt}
                      </td>
                    </tr>
                    <tr>
                      <td>GST</td>
                      <td className="text-right">
                        ₹ {dashboardData?.totalpurchase?.gst}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card className="mb-4">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      Balance
                    </CardTitle>
                    {/* <span className="h2 font-weight-bold mb-0">
                      ₹ {dashboardData?.closing?.total}
                    </span> */}
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                      <BiRupee width="12px" />
                    </div>
                  </Col>
                </Row>
                <Table
                  className="align-items-center table-flush "
                  responsive
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td>Cash</td>
                      <td className="text-right">
                        ₹ {dashboardData?.balance?.cash}
                      </td>
                    </tr>
                    <tr>
                      <td>Bank</td>
                      <td className="text-right">
                        ₹ {dashboardData?.balance?.bank}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <Card className="mb-4">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      Total Debit
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">
                      ₹ {dashboardData?.debit?.total}
                    </span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-red text-white rounded-circle shadow">
                      <AiOutlineMinus style={{ width: "12px !important" }} />
                    </div>
                  </Col>
                </Row>
                <Table
                  className="align-items-center table-flush "
                  responsive
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td>WithouAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.debit?.WithtAmt}
                      </td>
                    </tr>
                    <tr>
                      <td>BillAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.debit?.billAmt}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card className="mb-4">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      Total Credit
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">
                      ₹ {dashboardData?.credit?.total}
                    </span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-green text-white rounded-circle shadow">
                      <AiOutlinePlus width="12px" />
                    </div>
                  </Col>
                </Row>
                <Table
                  className="align-items-center table-flush "
                  responsive
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td>WithouAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.credit?.WithtAmt}
                      </td>
                    </tr>
                    <tr>
                      <td>BillAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.credit?.billAmt}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card className="mb-4">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      Closing Balance
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">
                      ₹ {dashboardData?.closing?.total}
                    </span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                      <BiRupee width="12px" />
                    </div>
                  </Col>
                </Row>
                <Table
                  className="align-items-center table-flush "
                  responsive
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td>WithouAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.closing?.WithtAmt}
                      </td>
                    </tr>
                    <tr>
                      <td>BillAmt</td>
                      <td className="text-right">
                        ₹ {dashboardData?.closing?.billAmt}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card className="shadow" style={{ borderTop: "3px solid #007bff" }}>
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Sale Bill</h3>
                  </div>
                  <div className="col text-right">
                    {/* {saleListOpen ? (
                      <AiOutlineMinus
                        size="25px"
                        onClick={() => setSaleListOpen(false)}
                      />
                    ) : (
                      <AiOutlinePlus
                        size="25px"
                        onClick={() => setSaleListOpen(true)}
                      />
                    )} */}
                    <Button
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push("/admin/v1/sales");
                      }}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              {/* <Collapse isOpen={saleListOpen}> */}
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Party</th>
                    <th scope="col">WithouAmt</th>
                    <th scope="col">BillAmt</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.sale_list?.map((sale, index) => {
                    return (
                      <tr key={index}>
                        <td>{sale.party}</td>
                        <td>{sale.withoutamt}</td>
                        <td>{sale.billamt}</td>
                        <td>
                          {sale.total}
                          <div>
                            <strong>{sale.date}</strong>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {/* </Collapse> */}
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow" style={{ borderTop: "3px solid #007bff" }}>
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Purchase Bill</h3>
                  </div>
                  <div className="col text-right">
                    {/* {purchaseListOpen ? (
                      <AiOutlineMinus
                        size="25px"
                        onClick={() => setPurchaseListOpen(false)}
                      />
                    ) : (
                      <AiOutlinePlus
                        size="25px"
                        onClick={() => setPurchaseListOpen(true)}
                      />
                    )} */}
                    <Button
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push("/admin/v1/purchase");
                      }}
                      size="sm"
                    >
                      {/* <Link to="/admin/purchase" className="text-white"> */}
                      See all
                      {/* </Link> */}
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              {/* <Collapse isOpen={purchaseListOpen}> */}
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Party</th>
                    <th scope="col">WithouAmt</th>
                    <th scope="col">BillAmt</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.purchase_list?.map((purchase, index) => {
                    return (
                      <tr key={index}>
                        <td>{purchase.party}</td>
                        <td>{purchase.withoutamt}</td>
                        <td>{purchase.billamt}</td>
                        <td>
                          {purchase.total}
                          <div>
                            <strong>{purchase.date}</strong>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {/* </Collapse> */}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
