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
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";
import DynamicDataTable from "@langleyfoxall/react-dynamic-data-table";
import { toggleSidebar, keepSidebar } from "features/User/UserSlice";
import { transactionPartyGet, productListGet, getBillNo } from "api/api";
import { setLoader } from "features/User/UserSlice";

const CreateInvoice = () => {
  const [parties, setParties] = useState([]);
  const [totalWAmt, setTotalWAmt] = useState(0);
  const [totalBAmt, setTotalBAmt] = useState(0);
  const [gstTax, setGstTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [upperData, setUpperData] = useState({
    party: "",
    bType: "",
    bNo: "",
    bDate: format(new Date(), "yyyy-MM-dd"),
    trans: "",
    lrno: "",
    vno: "",
  });
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [error, setError] = useState({ party: "", bType: "", bNo: "" });
  const [rows, setRows] = useState([
    {
      id: rowIndex,
      row: {
        item: "",
        desc: "",
        pUnit: "",
        pQty: "",
        uQty: "",
        rate: "",
        bRate: "",
        gst: "",
        tax: "",
        wAmt: "",
        bAmt: "",
        id: rowIndex,
        units: [],
      },
    },
  ]);

  const setGstFromProduct = (rowsInput, inputValue) => {
    if (inputValue != "") {
      const product = products.find((x) => x.id == inputValue);
      rowsInput["units"] = [product.unit];
      rowsInput["gst"] =
        product != null ? (isNaN(product.gst) ? "0" : product.gst) : "0";
    } else {
      rowsInput["gst"] = "0";
    }
    const curData = [...rows];
    curData[rowsInput.id] = { id: rowsInput.id, row: rowsInput };
    setRows(curData);
  };
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

  const getTransactionParties = async () => {
    dispatch(setLoader(true));
    var data = await transactionPartyGet(user.token);
    dispatch(setLoader(false));
    if (data.data) {
      setParties(data.data);
    }
  };

  const getProducts = async () => {
    dispatch(setLoader(true));
    const data = await productListGet(user.token);
    setProducts(data.data);
    dispatch(setLoader(false));
  };
  const billNoGenerate = async (curDate) => {
    dispatch(setLoader(true));
    const data = await getBillNo(user.token, { date: curDate, type: "Sale" });
    if (data.data.no) {
      setUpperData({ ...upperData, bNo: data.data.no });
    }
    dispatch(setLoader(false));
  };

  useEffect(() => {
    getTransactionParties();
    getProducts();
    dispatch(keepSidebar(false));
    dispatch(toggleSidebar(false));
  }, []);

  useEffect(() => {
    billNoGenerate(upperData.bDate);
  }, [upperData.bDate]);

  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <Card>
          <CardBody>
            <Row>
              <Col xs="4" lg="3">
                <CustomInputWoutFormik
                  label="Party Name *"
                  type="select"
                  options={[
                    <option value="">Select Party</option>,
                    ...parties.map((opt) => {
                      return <option value={opt.pid}>{opt.b_name}</option>;
                    }),
                  ]}
                  errorMsg={error.party}
                  value={upperData.party}
                  onChange={(e) => {
                    setUpperData({ ...upperData, party: e.target.value });
                  }}
                />
              </Col>
              <Col xs="4" lg="3">
                <CustomInputWoutFormik
                  label="Bill Type"
                  type="select"
                  options={[
                    <option value="">Select Bill Type</option>,
                    ...["Debit", "Cash", "Bill_Tax"].map((opt) => {
                      return <option value={opt}>{opt}</option>;
                    }),
                  ]}
                  errorMsg={error.bType}
                  value={upperData.bType}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setUpperData({ ...upperData, bType: e.target.value });
                  }}
                />
              </Col>
              <Col xs="4" lg="3">
                <CustomInputWoutFormik
                  label="Bill No"
                  errorMsg={error.bNo}
                  value={upperData.bNo}
                  onChange={(e) => {
                    setUpperData({ ...upperData, bNo: e.target.value });
                  }}
                />
              </Col>
              <Col xs="4" lg="3">
                <CustomInputWoutFormik
                  label="Date"
                  type="date"
                  // defaultValue={format(new Date(), "yyyy-MM-dd")}
                  value={upperData.bDate}
                  onChange={(e) => {
                    setUpperData({
                      ...upperData,
                      bDate: e.target.value,
                    });
                  }}
                />
              </Col>
              <Col xs="4" lg="3">
                <CustomInputWoutFormik
                  label="Transport"
                  value={upperData.trans}
                  onChange={(e) => {
                    setUpperData({
                      ...upperData,
                      trans: e.target.value,
                    });
                  }}
                />
              </Col>
              <Col xs="4" lg="3">
                <CustomInputWoutFormik
                  label="L.R.No."
                  value={upperData.lrno}
                  onChange={(e) => {
                    setUpperData({
                      ...upperData,
                      lrno: e.target.value,
                    });
                  }}
                />
              </Col>
              <Col xs="4" lg="3">
                <CustomInputWoutFormik
                  label="Vehicle No."
                  value={upperData.vno}
                  onChange={(e) => {
                    setUpperData({
                      ...upperData,
                      vno: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>

            <DynamicDataTable
              className="table align-items-center table-flush col-12"
              rows={rows.map((value) => value.row)}
              columnWidths={{
                item: "200px",
                desc: "100px",
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
              fieldsToExclude={["id", "units"]}
              // fieldMap={{ email: "Email address" }}
              buttons={[]}
              dataItemManipulator={(field, value, row, index) => {
                switch (field) {
                  case "item":
                    return (
                      <CustomInputWoutFormik
                        type="select"
                        options={[
                          <option value="">Select Item</option>,
                          ...products.map((opt) => {
                            return (
                              <option value={opt.id}>{opt.item_name}</option>
                            );
                          }),
                        ]}
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                          setGstFromProduct(row, event.target.value);
                        }}
                      />
                    );
                  case "desc":
                    return (
                      <CustomInputWoutFormik
                        type="text"
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
                        options={[
                          <option value="">Select Unit</option>,
                          ...row["units"].map((opt) => {
                            return <option value={opt}>{opt}</option>;
                          }),
                        ]}
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
                                desc: "",
                                pUnit: "",
                                pQty: "",
                                uQty: "",
                                rate: "",
                                bRate: "",
                                gst: "",
                                tax: "",
                                wAmt: "",
                                bAmt: "",
                                id: rowIndex + 1,
                                units: [],
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
                onClick={() => {
                  console.log("rows", rows);
                  console.log("upperData", upperData);

                  console.log("totalWAmt", totalWAmt);
                  console.log("totalBAmt", totalBAmt);
                  console.log("gstTax", gstTax);
                  console.log("total", total);
                }}
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

export default CreateInvoice;
