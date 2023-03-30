import { Container, Row, Col, Button, Table, FormGroup } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import CustomTab from "components/Custom/CustomTab";
import {
  transactionListget,
  transactionPartyGet,
  transactionRecieveAdd,
  transactionPaymentAdd,
  deleteRecord,
} from "api/api";
import { Input } from "reactstrap";
import $ from "jquery";
import { format, parse } from "date-fns";
import Loader from "components/Custom/Loader";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const CreateInvoice = () => {
  const validate = Yup.object({
    amount: Yup.number().required("Required"),
  });

  const [allRows, setAllRows] = useState([]);
  const [index, setIndex] = useState(0);

  const initRow = () => {
    setIndex((oldIndex) => oldIndex + 1);
    return (
      // <Formik
      //   initialValues={{
      //     amount: "",
      //   }}
      //   validationSchema={validate}
      //   onSubmit={(values) => {}}
      // >
      //   {(formik) => (
      <>
        <td>Test</td>
        <td>PackUnit</td>
        <td>PckQty</td>
        <td>UnitQty</td>
        <td>Rate</td>
        <td>BillRate</td>
        <td>Gst%</td>
        <td>Tax</td>
        <td>WtoutAmt</td>
        <td>{index}</td>
      </>
      //   )}
      // </Formik>
    );
  };

  useEffect(() => {
    setAllRows([{ ind: index, row: initRow() }]);
  }, []);
  return (
    <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th>Item</th>
            <th>PackUnit</th>
            <th>PckQty</th>
            <th>UnitQty</th>
            <th>Rate</th>
            <th>BillRate</th>
            <th>Gst%</th>
            <th>Tax</th>
            <th>WtoutAmt</th>
            <th>BillAmt</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allRows.map((v) => {
            return (
              <tr>
                {v.row}
                <td>
                  <Button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      setAllRows(allRows.filter((x) => x.ind != v.ind));
                    }}
                  >
                    Delete Row
                  </Button>
                </td>
              </tr>
            );
          })}
          <tr>
            <td>
              <Button
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  setAllRows([
                    ...allRows,
                    {
                      ind: index,
                      row: initRow(),
                    },
                  ]);
                }}
              >
                Add Row
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default CreateInvoice;
