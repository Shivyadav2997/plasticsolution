import { useEffect, useState } from "react";
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
} from "react-icons/fa";
import { TbPackageExport, TbPackageImport } from "react-icons/tb";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { BiRupee } from "react-icons/bi";
import { dashboardDataGet } from "api/api";
import { useSelector } from "react-redux";
import Loader from "components/Custom/Loader";

const Index = (props) => {
  const [dashboardData, setDashboardData] = useState({
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
  const [saleListOpen, setSaleListOpen] = useState(true);
  const [purchaseListOpen, setPurchaseListOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const getDashboardData = async () => {
    setLoading(true);
    const data = await dashboardDataGet(user.token);
    setDashboardData(data.data);
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);
  const { user } = useSelector((store) => store.user);
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
                <Button className="btn-md btn-outline-success">
                  <FaWhatsapp size={18} color="success" /> Daily Report
                </Button>
                <Button className="btn-md btn-outline-primary">
                  <FaDatabase size={18} color="primary" /> Get Stock
                </Button>
                <Button className="btn-md btn-outline-danger">
                  <FaWallet size={18} color="danger" /> Debit Ledger
                </Button>
                <Button className="btn-md btn-outline-success">
                  <FaWallet size={18} color="success" /> Credit Ledger
                </Button>
                <Button className="btn-md btn-outline-info">
                  <FaWallet size={18} color="info" /> Full Ledger
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
                <Button className="btn-md btn-outline-primary">
                  <FaShoppingCart size={18} color="primary" /> Sale
                </Button>
                <Button className="btn-md btn-outline-info">
                  <FaShoppingCart size={18} color="info" /> Purchase
                </Button>
                <Button className="btn-md btn-outline-success">
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
                    {saleListOpen ? (
                      <AiOutlineMinus
                        size="25px"
                        onClick={() => setSaleListOpen(false)}
                      />
                    ) : (
                      <AiOutlinePlus
                        size="25px"
                        onClick={() => setSaleListOpen(true)}
                      />
                    )}
                  </div>
                </Row>
              </CardHeader>
              <Collapse isOpen={saleListOpen}>
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
                    {dashboardData?.sale_list?.map((sale) => {
                      return (
                        <tr>
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
              </Collapse>
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
                    {purchaseListOpen ? (
                      <AiOutlineMinus
                        size="25px"
                        onClick={() => setPurchaseListOpen(false)}
                      />
                    ) : (
                      <AiOutlinePlus
                        size="25px"
                        onClick={() => setPurchaseListOpen(true)}
                      />
                    )}
                  </div>
                </Row>
              </CardHeader>
              <Collapse isOpen={purchaseListOpen}>
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
                    {dashboardData?.purchase_list?.map((purchase) => {
                      return (
                        <tr>
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
              </Collapse>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
