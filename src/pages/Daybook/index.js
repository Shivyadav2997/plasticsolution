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
import { useState, useEffect, useRef } from "react";
import { daybookGet } from "api/api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import CustomPDFDownloader from "components/Custom/CustomPDFDownloader";

const DayBook = () => {
  const [curDate, setCurDate] = useState(new Date());
  const inputRef = useRef(null);
  const [daybookData, setDaybookData] = useState({
    credit: [],
    debit: [],
    sale: [],
    puchase: [],
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
            <td>{array2.length > index ? array2[index]["amount"] : ""}</td>
            <td>{array2.length > index ? array2[index]["desc"] : ""}</td>
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
    getDaybookData();
  }, [curDate]);

  return (
    <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <Row className="text-center mb-2">
        <Col sm="12">
          <Button className="btn-md btn-outline-primary" onClick={todayClick}>
            Today
          </Button>
          <Button className="btn-md btn-outline-primary" onClick={prevClick}>
            Previous
          </Button>
          <Input
            type="date"
            className="d-inline mr-2"
            style={{ width: "max-content" }}
            bsSize="sm"
            // value={}
            value={format(curDate, "yyyy-MM-dd")}
            onChange={(e) => setCurDate(e.target.valueAsDate)}
          />
          <Button className="btn-md btn-outline-primary" onClick={nextClick}>
            Next
          </Button>
          <CustomPDFDownloader
            downloadFileName="CustomPdf"
            rootElementId="testId2"
            inputRef={inputRef}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="shadow">
            <CardBody>
              <Table
                className="align-items-center table-flush daybookTable"
                responsive
                style={{ width: "100%" }}
                ref={inputRef}
              >
                <thead className="thead-dark">
                  <tr>
                    <td colSpan="4" className="text-center bg-info">
                      <h2>
                        <strong>DayBook {format(curDate, "dd-MM-yyyy")}</strong>
                      </h2>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="font-weight-bolder text-center">
                      Credit (Recieve)
                    </td>
                    <td colSpan="2" className="font-weight-bolder text-center">
                      Debit (Payment)
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bolder text-center" width="25%">
                      Amount
                    </td>
                    <td className="font-weight-bolder text-center" width="25%">
                      Description
                    </td>
                    <td className="font-weight-bolder text-center" width="25%">
                      Amount
                    </td>
                    <td className="font-weight-bolder text-center" width="25%">
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
                    <td colSpan={4}></td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="font-weight-bolder text-center">
                      Purchase
                    </td>
                    <td colSpan="2" className="font-weight-bolder text-center">
                      Sale
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bolder text-center" width="25%">
                      Amount
                    </td>
                    <td className="font-weight-bolder text-center" width="25%">
                      Description
                    </td>
                    <td className="font-weight-bolder text-center" width="25%">
                      Amount
                    </td>
                    <td className="font-weight-bolder text-center" width="25%">
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
                    <td colSpan={4}></td>
                  </tr>
                  <tr>
                    <td
                      colSpan="2"
                      className="font-weight-bolder text-center borderright0"
                    >
                      Expenses
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td className="font-weight-bolder text-center" width="25%">
                      Amount
                    </td>
                    <td
                      className="font-weight-bolder text-center  borderright0"
                      width="25%"
                    >
                      Description
                    </td>
                    <td colSpan={2}></td>
                  </tr>
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
