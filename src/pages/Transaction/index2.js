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
  const [parties, setParties] = useState([]);
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      var data = await transactionListget(
        user.token,
        filterDate.st,
        filterDate.et
      );
      if (data.data) {
        // var data2 = data.data;
        // for (let index = 0; index < 8; index++) {
        //   data2["transection"] = [
        //     ...data2["transection"],
        //     ...data2["transection"],
        //   ];
        // }
        // for (let index = 0; index < 8; index++) {
        //   data2["payment"] = [...data2["payment"], ...data2["payment"]];
        // }
        // for (let index = 0; index < 8; index++) {
        //   data2["recive"] = [...data2["recive"], ...data2["recive"]];
        // }
        setParties(data.data);
      } else {
        setParties([]);
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
      columndefs={colDefs}
      title="Transaction List"
      withCard={false}
      hasEdit={false}
    />,
    // <CustomTable
    //   cols={columns}
    //   dark={false}
    //   data={parties.recive}
    //   columndefs={colDefs}
    //   title="Recieve List"
    //   withCard={false}
    //   hasEdit={false}
    // />,
    // <CustomTable
    //   cols={columns}
    //   dark={false}
    //   data={parties.payment}
    //   columndefs={colDefs}
    //   title="Payment List"
    //   withCard={false}
    //   hasEdit={false}
    // />,
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
            <CustomDatePicker onCallback={dateSelect} />
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
