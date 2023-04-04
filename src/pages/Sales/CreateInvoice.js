import {
  Container,
  Row,
  Col,
  Button,
  Table,
  FormGroup,
  Card,
  CardBody,
} from "reactstrap";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { format, parse } from "date-fns";
import { transactionPartyGet } from "api/api";
import EditableTable from "components/Custom/EditableTable";
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";

const CreateInvoice = () => {
  const stateObj = {
    item: "",
    pUnit: "",
    pQty: "",
    uQty: "",
    rate: "",
    bRate: "",
    gst: "",
    tax: "",
    wAmt: "",
    bAmt: "",
  };
  const [rowsData, setRowsData] = useState([]);
  const [parties, setParties] = useState([]);
  const { user } = useSelector((store) => store.user);
  const addTableRows = () => {
    const rowsInput = {
      item: "",
      pUnit: "",
      pQty: "",
      uQty: "",
      rate: "",
      bRate: "",
      gst: "",
      tax: "",
      wAmt: "",
      bAmt: "",
    };
    setRowsData([...rowsData, rowsInput]);
  };
  const deleteTableRows = (index) => {
    const rows = [...rowsData];
    rows.splice(index, 1);
    setRowsData(rows);
  };

  const handleChange = (index, name, value) => {
    const rowsInput = [...rowsData];
    rowsInput[index][name] = value;
    setRowsData(rowsInput);
  };

  // console.log("1", allData);
  const getTransactionParties = async () => {
    var data = await transactionPartyGet(user.token);
    if (data.data) {
      setParties(data.data);
    }
  };

  useEffect(() => {
    getTransactionParties();
    addTableRows();
  }, []);

  const EditableCell = ({
    initialValue,
    index,
    id,
    updateMyData,
    type,
    label,
    options,
    size,
    ...props
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);
    const onChange = (e) => {
      setValue(e.target.value);
    };
    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value);
    };
    return (
      <CustomInputWoutFormik
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        label={label}
        options={options}
        size={size}
        {...props}
      />
    );
  };

  const TableRows = ({ rowsData, deleteTableRows, handleChange }) => {
    return rowsData.map((data, index) => {
      const { item, pUnit, pQty, uQty, rate, bRate, gst, tax, wAmt, bAmt } =
        data;
      return (
        <tr key={index}>
          <td>
            <EditableCell
              initialValue={item}
              index={index}
              id="item"
              updateMyData={handleChange}
              type="select"
              options={
                <>
                  <option value="">Select Item</option>
                  <option value={1}>Item 1</option>
                </>
              }
              style={{ width: "200px" }}
            />
          </td>
          <td>
            <EditableCell
              initialValue={pUnit}
              index={index}
              id="pUnit"
              updateMyData={handleChange}
              type="select"
              options={
                <>
                  <option value="">Select Unit</option>
                  <option value={1}>kg</option>
                </>
              }
              style={{ width: "100px" }}
            />
          </td>
          <td>
            <EditableCell
              initialValue={pQty}
              index={index}
              id="pQty"
              updateMyData={handleChange}
              type="number"
              style={{ width: "60px" }}
            />
          </td>
          <td>
            <EditableCell
              initialValue={uQty}
              index={index}
              id="uQty"
              updateMyData={handleChange}
              type="number"
              style={{ width: "70px" }}
            />
          </td>
          <td>
            <EditableCell
              initialValue={rate}
              index={index}
              id="rate"
              updateMyData={handleChange}
              style={{ width: "70px" }}
              type="number"
            />
          </td>
          <td>
            <EditableCell
              initialValue={bRate}
              index={index}
              id="bRate"
              updateMyData={handleChange}
              style={{ width: "70px" }}
              type="number"
            />
          </td>
          <td>
            <EditableCell
              initialValue={gst}
              index={index}
              id="gst"
              updateMyData={handleChange}
              style={{ width: "50px" }}
              type="number"
              disabled
            />
          </td>
          <td>
            <EditableCell
              initialValue={tax}
              index={index}
              id="tax"
              updateMyData={handleChange}
              type="number"
              disabled
            />
          </td>
          <td>
            <EditableCell
              initialValue={wAmt}
              index={index}
              id="wAmt"
              updateMyData={handleChange}
              type="number"
              disabled
            />
          </td>
          <td>
            <EditableCell
              initialValue={bAmt}
              index={index}
              id="bAmt"
              updateMyData={handleChange}
              type="number"
              disabled
            />
          </td>
          {/* <td>
            <Button
              className="btn btn-outline-danger btn-sm"
              onClick={() => deleteTableRows(index)}
            >
              Delete Row
            </Button>
          </td> */}
        </tr>
      );
    });
  };
  return (
    <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <Card>
        <CardBody>
          <Row>
            <Col xs="4" lg="3">
              <CustomInputWoutFormik
                label="Party Name"
                type="select"
                options={[
                  <option value="">Select Party</option>,
                  ...parties.map((opt) => {
                    return <option value={opt.pid}>{opt.b_name}</option>;
                  }),
                ]}
              />
            </Col>
            <Col xs="4" lg="3">
              <CustomInputWoutFormik
                label="Bill Type"
                type="select"
                options={[<option value="">Select Type</option>]}
              />
            </Col>
            <Col xs="4" lg="3">
              <CustomInputWoutFormik label="Bill No" />
            </Col>
            <Col xs="4" lg="3">
              <CustomInputWoutFormik
                label="Date"
                type="date"
                defaultValue={format(new Date(), "yyyy-MM-dd")}
              />
            </Col>
            <Col xs="4" lg="3">
              <CustomInputWoutFormik label="Transport" />
            </Col>
            <Col xs="4" lg="3">
              <CustomInputWoutFormik label="L.R.No." />
            </Col>
            <Col xs="4" lg="3">
              <CustomInputWoutFormik label="Vehicle No." />
            </Col>
          </Row>

          {/* <h1>{allRows.length}</h1> */}
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                {[
                  "Item",
                  "PackUnit",
                  "PckQty",
                  "UnitQty",
                  "Rate",
                  "BillRate",
                  "Gst%",
                  "Tax",
                  "WtoutAmt",
                  "BillAmt",
                ].map((v) => {
                  return <th>{v}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              <TableRows
                rowsData={rowsData}
                deleteTableRows={deleteTableRows}
                handleChange={handleChange}
              />
              <tr>
                <td>
                  <Button
                    className="btn btn-outline-danger btn-sm"
                    onClick={addTableRows}
                  >
                    Add Row
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>

          <Row className="justify-content-md-end mr-0">
            <Button
              className="btn-md btn-outline-success"
              onClick={() => console.log("save", rowsData)}
            >
              Save
            </Button>
            <Button className="btn-md btn-outline-danger">Cancel</Button>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default CreateInvoice;
