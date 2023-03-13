import { Container, Row } from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import { partyListGet } from "api/api";
import ReactDOM from "react-dom/client";
import {
  Nav,
  NavItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  NavLink,
  TabPane,
  TabContent,
} from "reactstrap";
import CustomTab from "components/Custom/CustomTab";
import { transactionListget } from "api/api";
const Transaction = () => {
  const [parties, setParties] = useState([]);
  const { user } = useSelector((store) => store.user);
  const [tabId, setTabId] = useState(1);

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
