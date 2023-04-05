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
import { useState } from "react";

const DayBook = () => {
  const [curDate, setCurDate] = useState(new Date());

  const nextClick = () => {
    setCurDate(add(curDate, { days: 1 }));
  };

  const prevClick = () => {
    setCurDate(sub(curDate, { days: 1 }));
  };

  const todayClick = () => {
    setCurDate(new Date());
  };
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
                    <td colSpan="2" className="font-weight-bold text-center">
                      Credit (Recieve)
                    </td>
                    <td colSpan="2" className="font-weight-bold text-center">
                      Debit (Payment)
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">Amount</td>
                    <td className="text-center">Description</td>
                    <td className="text-center">Amount</td>
                    <td className="text-center">Description</td>
                  </tr>
                  {/* dynamic */}
                  <tr>
                    <td colSpan={4}></td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="font-weight-bold text-center">
                      Purchase
                    </td>
                    <td colSpan="2" className="font-weight-bold text-center">
                      Sale
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">Amount</td>
                    <td className="text-center">Description</td>
                    <td className="text-center">Amount</td>
                    <td className="text-center">Description</td>
                  </tr>
                  {/* dynamic */}
                  <tr>
                    <td colSpan={4}></td>
                  </tr>
                  <tr>
                    <td
                      colSpan="2"
                      className="font-weight-bold text-center borderright0"
                    >
                      Expenses
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td className="text-center">Amount</td>
                    <td className="text-center  borderright0">Description</td>
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
