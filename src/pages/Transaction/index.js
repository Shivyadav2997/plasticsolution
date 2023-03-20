import { Container, Row, Col, Button } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import CustomTab from "components/Custom/CustomTab";
import { transactionListget } from "api/api";
import $ from "jquery";
import { format } from "date-fns";

const Transaction = () => {
  const [parties, setParties] = useState([]);
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
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
      var data = await transactionListget(
        user.token,
        filterDate.st,
        filterDate.et
      );
      setParties(data.data);
    };
    getParties();
  }, [filterDate]);

  const rowCallBack = (row, data, index) => {
    if (data.type == "payment") {
      $(row).css("color", "red");
    } else {
      $(row).css("color", "green");
    }
  };

  const tabPan = [
    <CustomTable
      rowCallBack={rowCallBack}
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

  const dateSelect = (start, end) => {
    console.log("st", format(start.toDate(), "yyyy-MM-dd"));
    console.log("en", format(end.toDate(), "yyyy-MM-dd"));
    // setFilterDate({
    //   st: format(start.toDate(), "yyyy-MM-dd"),
    //   et: format(end.toDate(), "yyyy-MM-dd"),
    // });
  };
  return (
    <>
      <Container className="pt-6" fluid>
        <Row xs="2">
          <Col>
            <h1>Transection List</h1>
          </Col>
          <Col>
            <Row className="float-sm-right">
              <Col>
                <Button className="btn-md">Receive</Button>
              </Col>
              <Col>
                <Button className="btn-md">Payment1</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <CustomDatePicker onCallback={dateSelect} />
          </Col>
        </Row>
        <Row>
          <Col>
            <CustomTab
              tabnames={["Transaction", "Receive", "Payment"]}
              tabpanes={tabPan}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Transaction;
