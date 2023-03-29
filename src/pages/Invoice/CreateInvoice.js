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
  const initRow = () => {
    return (
      <tr>
        <td>
          <FormGroup className="mb-1">
            <Input
              type="select"
              bsSize="sm"
              className={`form-control-alternative`}
            >
              {[
                { label: "Select Item", value: "" },
                { label: "Product1", value: "Product1" },
              ].map((opt) => {
                return <option value={opt.value}>{opt.label}</option>;
              })}
            </Input>
          </FormGroup>
        </td>
        <td>PackUnit</td>
        <td>PckQty</td>
        <td>UnitQty</td>
        <td>Rate</td>
        <td>BillRate</td>
        <td>Gst%</td>
        <td>Tax</td>
        <td>WtoutAmt</td>
        <td>BillAmt</td>
        <td>
          <Button className="btn btn-outline-danger btn-sm">Delete Row</Button>
        </td>
      </tr>
    );
  };
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
            <th>
              <Button className="btn btn-outline-danger btn-sm">Add Row</Button>
            </th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    </Container>
  );
};

export default CreateInvoice;
