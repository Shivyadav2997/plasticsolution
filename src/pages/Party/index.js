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
const Party = () => {
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
      title: "Name",
      data: "b_name",
    },
    {
      title: "Owner",
      data: "b_owner",
    },
    {
      title: "Email/GST",
      data: "email",
    },
    {
      title: "Owner",
      data: "b_add",
    },
    {
      title: "Action",
      data: null,
    },
  ];

  useEffect(() => {
    const getParties = async () => {
      const data = await partyListGet(user.token);
      var dummyParties = [];
      for (let index = 0; index < 100; index++) {
        dummyParties = [...dummyParties, ...data.data];
      }
      setParties(dummyParties);
    };
    getParties();
  }, []);
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <CustomTable
              cols={columns}
              dark={false}
              data={parties}
              columndefs={colDefs}
              title="Party List"
            />
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Party;
