import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  FormGroup,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, parse } from "date-fns";
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";
import DynamicDataTable from "@langleyfoxall/react-dynamic-data-table";
import { toggleSidebar, keepSidebar } from "features/User/UserSlice";
import {
  partyListGet,
  productListGet,
  productUnitGet,
  getQuatationNo,
  createQuotation,
  transportListGet,
  checkGST,
  transportAdd,
  getQuotationDetails,
  updateQuotation,
} from "api/apiv2";
import { setLoader } from "features/User/UserSlice";
import Swal from "sweetalert2";
import { useHistory, useLocation } from "react-router-dom";
import React from "react";
import { BiPlus } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AddPartyModal from "pages/Party/AddParty";
import AddProductModal from "pages/Product/AddProduct";

const CreateQuotation = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const history = useHistory();
  const [partyactive, setpartyActive] = useState("");
  const [partyInactive, setpartyInActive] = useState("");
  const [parties, setParties] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [totalBAmt, setTotalBAmt] = useState(0);
  const [gstTax, setGstTax] = useState(0);
  const [round, setRound] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [showParty, setShowParty] = useState(false);
  const [showTransporter, setShowTransporter] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [invoiceId, setInvoiceId] = useState(0);
  const inputRef = useRef(null);

  const [gstError, setGstError] = useState("");
  const [gstSuccess, setGstSuccess] = useState("");
  const [units, setUnits] = useState([]);
  const [upperData, setUpperData] = useState({
    party: "",
    bNo: "",
    bDate: format(new Date(), "yyyy-MM-dd"),
    trans: "",
    lrno: "",
    vno: "",
    note: "",
    delivery: "",
  });
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [error, setError] = useState({ party: "", bNo: "" });
  const [rows, setRows] = useState([]);

  const location = useLocation();

  const handleToggleParty = () => {
    setShowParty(!showParty);
  };

  const handleToggleTransporter = () => {
    setShowTransporter(!showTransporter);
  };

  const handleToggleProduct = () => {
    setShowProduct(!showProduct);
  };

  useEffect(() => {
    setRows(rows);
  }, [products]);

  const autoFillGSTTrasporter = async (formik, gst) => {
    if (gst.length < 15) {
      setGstError("GST invalid");
    } else {
      setGstError("");
      dispatch(setLoader(true));
      const resp = await checkGST(gst);
      dispatch(setLoader(false));
      const data = resp.data;

      if (data.status == "1") {
        formik.setFieldValue("name", data.b_name);
        // formik.setFieldValue("owner", data.b_owner);
        formik.setFieldValue("city", data.b_city);
        formik.setFieldValue("add", data.b_add);
      }
      if (data.sts.toLowerCase() == "active") {
        setGstSuccess(data.sts);
      } else {
        setGstError(data.sts);
      }
    }
  };

  const validateTransporter = Yup.object({
    name: Yup.string().required("Required"),
    add: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
  });

  const addTransporter = async (payload) => {
    dispatch(setLoader(true));
    const resp = await transportAdd(user.token, payload);
    dispatch(setLoader(false));
    if (resp.data.sucess == 1) {
      Toast.fire({
        icon: "success",
        title: resp.message,
      });
      handleToggleTransporter();
      getTransporters();
    } else {
      Toast.fire({
        icon: "error",
        timer: null,
        showCloseButton: true,
        title: resp.message,
      });
    }
  };

  const addInvoice = async () => {
    if (upperData.party == "") {
      setError({ ...error, party: "Please Select Party" });
    } else if (upperData.bNo == "") {
      setError({ ...error, bNo: "Please Input ChallanNo" });
    } else if (rows.length == 0 || rows[0].row.item == "") {
      Toast.fire({
        icon: "error",
        timer: null,
        showCloseButton: true,
        title: "Invalid Invoice Data",
      });
    } else {
      dispatch(setLoader(true));
      let resp;
      if (invoiceId > 0) {
        resp = await updateQuotation(
          user.token,
          {
            type: "sale",
            party: upperData.party,
            date: upperData.bDate,
            bno: upperData.bNo,
            tr: upperData.trans,
            lr: upperData.lrno,
            veh: upperData.vno,
            note: upperData.note,
            delivery: upperData.delivery,
            tpaku: totalBAmt,
            gst: gstTax,
            roundof: round,
            id: invoiceId,
          },
          JSON.stringify({
            item: rows.map((x) => x.row.item),
            item_desc: rows.map((x) => x.row.desc),
            pkunit: rows.map((x) => x.row.pUnit),
            pkqty: rows.map((x) => x.row.pQty),
            uqty: rows.map((x) => x.row.uQty),
            paku: rows.map((x) => x.row.bRate),
            pgst: rows.map((x) => x.row.gst),
            tax: rows.map((x) => x.row.tax),
            total: rows.map((x) => x.row.bAmt),
          })
        );
        dispatch(setLoader(false));
      } else {
        resp = await createQuotation(
          user.token,
          {
            type: "sale",
            party: upperData.party,
            date: upperData.bDate,
            bno: upperData.bNo,
            tr: upperData.trans,
            lr: upperData.lrno,
            veh: upperData.vno,
            note: upperData.note,
            delivery: upperData.delivery,
            tpaku: totalBAmt,
            gst: gstTax,
            roundof: round,
          },
          JSON.stringify({
            item: rows.map((x) => x.row.item),
            item_desc: rows.map((x) => x.row.desc),
            pkunit: rows.map((x) => x.row.pUnit),
            pkqty: rows.map((x) => x.row.pQty),
            uqty: rows.map((x) => x.row.uQty),
            paku: rows.map((x) => x.row.bRate),
            pgst: rows.map((x) => x.row.gst),
            tax: rows.map((x) => x.row.tax),
            total: rows.map((x) => x.row.bAmt),
          })
        );
        dispatch(setLoader(false));
      }

      if (resp.data.success == 1) {
        Toast.fire({
          icon: "success",
          title: resp.data.msg,
        });
        setTimeout(() => {
          history.push("/admin/v2/quotation");
        }, 1500);
      } else {
        Toast.fire({
          icon: "error",
          timer: null,
          showCloseButton: true,
          title: resp.data.msg || "Something went wrong",
        });
      }
    }
  };
  const setGstFromProduct = (rowsInput, inputValue) => {
    if (inputValue != "") {
      const product = products.find((x) => x.id == inputValue);
      switch (product.unit) {
        case "KGS":
          rowsInput["units"] = [
            { id: "1", name: "KGS" },
            { id: "1", name: "BAG" },
            { id: "20", name: "20KGS BAG" },
            { id: "25", name: "25KGS BAG" },
            { id: "50", name: "50KGS BAG" },
            { id: "-10", name: "NOS" },
          ];
          break;
        default:
          rowsInput["units"] = [{ id: "-10", name: product.unit }];
          break;
      }

      rowsInput["pUnit"] = rowsInput["units"][0].id;
      if (product != null && !isNaN(product.srate)) {
        rowsInput["bRate"] = product.srate;
      }
      rowsInput["gst"] =
        product != null ? (isNaN(product.gst) ? "0" : product.gst) : "0";
    } else {
      rowsInput["gst"] = "0";
    }

    rowsInput = calCulateTotal(rowsInput, true, true);
    const curData = [...rows];
    curData[rowsInput.id] = { id: rowsInput.id, row: rowsInput };
    setRows(curData);
  };
  const calCulateTotal = (
    rowsInput,
    calcQty = false,
    onlyreturn = false,
    withTax = false
  ) => {
    if (calcQty) {
      switch (rowsInput["pUnit"]) {
        case "1":
        case "20":
        case "25":
        case "50":
          rowsInput["uQty"] = rowsInput["pQty"] * Number(rowsInput["pUnit"]);
          break;
        default:
          rowsInput["uQty"] = rowsInput["pQty"];
      }
    }

    if (rowsInput["bRate"] && rowsInput["uQty"]) {
      rowsInput["bAmt"] = rowsInput["bRate"] * rowsInput["uQty"];
    } else {
      rowsInput["bAmt"] = 0;
    }

    if (withTax) {
      if (rowsInput["tax"] && rowsInput["bAmt"]) {
        rowsInput["gst"] = getRoundAmount(
          (100 * rowsInput["tax"]) / rowsInput["bAmt"]
        );
      } else {
        rowsInput["gst"] = 0;
      }
    } else {
      if (rowsInput["gst"] && rowsInput["bAmt"]) {
        rowsInput["tax"] = getRoundAmount(
          (rowsInput["bAmt"] * rowsInput["gst"]) / 100
        );
      } else {
        rowsInput["tax"] = 0;
      }
    }
    let sub1 = 0,
      sub2 = 0,
      gst = 0;
    for (let index = 0; index < rows.length; index++) {
      if (index == rowsInput.id) {
        if (rowsInput["bAmt"]) {
          sub2 += rowsInput["bAmt"];
        }
        if (rowsInput["tax"]) {
          gst += rowsInput["tax"];
        }
      } else {
        if (rows[index]["row"]["bAmt"]) {
          sub2 += rows[index]["row"]["bAmt"];
        }
        if (rows[index]["row"]["tax"]) {
          gst += rows[index]["row"]["tax"];
        }
      }
    }

    sub1 = Number(sub1 ?? 0);
    sub2 = Number(sub2 ?? 0);
    gst = Number(gst ?? 0);
    setTotalBAmt(sub2);
    setGstTax(getRoundAmount(gst));
    let total = sub1 + sub2 + gst;
    let roundAmount = Math.round(total);
    roundAmount = Number(roundAmount ?? 0);
    total = Number(total ?? 0);

    if (roundAmount != total) {
      setRound(getRoundAmount(roundAmount - total));
      setTotal(roundAmount);
    } else {
      setTotal(total);
      setRound(0);
    }

    if (onlyreturn) {
      return rowsInput;
    } else {
      const curData = [...rows];
      curData[rowsInput.id] = { id: rowsInput.id, row: rowsInput };
      setRows(curData);
    }
  };

  const getTotal = () => {
    let gst = 0;
    for (let index = 0; index < rows.length; index++) {
      if (rows[index]["row"]["tax"]) {
        gst += rows[index]["row"]["tax"];
      }
    }
    return gst;
  };
  const getTransactionParties = async () => {
    dispatch(setLoader(true));
    var data = await partyListGet(user.token);
    dispatch(setLoader(false));
    if (data.data) {
      setParties(data.data);
    }
  };

  const getTransporters = async () => {
    dispatch(setLoader(true));
    var data = await transportListGet(user.token);
    dispatch(setLoader(false));
    if (data.data) {
      setTransporters(data.data);
    }
  };

  const getProducts = async () => {
    dispatch(setLoader(true));
    const data = await productListGet(user.token);
    setProducts(data.data);
    dispatch(setLoader(false));
  };

  const getProductUnits = async () => {
    dispatch(setLoader(true));
    var data = await productUnitGet(user.token);
    dispatch(setLoader(false));
    if (data.data) {
      setUnits(data.data);
    }
  };

  const billNoGenerate = async (curDate) => {
    dispatch(setLoader(true));
    const data = await getQuatationNo(user.token, {
      date: curDate,
      type: "Sale",
    });
    if (data.data.no) {
      setUpperData({ ...upperData, bNo: data.data.no });
    }
    dispatch(setLoader(false));
  };

  useEffect(() => {
    getTransactionParties();
    getTransporters();
    getProducts();
    getProductUnits();
    dispatch(keepSidebar(false));
    dispatch(toggleSidebar(false));
    billNoGenerate(upperData.bDate);
    const intervalId = setInterval(() => {
      const firstInput = document.querySelector(
        ".createInvoiceClass input:not([disabled]), .createInvoiceClass select:not([disabled])"
      );
      if (firstInput) {
        clearInterval(intervalId);
        firstInput.focus();
      }
    }, 500);

    const search = location.search;
    const urlSearchParams = new URLSearchParams(search);
    if (urlSearchParams.has("invoice")) {
      const variable1Value = urlSearchParams.get("invoice");
      setInvoiceId(atob(variable1Value));
    } else {
      setRows([
        {
          id: rowIndex,
          row: {
            item: "",
            desc: "",
            pUnit: "",
            pQty: "",
            uQty: "",
            bRate: "",
            gst: "",
            tax: "",
            bAmt: "",
            id: rowIndex,
            units: [],
          },
        },
      ]);
    }
  }, []);

  const fetchInvoiceData = async (invoiceId) => {
    dispatch(setLoader(true));
    const resp = await getQuotationDetails(user.token, invoiceId);
    dispatch(setLoader(false));
    const invoiceData = resp.data;
    const invoiceRows = resp.data.item;
    setUpperData({
      ...upperData,
      party: invoiceData.details?.pid,
      bNo: invoiceData.details?.bno,
      bDate: invoiceData.details?.date,
      trans: invoiceData.details?.tr ?? "",
      lrno: invoiceData.details?.lr,
      vno: invoiceData.details?.veh ?? "",
      note: invoiceData.details?.note,
      delivery: invoiceData.details?.delivery,
    });
    setTotalBAmt(Number(invoiceData.details?.tpaku ?? 0));
    setTotal(
      Number(invoiceData.details?.tkachu ?? 0) +
        Number(invoiceData.details?.tpaku ?? 0) +
        Number(invoiceData.details?.gst ?? 0) +
        Number(invoiceData.details?.roundof ?? 0)
    );

    setRound(Number(invoiceData.details?.roundof ?? 0));
    setGstTax(Number(invoiceData.details?.gst) ?? 0);
    const invoiceRowstoShow = [];
    invoiceRows.forEach((element, index) => {
      const product = products.find((x) => x.id == element.item_name);
      let units = [{ id: "-10", name: product?.unit }];
      switch (product?.unit) {
        case "KGS":
          units = [
            { id: "1", name: "KGS" },
            { id: "1", name: "BAG" },
            { id: "20", name: "20KGS BAG" },
            { id: "25", name: "25KGS BAG" },
            { id: "50", name: "50KGS BAG" },
            { id: "-10", name: "NOS" },
          ];
          break;
      }
      invoiceRowstoShow.push({
        id: index,
        row: {
          item: product?.id,
          desc: element.item_desc,
          pUnit: units[0].id,
          pQty: Number(element.pkqty ?? 0),
          uQty: Number(element.uqty ?? 0),
          bRate: Number(element.paku ?? 0),
          gst: Number(element.pgst ?? 0),
          tax: Number(element.tax ?? 0),
          bAmt: Number(element.total ?? 0),
          id: index,
          units: units,
        },
      });
    });
    setRowIndex(invoiceRowstoShow.length - 1);
    setRows(invoiceRowstoShow);
  };

  useEffect(() => {
    if (invoiceId > 0 && products.length > 0) {
      fetchInvoiceData(invoiceId);
    }
  }, [invoiceId, products]);

  const getRoundAmount = (amount) => {
    return Math.round(Number(amount ?? 0) * 100) / 100;
  };
  const getSelectedPartyGSTInfo = async () => {
    const party = parties.find((X) => X.id == upperData.party);
    if (party != null && party.gst != "") {
      dispatch(setLoader(true));
      const resp = await checkGST(party.gst);
      dispatch(setLoader(false));
      const data = resp.data;

      if (data.sts.toLowerCase() == "active") {
        setpartyActive(data.sts);
      } else {
        setpartyInActive(data.sts);
      }
    } else {
      setpartyActive("");
      setpartyInActive("");
    }
  };

  useEffect(() => {
    setpartyActive("");
    setpartyInActive("");
    if (upperData.party != "") {
      getSelectedPartyGSTInfo();
    }
  }, [upperData.party]);

  return (
    <>
      {/* Party Modal */}
      <AddPartyModal
        show={showParty}
        party={null}
        Toast={Toast}
        callbackFunction={getTransactionParties}
        toggle={handleToggleParty}
      />
      <CustomModal
        show={showTransporter}
        handleToggle={handleToggleTransporter}
        title={`Add Transporter`}
        footer={
          <Button
            type="submit"
            className="mr-1"
            color="primary"
            block
            size="md"
            onClick={() => {
              inputRef.current.handleSubmit();
            }}
          >
            Save
          </Button>
        }
      >
        <Formik
          initialValues={{
            name: "",
            mobile: "",
            gst: "",
            city: "",
            add: "",
          }}
          validationSchema={validateTransporter}
          onSubmit={(values) => {
            addTransporter(values);
          }}
          validateOnBlur={false}
          validateOnChange={false}
          innerRef={inputRef}
        >
          {(formik) => (
            <div>
              <Form>
                <FormGroup className="mb-1">
                  <label className="form-control-label">GST No.</label>
                  <InputGroup className="input-group-alternative">
                    <CustomInput
                      placeholder="GST No."
                      name="gst"
                      type="text"
                      withFormGroup={false}
                    />
                    <InputGroupAddon addonType="append">
                      <Button
                        className="pt-0 pb-0"
                        color="primary"
                        type="button"
                        onClick={() => {
                          autoFillGSTTrasporter(formik, formik.values.gst);
                        }}
                      >
                        <FaSearch />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {gstError && <label className="errorMsg">{gstError}</label>}
                  {gstSuccess && (
                    <label className="text-success">{gstSuccess}</label>
                  )}
                </FormGroup>
                <CustomInput
                  placeholder="Transporter Name"
                  label="Transporter Name"
                  name="name"
                  type="text"
                />
                <CustomInput
                  placeholder="Mobile No."
                  label="Mobile No."
                  name="mobile"
                  type="number"
                />
                <CustomInput
                  placeholder="City"
                  label="City"
                  name="city"
                  type="text"
                />
                <CustomInput
                  placeholder="Address"
                  label="Address"
                  name="add"
                  type="text"
                />
              </Form>
            </div>
          )}
        </Formik>
      </CustomModal>
      <AddProductModal
        show={showProduct}
        product={null}
        Toast={Toast}
        callbackFunction={getProducts}
        handleToggle={handleToggleProduct}
      />
      <Container
        className="pt-6 createInvoiceClass"
        fluid
        style={{ minHeight: "80vh" }}
      >
        <Card>
          <CardBody>
            <Row>
              <Col xs="6" sm="4" lg="3">
                <CustomInputWoutFormik
                  label="Party Name *"
                  type="select"
                  options={[
                    <option value="">Select Party</option>,
                    ...parties.map((opt) => {
                      return <option value={opt.id}>{opt.b_name}</option>;
                    }),
                  ]}
                  errorMsg={error.party}
                  value={upperData.party}
                  onChange={(e) => {
                    setError({ ...error, party: "" });
                    setUpperData({ ...upperData, party: e.target.value });
                  }}
                  addon={
                    <Button
                      className="btn-sm btn-outline-primary"
                      onClick={handleToggleParty}
                    >
                      <BiPlus />
                    </Button>
                  }
                />
                {partyInactive && (
                  <label className="errorMsg">{partyInactive}</label>
                )}
                {partyactive && (
                  <label className="text-success">{partyactive}</label>
                )}
              </Col>

              <Col xs="6" sm="4" lg="3">
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
              <Col xs="6" sm="4" lg="3">
                <CustomInputWoutFormik
                  label="Quotation No *"
                  errorMsg={error.bNo}
                  value={upperData.bNo}
                  onChange={(e) => {
                    setError({ ...error, bNo: "" });
                    setUpperData({ ...upperData, bNo: e.target.value });
                  }}
                />
              </Col>

              <Col xs="6" sm="4" lg="3">
                <CustomInputWoutFormik
                  label="Note"
                  value={upperData.note}
                  onChange={(e) => {
                    setUpperData({
                      ...upperData,
                      note: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>

            <DynamicDataTable
              className="table align-items-center table-flush col-12 invoice-table"
              rows={rows.map((value) => value.row ?? {})}
              columnWidths={{
                item: "14%",
                desc: "9%",
                pUnit: "9%",
                pQty: "9%",
                uQty: "9%",
                bRate: "9%",
                gst: "6%",
                tax: "7%",
                bAmt: "9%",
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
                        value={value}
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
                            return <option value={opt.id}>{opt.name}</option>;
                          }),
                        ]}
                        defaultValue={value}
                        value={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                          calCulateTotal(row, true);
                        }}
                      />
                    );
                  case "pQty":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        value={value}
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                          calCulateTotal(row, true);
                        }}
                        className="text-right"
                      />
                    );
                  case "uQty":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        value={value}
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
                        value={value}
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
                        value={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                          calCulateTotal(row);
                        }}
                        className="text-right"
                        // disabled
                      />
                    );
                  case "tax":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        defaultValue={value}
                        value={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                          calCulateTotal(row, false, false, true);
                        }}
                        className="text-right"
                        // disabled
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
                                bRate: "",
                                gst: "",
                                tax: "",
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
                        value={totalBAmt}
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6}></td>
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

                  {round != 0 && (
                    <tr>
                      <td colSpan={6}></td>
                      <td align="right">
                        <strong>Round</strong>
                      </td>
                      <td></td>
                      <td>
                        <CustomInputWoutFormik
                          className="text-right"
                          value={round}
                          disabled
                        />
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={6}></td>
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

            <Row className="justify-content-md-end mr-0">
              <Button
                className="btn-md btn-outline-success"
                onClick={() => {
                  addInvoice();
                }}
              >
                Save
              </Button>
              <Button
                className="btn-md btn-outline-danger"
                onClick={() => history.push("/admin/v2/quotation")}
              >
                Cancel
              </Button>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default CreateQuotation;
