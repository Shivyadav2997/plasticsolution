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
import Loader from "components/Custom/Loader";

const Transaction = () => {
  const [parties, setParties] = useState({
    payment: [],
    recive: [],
    transection: [],
  });
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

  // const colDefs = [
  //   {
  //     targets: 0,
  //     createdCell: (td, cellData, rowData, row, col) => {
  //       const root = ReactDOM.createRoot(td);
  //       root.render(`${row + 1}`);
  //     },
  //     orderable: false,
  //   },
  // ];
  const columns = [
    {
      title: "No",
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
      type: "number",
    },
    {
      title: "BillAmt",
      data: "tpaku",
      type: "number",
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
      setLoading(true);
      var data = await transactionListget(
        user.token,
        filterDate.st,
        filterDate.et
      );
      if (data.data) {
        var data2 = data.data;
        setParties(data2);
      } else {
        setParties({ payment: [], recive: [], transection: [] });
      }
      setLoading(false);
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
      title="Transaction List"
      withCard={false}
      hasEdit={false}
      custom={true}
    />,
    <CustomTable
      cols={columns}
      dark={false}
      data={parties.recive}
      title="Recieve List"
      withCard={false}
      hasEdit={false}
      custom={true}
    />,
    <CustomTable
      cols={columns}
      dark={false}
      data={parties.payment}
      title="Payment List"
      withCard={false}
      hasEdit={false}
      custom={true}
    />,
  ];

  const dateSelect = (start, end) => {
    setFilterDate({
      st: format(start.toDate(), "yyyy-MM-dd"),
      et: format(end.toDate(), "yyyy-MM-dd"),
    });
  };
  return (
    <>
      <Container className="pt-6" fluid>
        <Row xs="2" className="mb-2">
          <Col>
            <div>
              <CustomDatePicker onCallback={dateSelect} />
              <Button
                className="btn-md"
                onClick={() => setFilterDate({ st: "", et: "" })}
              >
                All Transactions
              </Button>
            </div>

            <h1>
              <span style={{ fontSize: "18px" }}>
                {filterDate.st != "" &&
                  ` (${filterDate.st} to ${filterDate.et})`}
              </span>{" "}
            </h1>
          </Col>
          <Col>
            <Row className="justify-content-end mr-0">
              <Button className="btn-md">Receive</Button>
              <Button className="btn-md">Payment</Button>
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
                  tabnames={["Transaction", "Receive", "Payment"]}
                  tabpanes={tabPan}
                />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Transaction;
