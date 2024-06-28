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
import Select from "components/Custom/CustomSelect";
import DynamicDataTable from "@langleyfoxall/react-dynamic-data-table";
import { toggleSidebar, keepSidebar } from "features/User/UserSlice";
import {
  partyListGet,
  productListGet,
  productUnitGet,
  getBillNo,
  createInvoice,
  transportListGet,
  checkGST,
  transportAdd,
  getInvoiceDetails,
  updateInvoice,
  createChallanFromInvoice,
} from "api/api";
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
import { createQuotationToInvoice } from "api/api";

const CreateInvoice = () => {
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
  const [totalWAmt, setTotalWAmt] = useState(0);
  const [totalBAmt, setTotalBAmt] = useState(0);
  const [gstTax, setGstTax] = useState(0);
  const [round, setRound] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [showParty, setShowParty] = useState(false);
  const [showTransporter, setShowTransporter] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [discount, setDiscount] = useState({ percentage: "", value: "" });
  const [invoiceId, setInvoiceId] = useState(0);
  const [challanIds, setChallanIds] = useState([]);
  const [quotationIds, setQuotationIds] = useState([]);
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
    delivery: "",
  });
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [error, setError] = useState({ party: "", bType: "", bNo: "" });
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
      setError({ ...error, party: "Please Select Account" });
    } else if (upperData.bType == "") {
      setError({ ...error, bType: "Please Select Bill Type" });
    } else if (upperData.bNo == "") {
      setError({ ...error, bNo: "Please Input BillNo" });
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
        resp = await updateInvoice(
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
            delivery: upperData.delivery,
            tkachu: totalWAmt,
            tpaku: totalBAmt,
            gst: gstTax,
            roundof: round,
            discount: discount.value,
            id: invoiceId,
          },
          JSON.stringify({
            item: rows.map((x) => x.row.item),
            item_desc: rows.map((x) => x.row.desc),
            pkunit: rows.map((x) => x.row.pUnit),
            pkqty: rows.map((x) => x.row.pQty),
            uqty: rows.map((x) => x.row.uQty),
            rate: rows.map((x) => x.row.rate),
            paku: rows.map((x) => x.row.bRate),
            pgst: rows.map((x) => x.row.gst),
            tax: rows.map((x) => x.row.tax),
            kachu: rows.map((x) => x.row.wAmt),
            total: rows.map((x) => x.row.bAmt),
          })
        );
        dispatch(setLoader(false));
      } else {
        resp = await createInvoice(
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
            delivery: upperData.delivery,
            tkachu: totalWAmt,
            tpaku: totalBAmt,
            gst: gstTax,
            roundof: round,
            discount: discount.value,
          },
          JSON.stringify({
            item: rows.map((x) => x.row.item),
            item_desc: rows.map((x) => x.row.desc),
            pkunit: rows.map((x) => x.row.pUnit),
            pkqty: rows.map((x) => x.row.pQty),
            uqty: rows.map((x) => x.row.uQty),
            rate: rows.map((x) => x.row.rate),
            paku: rows.map((x) => x.row.bRate),
            pgst: rows.map((x) => x.row.gst),
            tax: rows.map((x) => x.row.tax),
            kachu: rows.map((x) => x.row.wAmt),
            total: rows.map((x) => x.row.bAmt),
          }),
          challanIds.length > 0
            ? JSON.stringify(challanIds)
            : quotationIds.length > 0
            ? JSON.stringify(quotationIds)
            : null
        );
        dispatch(setLoader(false));
      }

      if (resp.data.success == 1) {
        Toast.fire({
          icon: "success",
          title: resp.data.msg,
        });
        setTimeout(() => {
          history.push("/admin/v1/sales");
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
        rowsInput["rate"] = product.srate;
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
    if (rowsInput["bRate"] && rowsInput["uQty"] && rowsInput["rate"]) {
      rowsInput["wAmt"] =
        (rowsInput["rate"] - rowsInput["bRate"]) * rowsInput["uQty"];
    } else {
      rowsInput["wAmt"] = 0;
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

    sub1 = Number(sub1 ?? 0);
    sub2 = Number(sub2 ?? 0);
    gst = Number(gst ?? 0);
    setTotalBAmt(sub2);
    setTotalWAmt(sub1);
    if (discount.percentage > 0) {
      calculateDiscount(
        discount.percentage,
        true,
        false,
        true,
        gst,
        sub1,
        sub2
      );
    } else {
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
    }

    if (onlyreturn) {
      return rowsInput;
    } else {
      const curData = [...rows];
      curData[rowsInput.id] = { id: rowsInput.id, row: rowsInput };
      setRows(curData);
    }
  };

  const calculateDiscount = async (
    discountValue = 0,
    percentage = false,
    value = false,
    withGSt = false,
    gst = null,
    wamt = null,
    bamt = null
  ) => {
    let discountObj = { value: 0, percentage: 0 };
    let newdiscount = { value: 0, percentage: 0 };
    gst = gst == null ? gstTax : gst;
    wamt = wamt == null ? totalWAmt : wamt;
    bamt = bamt == null ? totalBAmt : bamt;
    if (percentage && discountValue > 100) {
      discountValue = 100;
    }
    if (bamt <= 0) {
      setDiscount(discountObj);
      return;
    }
    if (percentage) {
      discountObj.percentage = discountValue == "" ? 0 : discountValue;
      discountObj.value = (bamt * discountObj.percentage) / 100;
      newdiscount.percentage = discountValue;
      newdiscount.value =
        newdiscount.percentage == ""
          ? ""
          : (bamt * newdiscount.percentage) / 100;
    } else if (value) {
      discountObj.value = discountValue == "" ? 0 : discountValue;
      discountObj.percentage = getRoundAmount((discountObj.value * 100) / bamt);
      newdiscount.value = discountValue;
      newdiscount.percentage =
        newdiscount.value == ""
          ? ""
          : getRoundAmount((newdiscount.value * 100) / bamt);
    }

    let gstAMount = withGSt ? gst : getTotal();
    bamt = Number(bamt ?? 0);
    wamt = Number(wamt ?? 0);
    gstAMount = Number(gstAMount ?? 0);
    if (gstAMount > 0) {
      if (discountObj.value > 0) {
        gstAMount = gstAMount - (gstAMount * discountObj.percentage) / 100;
        setGstTax(getRoundAmount(gstAMount));
      } else {
        setGstTax(getRoundAmount(gstAMount));
      }
    }

    setDiscount(newdiscount);
    let total = bamt + wamt + gstAMount - discountObj.value;
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
    const data = await getBillNo(user.token, { date: curDate, type: "Sale" });
    if (data.data.no) {
      setUpperData({ ...upperData, bNo: data.data.no });
    }
    dispatch(setLoader(false));
  };

  const filterItems = (search) => {
    let filterData = products;
    if (search != "") {
      filterData = products
        .filter((item) =>
          item.item_name.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 10);
    }
    if (filterData.length > 50) {
      filterData = filterData.slice(0, 10);
    }
    return filterData.map((item) => {
      return {
        value: item.id,
        label: item.item_name,
      };
    });
  };

  useEffect(() => {
    getTransactionParties();
    getTransporters();
    getProducts();
    getProductUnits();
    dispatch(keepSidebar(false));
    dispatch(toggleSidebar(false));
    billNoGenerate(upperData.bDate);
    const selChallanId = sessionStorage.getItem("challanIds");
    const selquotationid = sessionStorage.getItem("quotationIds");
    if (selChallanId) {
      setChallanIds(selChallanId.split(","));
      sessionStorage.removeItem("challanIds");
    }
    if (selquotationid) {
      setQuotationIds([selquotationid]);
      sessionStorage.removeItem("quotationIds");
    }
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
    }
  }, []);

  const setDataFromApi = (resp, setwholedata = true) => {
    const invoiceData = resp.data;
    const invoiceRows = resp.data.item;
    if (setwholedata) {
      setUpperData({
        ...upperData,
        party: invoiceData.details.pid,
        bType: invoiceData.details.btype,
        bNo: invoiceData.details.bno,
        bDate: invoiceData.details.date,
        trans: invoiceData.details.tr ?? "",
        lrno: invoiceData.details.lr,
        vno: invoiceData.details.veh ?? "",
        note: invoiceData.details.note,
        delivery: invoiceData.details.delivery,
      });
    } else {
      setUpperData({ ...upperData, party: invoiceData.details.pid });
    }

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
          rate: Number(element.rate ?? 0),
          bRate: Number(element.paku ?? 0),
          gst: Number(element.pgst ?? 0),
          tax: Number(element.tax ?? 0),
          wAmt: Number(element.kachu ?? 0),
          bAmt: Number(element.total ?? 0),
          id: index,
          units: units,
        },
      });
    });
    setRowIndex(invoiceRowstoShow.length - 1);
    setRows(invoiceRowstoShow);
    console.log("rows", invoiceRowstoShow);
    if (Number(invoiceData.details.tpaku ?? 0) > 0) {
      setTotalBAmt(Number(invoiceData.details.tpaku ?? 0));
      setTotalWAmt(Number(invoiceData.details.tkachu ?? 0));
      setTotal(
        Number(invoiceData.details.tkachu ?? 0) +
          Number(invoiceData.details.tpaku ?? 0) +
          Number(invoiceData.details.gst ?? 0) -
          Number(invoiceData.details.discount ?? 0) +
          Number(invoiceData.details.roundof ?? 0)
      );
      const discountValue = invoiceData.details.discount ?? 0;
      if (discountValue > 0) {
        setDiscount({
          percentage: getRoundAmount(
            (discountValue * 100) / Number(invoiceData.details.tpaku ?? 0)
          ),
          value: discountValue,
        });
      } else {
        setDiscount({ percentage: 0, value: 0 });
      }

      setRound(Number(invoiceData.details.roundof ?? 0));
      setGstTax(Number(invoiceData.details.gst ?? 0));
    } else {
      setTotalFromApiRow(invoiceData, invoiceRowstoShow);
    }
  };

  const setTotalFromApiRow = (invoiceData, invoiceRowstoShow) => {
    let sub1 = 0,
      sub2 = 0,
      gst = 0;
    for (let index = 0; index < invoiceRowstoShow.length; index++) {
      if (invoiceRowstoShow[index]["row"]["wAmt"]) {
        sub1 += invoiceRowstoShow[index]["row"]["wAmt"];
      }
      if (invoiceRowstoShow[index]["row"]["bAmt"]) {
        sub2 += invoiceRowstoShow[index]["row"]["bAmt"];
      }
      if (invoiceRowstoShow[index]["row"]["tax"]) {
        gst += invoiceRowstoShow[index]["row"]["tax"];
      }
    }

    sub1 = Number(sub1 ?? 0);
    sub2 = Number(sub2 ?? 0);
    gst = Number(gst ?? 0);
    setTotalBAmt(sub2);
    setTotalWAmt(sub1);

    const discountValue = invoiceData.details.discount ?? 0;
    let discountTempObj = { percentage: 0, value: 0 };
    if (discountValue > 0) {
      discountTempObj = {
        percentage: getRoundAmount(
          (discountValue * 100) / Number(invoiceData.details.tpaku ?? 0)
        ),
        value: discountValue,
      };
    }

    if (gst > 0) {
      if (discountTempObj.value > 0) {
        gst = gst - (gst * discountTempObj.percentage) / 100;
        setGstTax(getRoundAmount(gst));
      } else {
        setGstTax(getRoundAmount(gst));
      }
    }

    setDiscount(discountTempObj);
    let total = sub1 + sub2 + gst - discountTempObj.value;
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
  };
  const fetchInvoiceData = async (invoiceId) => {
    dispatch(setLoader(true));
    const resp = await getInvoiceDetails(user.token, invoiceId);
    dispatch(setLoader(false));
    setDataFromApi(resp);
  };

  const fetchChallanInvoice = async (challanId) => {
    dispatch(setLoader(true));
    const resp = await createChallanFromInvoice(
      user.token,
      JSON.stringify(challanId)
    );
    dispatch(setLoader(false));
    setDataFromApi(resp, false);
  };

  const fetchQuotationInvoice = async (challanId) => {
    dispatch(setLoader(true));
    const resp = await createQuotationToInvoice(
      user.token,
      JSON.stringify(challanId)
    );
    dispatch(setLoader(false));
    setDataFromApi(resp, false);
  };

  useEffect(() => {
    if (invoiceId > 0 && products.length > 0) {
      fetchInvoiceData(invoiceId);
    }
  }, [invoiceId, products]);

  useEffect(() => {
    if (challanIds.length > 0 && products.length > 0) {
      fetchChallanInvoice(challanIds);
    }
  }, [challanIds, products]);

  useEffect(() => {
    if (quotationIds.length > 0 && products.length > 0) {
      fetchQuotationInvoice(quotationIds);
    }
  }, [quotationIds, products]);

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
                  label="Account Name *"
                  type="select"
                  options={[
                    <option value="">Select Account</option>,
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
                  label="Bill Type *"
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
                    setUpperData({ ...upperData, trans: e.target.value });
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
                <CustomInputWoutFormik
                  label="Delivery"
                  type="select"
                  options={[
                    <option value="">Select Delivery</option>,
                    ...parties.map((opt) => {
                      return <option value={opt.id}>{opt.b_name}</option>;
                    }),
                  ]}
                  value={upperData.delivery}
                  onChange={(e) => {
                    setUpperData({ ...upperData, delivery: e.target.value });
                  }}
                />
              </Col>
              <Col xs="6" sm="4" lg="3">
                <FormGroup className="mb-1">
                  <Button
                    className="btn-sm btn-outline-primary mt-xs-2 mt-sm-4"
                    onClick={handleToggleProduct}
                  >
                    <BiPlus /> Add Product
                  </Button>
                </FormGroup>
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
                rate: "9%",
                bRate: "9%",
                gst: "6%",
                tax: "7%",
                wAmt: "9%",
                bAmt: "9%",
              }}
              fieldsToExclude={["id", "units"]}
              // fieldMap={{ email: "Email address" }}
              buttons={[]}
              dataItemManipulator={(field, value, row, index) => {
                switch (field) {
                  case "item":
                    return (
                      <Select
                        allOptions={products}
                        portal={document.body}
                        selectedValue={value}
                        getFilterData={filterItems}
                        handlechange={(newvalue, action) => {
                          row[field] = newvalue.value;
                          setGstFromProduct(row, newvalue.value);
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
                  case "rate":
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
                  case "wAmt":
                    return (
                      <CustomInputWoutFormik
                        type="number"
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                        }}
                        value={value}
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
                    <td colSpan={8}></td>
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
                    <td colSpan={8}></td>
                    <td align="right">Discount</td>
                    <td>
                      <CustomInputWoutFormik
                        className="text-right"
                        value={discount.percentage}
                        maxLength={3}
                        onChange={(event) =>
                          calculateDiscount(event.target.value, true)
                        }
                        disabled={totalBAmt <= 0}
                      />
                    </td>
                    <td>
                      <CustomInputWoutFormik
                        className="text-right"
                        value={discount.value}
                        onChange={(event) =>
                          calculateDiscount(event.target.value, false, true)
                        }
                        disabled={totalBAmt <= 0}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={8}></td>
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
                      <td colSpan={8}></td>
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
                    <td colSpan={8}></td>
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
                onClick={() => history.push("/admin/v1/sales")}
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
