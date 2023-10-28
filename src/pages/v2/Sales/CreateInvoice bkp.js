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
import { useSelector, useDispatch } from "react-redux";
import { format, parse } from "date-fns";
import { transactionPartyGet } from "api/apiv2";
import EditableTable from "components/Custom/EditableTable";
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";
import { toggleSidebar, keepSidebar } from "features/User/UserSlice";

const CreateInvoice = () => {
  const [rowsData, setRowsData] = useState([]);
  const [parties, setParties] = useState([]);
  const [totalWAmt, setTotalWAmt] = useState(0);
  const [totalBAmt, setTotalBAmt] = useState(0);
  const [gstTax, setGstTax] = useState(0);
  const [total, setTotal] = useState(0);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
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
    // setRowsData(rowsInput);
    calCulateTotal(rowsInput);
  };

  const getTransactionParties = async () => {
    var data = await transactionPartyGet(user.token);
    if (data.data) {
      setParties(data.data);
    }
  };

  const calCulateTotal = (rowsInput) => {
    for (let index = 0; index < rowsInput.length; index++) {
      if (rowsInput[index]["bRate"] && rowsInput[index]["uQty"]) {
        rowsInput[index]["bAmt"] =
          rowsInput[index]["bRate"] * rowsInput[index]["uQty"];
      }
      if (
        rowsInput[index]["bRate"] &&
        rowsInput[index]["uQty"] &&
        rowsInput[index]["rate"]
      ) {
        rowsInput[index]["wAmt"] =
          (rowsInput[index]["rate"] - rowsInput[index]["bRate"]) *
          rowsInput[index]["uQty"];
      }
      if (rowsInput[index]["gst"] && rowsInput[index]["bAmt"]) {
        rowsInput[index]["tax"] =
          (rowsInput[index]["bAmt"] * rowsInput[index]["gst"]) / 100;
      }
    }

    let sub1 = 0,
      sub2 = 0,
      gst = 0;
    for (let index = 0; index < rowsInput.length; index++) {
      if (rowsInput[index]["wAmt"]) {
        sub1 += rowsInput[index]["wAmt"];
      }
      if (rowsInput[index]["bAmt"]) {
        sub2 += rowsInput[index]["bAmt"];
      }
      if (rowsInput[index]["tax"]) {
        gst += rowsInput[index]["tax"];
      }
    }
    setGstTax(gst);
    setTotalBAmt(sub2);
    setTotalWAmt(sub1);
    setTotal(sub1 + sub2 + gst);
    setRowsData(rowsInput);
  };
  useEffect(() => {
    getTransactionParties();
    addTableRows();
    dispatch(keepSidebar(false));
    dispatch(toggleSidebar(false));
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
              className="text-right"
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
              className="text-right"
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
              className="text-right"
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
              className="text-right"
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
              className="text-right"
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
              className="text-right"
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
              className="text-right"
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
              className="text-right"
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
              <tr>
                <td colSpan={7}></td>
                <td align="right">Sub Total</td>
                <td>
                  <CustomInputWoutFormik
                    className="text-right"
                    value={totalWAmt}
                    disabled
                  />
                </td>
                <td>
                  <CustomInputWoutFormik
                    className="text-right"
                    value={totalBAmt}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={7}></td>
                <td align="right">GST Tax</td>
                <td></td>
                <td>
                  <CustomInputWoutFormik
                    className="text-right"
                    value={gstTax}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={7}></td>
                <td align="right">
                  <strong>Final Total</strong>
                </td>
                <td></td>
                <td>
                  <CustomInputWoutFormik
                    className="text-right"
                    value={total}
                    disabled
                  />
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
