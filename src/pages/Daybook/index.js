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
import { useState, useEffect, useRef } from "react";
import { daybookGet } from "api/api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import { pdfFromReact } from "generate-pdf-from-react-html";

const DayBook = () => {
  const [curDate, setCurDate] = useState(new Date());
  const inputRef = useRef(null);
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
    getDaybookData();
  }, [curDate]);

  return (
    <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <Row className="text-center mb-2">
        <Col
          sm="12"
          className="d-flex justify-content-center align-items-center"
        >
          <Button className="btn-md btn-outline-primary" onClick={todayClick}>
            Today
          </Button>
          <Button className="btn-md btn-outline-primary" onClick={prevClick}>
            Previous
          </Button>
          <Input
            type="date"
            className=" mr-2"
            style={{ width: "max-content" }}
            bsSize="sm"
            value={format(curDate, "yyyy-MM-dd")}
            onChange={(e) => setCurDate(e.target.valueAsDate)}
          />

          <Button className="btn-md btn-outline-primary" onClick={nextClick}>
            Next
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="shadow">
            <CardBody id="dayybookTable">
              <Table
                className="align-items-center table-flush daybookTable"
                responsive
                style={{ width: "100%" }}
                ref={inputRef}
              >
                <thead className="thead-dark">
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center bg-info borderright0"
                    >
                      <h2 className="text-white">
                        DayBook {format(curDate, "dd-MM-yyyy")}
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
            <Button
              className="btn-md btn-outline-primary"
              onClick={() => {
                dispatch(setLoader(true));
                setTimeout(() => {
                  pdfFromReact("#dayybookTable", "daybook", "p", true, false);
                }, 700);
                setTimeout(() => {
                  dispatch(setLoader(false));
                }, 2000);
              }}
              style={{ width: "fit-content" }}
              size="sm"
            >
              Download PDF
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DayBook;
