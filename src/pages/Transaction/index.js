import { Container, Row, Col, Button } from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import CustomTab from "components/Custom/CustomTab";
import { transactionListget } from "api/api";
const Transaction = () => {
  const [parties, setParties] = useState([]);
  const { user } = useSelector((store) => store.user);

  const colDefs = [
    {
      targets: 0,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        root.render(`${row + 1}`);
      },
      orderable: false,
    },
  ];
  const columns = [
    {
      title: "Id",
      data: null,
    },
    {
      title: "Party",
      data: "pid",
    },
    {
      title: "Type",
      data: "type",
    },
    {
      title: "Mode",
      data: "mode",
    },
    {
      title: "WithAmt",
      data: "tkachu",
    },
    {
      title: "BillAmt",
      data: "tpaku",
    },
    {
      title: "Date",
      data: "Date",
    },
    {
      title: "Action",
      data: null,
    },
  ];

  useEffect(() => {
    const getParties = async () => {
      var data = await transactionListget(user.token);
      // var dummyParties = [];
      // for (let index = 0; index < 100; index++) {
      //   dummyParties = [...dummyParties, ...data.data];
      // }
      setParties(data.data);
      console.log("trans", data.data);

      // data = await partyListGet(user.token);
      // setParties(data.data);
    };
    getParties();
  }, []);
  const tabPan = [
    <CustomTable
      cols={columns}
      dark={false}
      data={parties.transection}
      columndefs={colDefs}
      title="Party List"
      withCard={false}
      hasEdit={false}
    />,
    <CustomTable
      cols={columns}
      dark={false}
      data={parties.recive}
      columndefs={colDefs}
      title="Party List"
      withCard={false}
      hasEdit={false}
    />,
    <CustomTable
      cols={columns}
      dark={false}
      data={parties.payment}
      columndefs={colDefs}
      title="Party List"
      withCard={false}
      hasEdit={false}
    />,
  ];
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row xs="2">
          <Col>
            <h1>Transection List</h1>
          </Col>
          <Col>
            <Row className="float-sm-right">
              <Col>
                <Button>Receive</Button>
              </Col>
              <Col>
                <Button>Payment1</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <CustomDatePicker
            startDate={"01/01/2020"}
            endDate={"01/05/2020"}
          ></CustomDatePicker>
        </Row>
        <Row>
          <div className="col">
            <CustomTab
              tabnames={["Transaction", "Receive", "Payment"]}
              tabpanes={tabPan}
            />
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Transaction;
