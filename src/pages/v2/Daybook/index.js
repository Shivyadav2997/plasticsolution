import {
  Container,
  Row,
  Col,
  Button,
  Input,
  Table,
  CardBody,
  Card,
} from "reactstrap";
import { format, parse, add, sub } from "date-fns";
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";
import { useState, useEffect } from "react";
import { daybookGet, daybookDownload } from "api/apiv2";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import { isDate } from "moment";
import { FaEye, FaWhatsapp } from "react-icons/fa";
import Swal from "sweetalert2";
const DayBook = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });
  const [curDate, setCurDate] = useState(new Date());
  const [curDateString, setCurDateString] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [daybookData, setDaybookData] = useState({
    credit: [],
    debit: [],
    sale: [],
    puchase: [],
    expenses: [],
  });
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const nextClick = () => {
    setCurDate(add(curDate, { days: 1 }));
  };

  const prevClick = () => {
    setCurDate(sub(curDate, { days: 1 }));
  };

  const todayClick = () => {
    setCurDate(new Date());
  };

  const whatsappDownloadClick = async (whatsapp) => {
    dispatch(setLoader(true));
    const resp = await daybookDownload(user.token, {
      type: 6,
      d: whatsapp ? 0 : 1,
      dt: format(curDate, "yyyy-MM-dd"),
    });
    dispatch(setLoader(false));
    if (whatsapp) {
      Toast.fire({
        icon: resp.data.success == 1 ? "success" : "error",
        title: resp.data.msg || "Something went wrong",
      });
    } else {
      const url = resp.data.pdfurl;
      window.open(url, "_blank");
    }
  };

  const getRowsFromArray = (array1, array2) => {
    var returnRows = [];
    if (array1 && array2) {
      const arrayLength =
        array1.length > array2.length ? array1.length : array2.length;
      for (let index = 0; index < arrayLength; index++) {
        returnRows = [
          ...returnRows,
          <tr className="text-center">
            <td>{array1.length > index ? array1[index]["amount"] : ""}</td>
            <td>{array1.length > index ? array1[index]["desc"] : ""}</td>
            <td className="bl-2">
              {array2.length > index ? array2[index]["amount"] : ""}
            </td>
            <td className="borderright0">
              {array2.length > index ? array2[index]["desc"] : ""}
            </td>
          </tr>,
        ];
      }
    }
    return returnRows;
  };
  const getDaybookData = async () => {
    dispatch(setLoader(true));
    const data = await daybookGet(user.token, {
      d: format(curDate, "yyyy-MM-dd"),
    });
    dispatch(setLoader(false));
    setDaybookData(data.data);
  };

  useEffect(() => {
    if (curDate != null) {
      setCurDateString(format(curDate, "yyyy-MM-dd"));
      getDaybookData();
    } else {
      setDaybookData({
        credit: [],
        debit: [],
        sale: [],
        puchase: [],
        expenses: [],
      });
    }
  }, [curDate]);

  return (
    <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <Row className="text-center mb-2 justify-content-center align-items-center d-none d-sm-flex">
        <Button
          className="btn-md btn-outline-primary mb-1"
          onClick={todayClick}
        >
          Today
        </Button>
        <Button className="btn-md btn-outline-primary mb-1" onClick={prevClick}>
          Previous
        </Button>
        <Input
          type="date"
          className="mr-2  mb-1"
          style={{ width: "max-content" }}
          value={curDateString}
          onChange={(e) => {
            setCurDateString(e.target.value);
            if (e.target.value) {
              setCurDate(e.target.valueAsDate);
            } else {
              setCurDate(null);
            }
          }}
        />
        <Button
          className=" btn-md btn-outline-primary  mb-1"
          onClick={nextClick}
        >
          Next
        </Button>
        <Button
          className=" btn-md btn-outline-success "
          onClick={() => whatsappDownloadClick(true)}
        >
          <FaWhatsapp size={18} color="success" /> Whatsapp
        </Button>
        <Button
          className=" btn-md btn-outline-primary"
          onClick={() => whatsappDownloadClick(false)}
        >
          <FaEye size="18" color="primary" /> View
        </Button>
      </Row>
      <Row className="text-center mb-2 justify-content-between align-items-center d-flex d-sm-none">
        <Col xs={4}>
          <Button className="btn-sm btn-outline-primary" onClick={todayClick}>
            Today
          </Button>
        </Col>
        <Col xs={4}>
          <Button className="btn-sm btn-outline-primary" onClick={prevClick}>
            Previous
          </Button>
        </Col>
        <Col xs={4}>
          <Button className="btn-sm btn-outline-primary" onClick={nextClick}>
            Next
          </Button>
        </Col>
        <Col xs={12} className="mt-2">
          <div>
            <Button className="btn-sm btn-outline-success" onClick={nextClick}>
              Whatsapp
            </Button>
            <Button className="btn-sm btn-outline-primary" onClick={nextClick}>
              View
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="text-center mb-2 justify-content-center align-items-center d-flex d-sm-none">
        <Input
          type="date"
          className="mr-2"
          style={{ width: "max-content" }}
          bsSize="sm"
          value={curDateString}
          onChange={(e) => {
            setCurDateString(e.target.value);
            if (e.target.value) {
              setCurDate(e.target.valueAsDate);
            } else {
              setCurDate(null);
            }
          }}
        />
      </Row>
      <Row>
        <Col>
          <Card className="shadow daybookCard">
            <CardBody>
              <Table
                className="align-items-center table-flush daybookTable"
                responsive
                style={{ width: "100%" }}
              >
                <thead className="thead-dark">
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center bg-info borderright0"
                    >
                      <h2 className="text-white">
                        DayBook{" "}
                        {curDate == null ? "" : format(curDate, "dd-MM-yyyy")}
                      </h2>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="font-weight-bolder text-center">
                      Credit (Recieve)
                    </td>
                    <td
                      colSpan="2"
                      className="font-weight-bolder text-center borderright0 bl-2"
                    >
                      Debit (Payment)
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center" width="12.5%">
                      Amount
                    </td>
                    <td className=" text-center" width="37.5%">
                      Description
                    </td>
                    <td className="text-center bl-2" width="12.5%">
                      Amount
                    </td>
                    <td className="text-center borderright0" width="37.5%">
                      Description
                    </td>
                  </tr>
                  {/* dynamic */}
                  {getRowsFromArray(daybookData.credit, daybookData.debit).map(
                    (val) => {
                      return val;
                    }
                  )}
                  {/* {getRowsFromArray(daybookData.credit, daybookData.debit).length} */}
                  <tr>
                    <td colSpan={4} className="borderright0"></td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="font-weight-bolder text-center">
                      Purchase
                    </td>
                    <td
                      colSpan="2"
                      className="font-weight-bolder text-center borderright0 bl-2"
                    >
                      Sale
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center" width="12.5%">
                      Amount
                    </td>
                    <td className="text-center " width="37.5%">
                      Description
                    </td>
                    <td className="text-center bl-2" width="12.5%">
                      Amount
                    </td>
                    <td className="text-center borderright0" width="37.5%">
                      Description
                    </td>
                  </tr>
                  {getRowsFromArray(daybookData.purchase, daybookData.sale).map(
                    (val) => {
                      return val;
                    }
                  )}
                  {/* {getRowsFromArray(daybookData.purchase, daybookData.sale).length} */}
                  <tr>
                    <td colSpan={4} className="borderright0"></td>
                  </tr>
                  <tr>
                    <td
                      colSpan="2"
                      className="font-weight-bolder text-center borderright0"
                    >
                      Expenses
                    </td>
                    <td colSpan={2} className="borderright0"></td>
                  </tr>
                  <tr>
                    <td className="text-center" width="12.5%">
                      Amount
                    </td>
                    <td className="text-center  borderright0" width="37.5%">
                      Description
                    </td>
                    <td colSpan={2} className="borderright0"></td>
                  </tr>
                  {daybookData.expenses.map((exp) => {
                    return (
                      <tr className="text-center">
                        <td>{exp.amount}</td>
                        <td className="borderright0"> {exp.desc}</td>
                        <td colSpan={2} className="borderright0"></td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DayBook;
