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
  transactionPartyGet,
  productListGet,
  productUnitGet,
  getBillNo,
  createInvoice,
  transportListGet,
  partyAdd,
  checkGST,
  transportAdd,
  productAdd,
} from "api/apiv2";
import { setLoader } from "features/User/UserSlice";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import React from "react";
import { BiPlus } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const CreateInvoice = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const history = useHistory();
  const [parties, setParties] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [totalBAmt, setTotalBAmt] = useState(0);
  const [gstTax, setGstTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [showParty, setShowParty] = useState(false);
  const [showTransporter, setShowTransporter] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const inputRef = useRef(null);

  const [gstError, setGstError] = useState("");
  const [gstSuccess, setGstSuccess] = useState("");
  const [units, setUnits] = useState([]);
  const [upperData, setUpperData] = useState({
    party: "",
    bType: "",
    bNo: "",
    bDate: format(new Date(), "yyyy-MM-dd"),
    trans: "",
    lrno: "",
    vno: "",
    note: "",
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
        bRate: "",
        gst: "",
        tax: "",
        bAmt: "",
        id: rowIndex,
        units: [],
      },
    },
  ]);

  const handleToggleParty = () => {
    setShowParty(!showParty);
  };

  const handleToggleTransporter = () => {
    setShowTransporter(!showTransporter);
  };

  const handleToggleProduct = () => {
    setShowProduct(!showProduct);
  };

  const validateParty = Yup.object({
    name: Yup.string().required("Required"),
    owner: Yup.string().required("Required"),
    email: Yup.string().email("Email is invalid"),
    mobile: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
  });

  useEffect(() => {
    setRows(rows);
  }, products);

  const autoFillGSTParty = async (formik, gst) => {
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
        formik.setFieldValue("owner", data.b_owner);
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

  const addParty = async (payload) => {
    dispatch(setLoader(true));
    const resp = await partyAdd(user.token, payload);
    dispatch(setLoader(false));
    if (resp.data.sucess == 1) {
      Toast.fire({
        icon: "success",
        title: resp.message,
      });
      handleToggleParty();
      getTransactionParties();
    } else {
      Toast.fire({
        icon: "error",
        title: resp.message,
      });
    }
  };

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
        title: resp.message,
      });
    }
  };

  const addProduct = async (payload) => {
    dispatch(setLoader(true));
    const resp = await productAdd(user.token, payload);
    dispatch(setLoader(false));
    handleToggleProduct();

    if (resp.data.success == 1) {
      Toast.fire({
        icon: "success",
        title: "Product Added Successfully",
      });
      handleToggleProduct();
      getProducts();
    } else {
      Toast.fire({
        icon: "error",
        title: "Something wen't wrong",
      });
    }
  };

  const validateProduct = Yup.object({
    item_name: Yup.string().required("Required"),
    item_type: Yup.string().required("Required"),
    unit: Yup.string().required("Required"),
    hsn: Yup.number().required("Required"),
    // gst: Yup.string().required("Required"),
  });

  const addInvoice = async () => {
    if (upperData.party == "") {
      setError({ ...error, party: "Please Select Party" });
    } else if (upperData.bType == "") {
      setError({ ...error, bType: "Please Select Bill Type" });
    } else if (upperData.bNo == "") {
      setError({ ...error, bNo: "Please Input BillNo" });
    } else if (total == 0) {
      Toast.fire({
        icon: "error",
        title: "Invalid Invoice Data",
      });
    } else {
      dispatch(setLoader(true));
      const resp = await createInvoice(
        user.token,
        {
          type: "sale",
          party: upperData.party,
          b_type: upperData.bType,
          date: upperData.bDate,
          bno: upperData.bNo,
          tr: upperData.trans,
          lr: upperData.lrno,
          veh: upperData.vno,
          note: upperData.note,
          tpaku: totalBAmt,
          gst: gstTax,
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
      if (resp.data.success == 1) {
        Toast.fire({
          icon: "success",
          title: resp.data.msg,
        });
        setTimeout(() => {
          history.push("/admin/v2/sales");
        }, 1500);
      } else {
        Toast.fire({
          icon: "error",
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
            { id: "0", name: "NOS" },
          ];
          break;
        default:
          rowsInput["units"] = [{ id: "0", name: product.unit }];
          break;
      }

      rowsInput["gst"] =
        product != null ? (isNaN(product.gst) ? "0" : product.gst) : "0";
    } else {
      rowsInput["gst"] = "0";
    }
    const curData = [...rows];
    curData[rowsInput.id] = { id: rowsInput.id, row: rowsInput };
    setRows(curData);
  };
  const calCulateTotal = (rowsInput, calcQty = false) => {
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
    }
    // if (rowsInput["bRate"] && rowsInput["uQty"] && rowsInput["rate"]) {
    //   rowsInput["wAmt"] =
    //     (rowsInput["rate"] - rowsInput["bRate"]) * rowsInput["uQty"];
    // }
    if (rowsInput["gst"] && rowsInput["bAmt"]) {
      rowsInput["tax"] = (rowsInput["bAmt"] * rowsInput["gst"]) / 100;
    }

    let sub1 = 0,
      sub2 = 0,
      gst = 0;
    for (let index = 0; index < rows.length; index++) {
      if (index == rowsInput.id) {
        // if (rowsInput["wAmt"]) {
        //   sub1 += rowsInput["wAmt"];
        // }
        if (rowsInput["bAmt"]) {
          sub2 += rowsInput["bAmt"];
        }
        if (rowsInput["tax"]) {
          gst += rowsInput["tax"];
        }
      } else {
        // if (rows[index]["row"]["wAmt"]) {
        //   sub1 += rows[index]["row"]["wAmt"];
        // }
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
    // setTotalWAmt(sub1);
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
  }, []);

  return (
    <>
      {/* Party Modal */}
      <CustomModal
        show={showParty}
        handleToggle={handleToggleParty}
        title="Add Party"
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
            owner: "",
            mobile: "",
            email: "",
            gst: "",
            city: "",
            add: "",
          }}
          validationSchema={validateParty}
          onSubmit={(values) => {
            addParty(values);
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
                      placeholder="Bussiness GST No."
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
                          autoFillGSTParty(formik, formik.values.gst);
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
                  placeholder="Bussiness Name"
                  label="Bussiness Name"
                  name="name"
                  type="text"
                />

                <CustomInput
                  placeholder="Owner Name"
                  label="Owner Name"
                  name="owner"
                  type="text"
                />
                <CustomInput
                  placeholder="Bussiness Mobile No."
                  label="Mobile No."
                  name="mobile"
                  type="number"
                />
                <CustomInput
                  placeholder="Bussiness Email"
                  label="Email"
                  name="email"
                  type="email"
                />

                <CustomInput
                  placeholder="Bussiness City"
                  label="City"
                  name="city"
                  type="text"
                />
                <CustomInput
                  placeholder="Bussiness Address"
                  label="Address"
                  name="add"
                  type="text"
                />
              </Form>
            </div>
          )}
        </Formik>
      </CustomModal>
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
      <CustomModal
        show={showProduct}
        handleToggle={handleToggleProduct}
        title={`Add Product`}
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
            item_name: "",
            item_type: "Goods",
            unit: "",
            hsn: "",
            gst: "",
            description: "",
          }}
          validationSchema={validateProduct}
          onSubmit={(values) => {
            addProduct(values);
          }}
          validateOnBlur={false}
          validateOnChange={false}
          innerRef={inputRef}
        >
          {(formik) => (
            <div>
              <Form>
                <CustomInput
                  placeholder="Item Name"
                  label="Item Name"
                  name="item_name"
                  type="text"
                />
                <CustomInput
                  name="item_type"
                  type="select"
                  label="Type"
                  options={[
                    { label: "Goods", value: "Goods" },
                    { label: "Services", value: "Services" },
                  ].map((opt) => {
                    return <option value={opt.value}>{opt.label}</option>;
                  })}
                />
                <CustomInput
                  name="unit"
                  type="select"
                  label="Unit"
                  options={[
                    <option value="">Select Unit</option>,
                    ...units.map((opt) => {
                      return (
                        <option value={opt.code}>
                          {opt.name}-{opt.code}
                        </option>
                      );
                    }),
                  ]}
                />
                <CustomInput
                  placeholder="HSN"
                  label="HSN"
                  name="hsn"
                  type="number"
                />
                <CustomInput
                  placeholder="GST Rate %"
                  label="GST Rate %"
                  name="gst"
                  type="text"
                />
                <CustomInput
                  placeholder="Description"
                  label="Description"
                  name="description"
                  type="text"
                />
              </Form>
            </div>
          )}
        </Formik>
      </CustomModal>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
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
                      return <option value={opt.pid}>{opt.b_name}</option>;
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
              </Col>
              <Col xs="6" sm="4" lg="3">
                <CustomInputWoutFormik
                  label="Bill Type"
                  type="select"
                  options={[
                    <option value="">Select Bill Type *</option>,
                    ...["Debit", "Cash", "Bill_Tax"].map((opt) => {
                      return <option value={opt}>{opt}</option>;
                    }),
                  ]}
                  errorMsg={error.bType}
                  value={upperData.bType}
                  onChange={(e) => {
                    setError({ ...error, bType: "" });
                    setUpperData({ ...upperData, bType: e.target.value });
                  }}
                />
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
                  label="Bill No *"
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
                  label="Transport"
                  type="select"
                  options={[
                    <option value="">Select Transport</option>,
                    ...transporters.map((opt) => {
                      return <option value={opt.id}>{opt.t_name}</option>;
                    }),
                  ]}
                  value={upperData.trans}
                  onChange={(e) => {
                    setUpperData({
                      ...upperData,
                      trans: e.target.value,
                    });
                  }}
                  addon={
                    <Button
                      className="btn-sm btn-outline-primary"
                      onClick={handleToggleTransporter}
                    >
                      <BiPlus />
                    </Button>
                  }
                />
              </Col>
              <Col xs="6" sm="4" lg="3">
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
              <Col xs="6" sm="4" lg="3">
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
              <Col xs="6" sm="4" lg="3">
                <FormGroup className="mb-1">
                  <Button
                    className="btn-sm btn-outline-primary mt-xs-2 mt-sm-4 mt-lg-2"
                    onClick={handleToggleProduct}
                  >
                    <BiPlus /> Add Product
                  </Button>
                </FormGroup>
              </Col>
            </Row>

            <DynamicDataTable
              className="table align-items-center table-flush col-12 invoice-table"
              rows={rows.map((value) => value.row)}
              columnWidths={{
                item: "14%",
                desc: "9%",
                pUnit: "9%",
                pQty: "9%",
                uQty: "9%",
                bRate: "9%",
                gst: "6%",
                tax: "7%",
                // wAmt: "9%",
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
                    <td colSpan={7}></td>
                    <td align="right">GST Tax</td>
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
                onClick={() => history.push("/admin/v2/sales")}
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

export default CreateInvoice;
