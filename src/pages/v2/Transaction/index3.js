import { Container, Row, Col, Button } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Paginated } from "components/Custom/ReactTable2";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useTable } from "react-table";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import CustomTab from "components/Custom/CustomTab";
import { transactionListget } from "api/apiv2";
import $ from "jquery";
import { format } from "date-fns";
import Loader from "components/Custom/Loader";
import CustomTable from "components/Custom/CustomTable";

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
  const columnsReact = [
    {
      Header: "Party",
      accessor: "pid",
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Mode",
      accessor: "mode",
    },
    {
      Header: "WithAmt",
      accessor: "tkachu",
    },
    {
      Header: "BillAmt",
      accessor: "tpaku",
    },
    {
      Header: "Date",
      accessor: "Date",
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
        // for (let index = 0; index < 8; index++) {
        //   data2["transection"] = [
        //     ...data2["transection"],
        //     ...data2["transection"],
        //   ];
        // }
        // data2["transection"] = [
        //   ...data2["transection"],
        //   ...data2["transection"].splice(0, 4),
        // ];
        // for (let index = 0; index < 8; index++) {
        //   data2["payment"] = [...data2["payment"], ...data2["payment"]];
        // }
        // for (let index = 0; index < 8; index++) {
        //   data2["recive"] = [...data2["recive"], ...data2["recive"]];
        // }
        setParties(data2);
      } else {
        setParties([]);
      }
      setLoading(false);
    };
    getParties();
  }, [filterDate]);

  const tabPan = [
    <Paginated columns={columnsReact} data={parties.transection} />,
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
              <CustomTab
                tabnames={["Transaction", "Receive", "Payment"]}
                tabpanes={tabPan}
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Transaction;
