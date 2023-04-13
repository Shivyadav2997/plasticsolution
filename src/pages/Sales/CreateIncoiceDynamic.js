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
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";
import DynamicDataTable from "@langleyfoxall/react-dynamic-data-table";
const CreateIncoiceDynamic = () => {
  const [totalWAmt, setTotalWAmt] = useState(0);
  const [totalBAmt, setTotalBAmt] = useState(0);
  const [gstTax, setGstTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [rows, setRows] = useState([
    {
      id: rowIndex,
      row: {
        item: "",
        pUnit: "",
        pQty: "",
        uQty: "",
        rate: "",
        bRate: "",
        gst: 10,
        tax: "",
        wAmt: "",
        bAmt: "",
        id: rowIndex,
      },
    },
  ]);

  const calCulateTotal = (rowsInput) => {
    // const rowsInput = [...rowsData];

    // for (let index = 0; index < rowsInput.length; index++) {
    //   if (rowsInput[index]["bRate"] && rowsInput[index]["uQty"]) {
    //     rowsInput[index]["bAmt"] =
    //       rowsInput[index]["bRate"] * rowsInput[index]["uQty"];
    //   }
    //   if (
    //     rowsInput[index]["bRate"] &&
    //     rowsInput[index]["uQty"] &&
    //     rowsInput[index]["rate"]
    //   ) {
    //     rowsInput[index]["wAmt"] =
    //       (rowsInput[index]["rate"] - rowsInput[index]["bRate"]) *
    //       rowsInput[index]["uQty"];
    //   }
    //   if (rowsInput[index]["gst"] && rowsInput[index]["bAmt"]) {
    //     rowsInput[index]["tax"] =
    //       (rowsInput[index]["bAmt"] * rowsInput[index]["gst"]) / 100;
    //   }
    // }

    if (rowsInput["bRate"] && rowsInput["uQty"]) {
      rowsInput["bAmt"] = rowsInput["bRate"] * rowsInput["uQty"];
    }
    if (rowsInput["bRate"] && rowsInput["uQty"] && rowsInput["rate"]) {
      rowsInput["wAmt"] =
        (rowsInput["rate"] - rowsInput["bRate"]) * rowsInput["uQty"];
    }
    if (rowsInput["gst"] && rowsInput["bAmt"]) {
      rowsInput["tax"] = (rowsInput["bAmt"] * rowsInput["gst"]) / 100;
    }

    let sub1 = 0,
      sub2 = 0,
      gst = 0;
    for (let index = 0; index < rows.length; index++) {
      if (index == rowsInput.id) {
        if (rowsInput["wAmt"]) {
          sub1 += rowsInput["wAmt"];
        }
        if (rowsInput["bAmt"]) {
          sub2 += rowsInput["bAmt"];
        }
        if (rowsInput["tax"]) {
          gst += rowsInput["tax"];
        }
      } else {
        if (rows[index]["row"]["wAmt"]) {
          sub1 += rows[index]["row"]["wAmt"];
        }
        if (rows[index]["row"]["bAmt"]) {
          sub2 += rows[index]["row"]["bAmt"];
        }
        if (rows[index]["row"]["tax"]) {
          gst += rows[index]["row"]["tax"];
        }
      }
    }
    setGstTax(gst);
    setTotalBAmt(sub2);
    setTotalWAmt(sub1);
    setTotal(sub1 + sub2 + gst);

    const curData = [...rows];
    curData[rowsInput.id] = { id: rowsInput.id, row: rowsInput };
    setRows(curData);
  };
  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <Card>
          <CardBody>
            <Row>
              <Col xs="4" lg="3">
                <CustomInputWoutFormik label="Party Name" type="select" />
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

            <DynamicDataTable
              className="table align-items-center table-flush col-12"
              rows={rows.map((value) => value.row)}
              columnWidths={{
                item: "200px",
                pUnit: "100px",
                pQty: "60px",
                uQty: "70px",
                rate: "70px",
                bRate: "70px",
                gst: "50px",
                tax: "10px",
                wAmt: "10px",
                bAmt: "10px",
              }}
              fieldsToExclude={["id"]}
              // fieldMap={{ email: "Email address" }}
              buttons={[]}
              dataItemManipulator={(field, value, row, index) => {
                switch (field) {
                  case "item":
                    return (
                      <CustomInputWoutFormik
                        type="select"
                        options={
                          <>
                            <option value="">Select Item</option>
                            <option value={1}>Item 1</option>
                          </>
                        }
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                        }}
                      />
                    );
                  case "pUnit":
                    return (
                      <CustomInputWoutFormik
                        type="select"
                        options={
                          <>
                            <option value="">Select Unit</option>
                            <option value="kg">Kg</option>
                          </>
                        }
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                        }}
                      />
                    );
                  case "pQty":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                          calCulateTotal(row);
                        }}
                        className="text-right"
                      />
                    );
                  case "uQty":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                          calCulateTotal(row);
                        }}
                        className="text-right"
                      />
                    );
                  case "rate":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                          calCulateTotal(row);
                        }}
                        className="text-right"
                      />
                    );
                  case "bRate":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                          calCulateTotal(row);
                        }}
                        className="text-right"
                      />
                    );
                  case "gst":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                          calCulateTotal(row);
                        }}
                        className="text-right"
                        disabled
                      />
                    );
                  case "tax":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                        }}
                        className="text-right"
                        disabled
                      />
                    );
                  case "wAmt":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                        }}
                        className="text-right"
                        disabled
                      />
                    );
                  case "bAmt":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        value={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                        }}
                        className="text-right"
                        disabled
                      />
                    );
                }
                return value;
              }}
              // rowRenderer={({
              //   row, // Instance of data row
              //   onClick, // Row on click handler
              //   onMouseUp, // Row on MouseUp handler
              //   onMouseDown, // Row on MouseDown handler
              //   buttons, // Array of buttons
              //   actions, // Array of header actions
              //   fields, // Visible fields
              //   renderCheckboxes, // Boolean indicating whether to render checkboxes
              //   disableCheckbox, // Boolean indicating whether to disable the checkbox per row
              //   checkboxIsChecked, // Boolean indicating if checkbox is checked
              //   onCheckboxChange, // Callable that is called when a per row checkbox is changed
              //   dataItemManipulator, // Callable that handles manipulation of every item in the data row
              // }) => {
              //   console.log(row);
              //   return (
              //     <tr>
              //       <td>shiv</td>
              //     </tr>
              //   );
              // }}
              // editableColumns={[
              //   {
              //     name: "bAmt",
              //     controlled: `false`,
              //     type: "number",
              //     value: "1",
              //     onChange: (event, column, row, index) => {
              //       console.log("shiv");
              //     },
              //   },
              // ]}
              footer={
                <>
                  <tr>
                    <td>
                      <Button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setRows([
                            ...rows,
                            {
                              id: rowIndex + 1,
                              row: {
                                item: "",
                                pUnit: "",
                                pQty: "",
                                uQty: "",
                                rate: "",
                                bRate: "",
                                gst: "",
                                tax: 10,
                                wAmt: "",
                                bAmt: "",
                                id: rowIndex + 1,
                              },
                            },
                          ]);
                          setRowIndex(rowIndex + 1);
                        }}
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
                </>
              }
            />
            {/* <table className="table align-items-center table-flush col-12">
              <tbody>
                <tr>
                  <td>
                    <Button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        setRows([
                          ...rows,
                          {
                            id: rowIndex + 1,
                            row: {
                              item: "",
                              pUnit: "",
                              pQty: "",
                              uQty: "",
                              rate: "",
                              bRate: "",
                              gst: "",
                              tax: 10,
                              wAmt: "",
                              bAmt: "",
                              id: rowIndex + 1,
                            },
                          },
                        ]);
                        setRowIndex(rowIndex + 1);
                      }}
                    >
                      Add Row
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td co></td>
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
            </table> */}

            <Row className="justify-content-md-end mr-0">
              <Button
                className="btn-md btn-outline-success"
                onClick={() => console.log("save", rows)}
              >
                Save
              </Button>
              <Button className="btn-md btn-outline-danger">Cancel</Button>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default CreateIncoiceDynamic;
