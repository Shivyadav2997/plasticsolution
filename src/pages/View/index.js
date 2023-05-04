import { Container, Row, Col, Button, Input, Table } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import CustomTab from "components/Custom/CustomTab";
const ViewTest = () => {
  const tabPan = [
    <>
      <Row>
        <Col xs="12">
          <div className=" p-3 mb-3">
            <div className="invoice">
              <Col xs="12" responsive>
                <Table
                  style={{ width: "100%" }}
                  className="ledger-table"
                  responsive={true}
                >
                  <tbody>
                    <tr>
                      <td colSpan={4} style={{ width: "50%" }}>
                        <b>Credit</b>
                      </td>
                      <td colSpan={4} style={{ width: "50%" }}>
                        <b>Debit</b>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>WithtAmt</b>
                      </td>
                      <td>
                        <b>BillAmt</b>
                      </td>
                      <td>
                        <b>Total</b>
                      </td>
                      <td>
                        <b>Description</b>
                      </td>
                      <td style={{ borderLeft: "1px dotted" }}>
                        <b>WithtAmt</b>
                      </td>
                      <td>
                        <b>BillAmt</b>
                      </td>
                      <td>
                        <b>Total</b>
                      </td>
                      <td>
                        <b>Description</b>
                      </td>
                    </tr>
                    <tr>
                      <td>5000</td>
                      <td></td>
                      <td>5000</td>
                      <td>
                        <br />
                        17/01/2023
                      </td>
                      <td style={{ borderLeft: "1px dotted" }}></td>
                      <td>8142</td>
                      <td>8142</td>
                      <td>
                        <br />
                        17/01/2023
                      </td>
                    </tr>
                    <tr>
                      <td>13500.00</td>
                      <td>10620</td>
                      <td>24120</td>
                      <td>
                        Purchase Bill No.10 Tax &nbsp;1620.00
                        <br />
                        PRODUCT 1-900&nbsp;&nbsp;17-01-23
                      </td>

                      <td style={{ borderLeft: "1px dotted" }}>8000.00</td>
                      <td>2360</td>
                      <td>10360</td>
                      <td>
                        Sale Bill No.10 Tax &nbsp;360.00
                        <br />
                        PRODUCT 1-200&nbsp;&nbsp;17-01-23
                      </td>
                    </tr>
                    <tr>
                      <th>27,550</th>
                      <th>16,045</th>
                      <th>43,595</th>
                      <th></th>
                      <th style={{ borderLeft: "1px dotted" }}>43,950</th>
                      <th>101,780</th>
                      <th>145,730</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th colspan="1">WithoutAmt</th>
                      <th colspan="1">BillAmt</th>
                      <th colspan="1">Total</th>
                    </tr>
                    <tr>
                      <th colspan="1">₹ 16,400&nbsp;Dr</th>
                      <th colspan="1">₹ 85,735&nbsp;Dr</th>
                      <th colspan="1">₹ 102,135&nbsp;Dr </th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        Cls. Balance &nbsp;&nbsp;
                        <Button class="btn btn-default">
                          <b>₹ 102,135.00&nbsp;Dr </b>
                        </Button>
                      </th>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </div>
          </div>
        </Col>
      </Row>
      <Row sm="2" className="mb-2">
        <Col>
          <Button className="btn-md btn-outline-primary">Print</Button>
        </Col>
        <Col className="justify-content-end mr-0">
          <Button className="btn-md btn-outline-success">Pdf</Button>
        </Col>
      </Row>
    </>,
    <>
      <Row>
        <Col xs="12">
          <div className=" p-3 mb-3">
            <Col xs="12" responsive>
              <Table className="ledger-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <td>
                      <b>Date</b>
                    </td>
                    <td>
                      <b>Description</b>
                    </td>
                    <td colspan="2" align="center">
                      <b>Debit</b>
                    </td>
                    <td colspan="2" align="center">
                      <b>Credit</b>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <b>WithtAmt</b>
                    </td>
                    <td>
                      <b>BillAmt</b>
                    </td>
                    <td>
                      <b>WithtAmt</b>
                    </td>
                    <td>
                      <b>BillAmt</b>
                    </td>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>17-01-23</td>
                    <td>
                      <br />
                    </td>
                    <td></td>
                    <td></td>
                    <td>5000</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>17-01-23</td>
                    <td>
                      Purchase Bill No.10 Tax &nbsp;1620.00
                      <br />
                      PRODUCT 1-900&nbsp;&nbsp;
                    </td>
                    <td></td>
                    <td></td>
                    <td>13500.00</td>
                    <td>10620</td>
                  </tr>
                  <tr>
                    <td>17-01-23</td>
                    <td>
                      <br />
                    </td>
                    <td></td>
                    <td>8142</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>17-01-23</td>
                    <td>
                      Sale Bill No.10 Tax &nbsp;360.00
                      <br />
                      PRODUCT 1-200&nbsp;&nbsp;
                    </td>
                    <td>8000.00</td>
                    <td>2360</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>17-01-23</td>
                    <td>
                      Sale Bill No.50 Tax &nbsp;18.00
                      <br />
                      PRODUCT 1-10&nbsp;&nbsp;
                    </td>
                    <td>350.00</td>
                    <td>118</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>19-01-23</td>
                    <td>
                      <br />
                    </td>
                    <td>3500</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>19-01-23</td>
                    <td>
                      Sale Bill No.10 Tax &nbsp;360.00
                      <br />
                      PRODUCT 1-200&nbsp;&nbsp;
                    </td>
                    <td>8000.00</td>
                    <td>2360</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>21-01-23</td>
                    <td>
                      <br />
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>360</td>
                  </tr>
                  <tr>
                    <td>21-01-23</td>
                    <td>
                      Sale Bill No.10 Tax &nbsp;1800.00
                      <br />
                      PRODUCT 1-1000&nbsp;&nbsp;
                    </td>
                    <td>20000.00</td>
                    <td>11800</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>21-01-23</td>
                    <td>
                      <br />
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>3800</td>
                  </tr>
                  <tr>
                    <td>30-01-23</td>
                    <td>
                      Purchase Bill No.10 Tax &nbsp;100
                      <br />
                      PRODUCT 1-1000&nbsp;&nbsp;
                    </td>
                    <td></td>
                    <td></td>
                    <td>9000.00</td>
                    <td>1100</td>
                  </tr>
                  <tr>
                    <td>30-01-23</td>
                    <td>
                      Sale Bill No.50 Tax &nbsp;1000
                      <br />
                      PRODUCT 1-1000&nbsp;&nbsp;
                    </td>
                    <td>4000.00</td>
                    <td>11000</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>28-03-23</td>
                    <td>
                      Sale Bill No.1 Tax &nbsp;6000
                      <br />
                      PRODUCT 1-1200&nbsp;&nbsp;
                    </td>
                    <td>0.00</td>
                    <td>66000</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>29-03-23</td>
                    <td>
                      Sale Bill No.B0001 Tax &nbsp;
                      <br />
                    </td>
                    <td></td>
                    <td>0</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>08-04-23</td>
                    <td>
                      <br />
                    </td>
                    <td>100</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>08-04-23</td>
                    <td>
                      Purchase Bill No.B001 Tax &nbsp;15
                      <br />
                      PRODUCT 1-10&nbsp;&nbsp;PRODUCT 1-10&nbsp;&nbsp;
                    </td>
                    <td></td>
                    <td></td>
                    <td>50.00</td>
                    <td>165</td>
                  </tr>
                  <tr>
                    <th></th>
                    <td align="right">
                      <b>Total</b>
                    </td>
                    <th>43,950</th>
                    <th>101,780</th>
                    <th>27,550</th>
                    <th>16,045</th>
                    <th></th>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </div>
        </Col>
      </Row>
    </>,
    <>
      <Row>
        <Col xs="12">
          <div className=" p-3 mb-3">
            <div className="invoice">
              <Col xs="12" responsive>
                <Table style={{ width: "100%" }} className="ledger-table">
                  <tbody>
                    <tr>
                      <td colSpan={2} style={{ width: "50%" }}>
                        <b>Credit</b>
                      </td>
                      <td colSpan={2} style={{ width: "50%" }}>
                        <b>Debit</b>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ width: "10%" }}> 5000</td>
                      <td style={{ width: "40%" }}>
                        <br />
                        17-01-23
                      </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        8000.00
                      </td>
                      <td style={{ width: "40%" }}>
                        Sale Bill No.10 Tax &nbsp;360.00
                        <br />
                        PRODUCT 1-200&nbsp;&nbsp;17-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> 13500.00</td>
                      <td style={{ width: "40%" }}>
                        Purchase Bill No.10 Tax &nbsp;1620.00
                        <br />
                        PRODUCT 1-900&nbsp;&nbsp;17-01-23
                      </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        350.00
                      </td>
                      <td style={{ width: "40%" }}>
                        Sale Bill No.50 Tax &nbsp;18.00
                        <br />
                        PRODUCT 1-10&nbsp;&nbsp;17-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> 9000.00</td>
                      <td style={{ width: "40%" }}>
                        Purchase Bill No.10 Tax &nbsp;100
                        <br />
                        PRODUCT 1-1000&nbsp;&nbsp;30-01-23
                      </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        3500
                      </td>
                      <td style={{ width: "40%" }}>
                        <br />
                        19-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> 50.00</td>
                      <td style={{ width: "40%" }}>
                        Purchase Bill No.B001 Tax &nbsp;15
                        <br />
                        PRODUCT 1-10&nbsp;&nbsp;PRODUCT 1-10&nbsp;&nbsp;08-04-23
                      </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        8000.00
                      </td>
                      <td style={{ width: "40%" }}>
                        Sale Bill No.10 Tax &nbsp;360.00
                        <br />
                        PRODUCT 1-200&nbsp;&nbsp;19-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> </td>
                      <td style={{ width: "40%" }}> </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        20000.00
                      </td>
                      <td style={{ width: "40%" }}>
                        Sale Bill No.10 Tax &nbsp;1800.00
                        <br />
                        PRODUCT 1-1000&nbsp;&nbsp;21-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> </td>
                      <td style={{ width: "40%" }}> </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        4000.00
                      </td>
                      <td style={{ width: "40%" }}>
                        Sale Bill No.50 Tax &nbsp;1000
                        <br />
                        PRODUCT 1-1000&nbsp;&nbsp;30-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> </td>
                      <td style={{ width: "40%" }}> </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        100
                      </td>
                      <td style={{ width: "40%" }}>
                        <br />
                        08-04-23
                      </td>
                    </tr>
                    <tr>
                      <th>27,550</th>

                      <th></th>

                      <th>43,950</th>

                      <th></th>
                    </tr>
                    <tr>
                      <th colspan="2">
                        Cls. Balance &nbsp;&nbsp;
                        <button class="btn btn-default">
                          <b>₹ 16,400.00&nbsp;Dr </b>
                        </button>
                      </th>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </div>
          </div>
        </Col>
      </Row>
    </>,
    <>
      <Row>
        <Col xs="12">
          <div className=" p-3 mb-3">
            <div className="invoice">
              <Col xs="12" responsive>
                <Table style={{ width: "100%" }} className="ledger-table">
                  <tbody>
                    <tr>
                      <td colSpan={2} style={{ width: "50%" }}>
                        <b>Credit</b>
                      </td>
                      <td colSpan={2} style={{ width: "50%" }}>
                        <b>Debit</b>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ width: "10%" }}> 10620</td>
                      <td style={{ width: "40%" }}>
                        Purchase Bill No.10 Tax &nbsp;1620.00
                        <br />
                        PRODUCT 1-900&nbsp;&nbsp;17-01-23
                      </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        8142
                      </td>
                      <td style={{ width: "40%" }}>
                        <br />
                        17-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> 360</td>
                      <td style={{ width: "40%" }}>
                        <br />
                        21-01-23
                      </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        2360
                      </td>
                      <td style={{ width: "40%" }}>
                        Sale Bill No.10 Tax &nbsp;360.00
                        <br />
                        PRODUCT 1-200&nbsp;&nbsp;17-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> 3800</td>
                      <td style={{ width: "40%" }}>
                        <br />
                        21-01-23
                      </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        118
                      </td>
                      <td style={{ width: "40%" }}>
                        Sale Bill No.50 Tax &nbsp;18.00
                        <br />
                        PRODUCT 1-10&nbsp;&nbsp;17-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> 1100</td>
                      <td style={{ width: "40%" }}>
                        Purchase Bill No.10 Tax &nbsp;100
                        <br />
                        PRODUCT 1-1000&nbsp;&nbsp;30-01-23
                      </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        2360
                      </td>
                      <td style={{ width: "40%" }}>
                        Sale Bill No.10 Tax &nbsp;360.00
                        <br />
                        PRODUCT 1-200&nbsp;&nbsp;19-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> 165</td>
                      <td style={{ width: "40%" }}>
                        Purchase Bill No.B001 Tax &nbsp;15
                        <br />
                        PRODUCT 1-10&nbsp;&nbsp;PRODUCT 1-10&nbsp;&nbsp;08-04-23
                      </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        11800
                      </td>
                      <td style={{ width: "40%" }}>
                        Sale Bill No.10 Tax &nbsp;1800.00
                        <br />
                        PRODUCT 1-1000&nbsp;&nbsp;21-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> </td>
                      <td style={{ width: "40%" }}> </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        11000
                      </td>
                      <td style={{ width: "40%" }}>
                        Sale Bill No.50 Tax &nbsp;1000
                        <br />
                        PRODUCT 1-1000&nbsp;&nbsp;30-01-23
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "10%" }}> </td>
                      <td style={{ width: "40%" }}> </td>
                      <td style={{ borderLeft: "1px dotted", width: "10%" }}>
                        66000
                      </td>
                      <td style={{ width: "40%" }}>
                        Sale Bill No.1 Tax &nbsp;6000
                        <br />
                        PRODUCT 1-1200&nbsp;&nbsp;28-03-23
                      </td>
                    </tr>
                    <tr>
                      <th>16,045</th>

                      <th></th>

                      <th>101,780</th>

                      <th></th>
                    </tr>
                    <tr>
                      <th colspan="2">
                        Cls. Balance &nbsp;&nbsp;
                        <Button class="btn btn-default">
                          <b>₹ 85,735.00&nbsp;Dr </b>
                        </Button>
                      </th>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </div>
          </div>
        </Col>
      </Row>
    </>,
  ];
  return (
    <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <Row sm="2" className="mb-2">
        <Col>
          <Row className="ml-0">
            WEBSTAR INFOWAY
            <Button
              className="btn-md btn-outline-primary"
              //   onClick={() => setShowAccount(false)}
            >
              1232 Cls Bal
            </Button>
          </Row>
        </Col>
        <Col>
          <Row className="justify-content-end mr-0">
            <Button className="btn-md btn-outline-success">
              Account settlement
            </Button>
          </Row>
        </Col>
      </Row>
      <Col>
        <Row className="ml-0 mb-1">
          <CustomDatePicker
            // onCallback={dateSelect}
            text="Transaction By Date"
          />
          <Button className="btn-md btn-outline-primary mb-1 ml-0">
            Full Ledger
          </Button>
        </Row>
      </Col>
      <CustomTab
        tabnames={["Ledger", "Full Ledger", "Without Ledger", "Bill Ledger"]}
        tabpanes={tabPan}
        // onChangeEvents={onChangeEvents}
      />
      {/* <Container fluid> */}

      {/* </Container> */}
      <br />
      <br />
      <br />
      <br />
      {/* Full Ledger */}
    </Container>
  );
};

export default ViewTest;
