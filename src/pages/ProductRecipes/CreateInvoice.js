import { Container, Row, Col, Button, Card, CardBody } from "reactstrap";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";
import DynamicDataTable from "@langleyfoxall/react-dynamic-data-table";
import { toggleSidebar, keepSidebar } from "features/User/UserSlice";
import {
  productListGet,
  createRecipe,
  updateRecipe,
  getRecipeDetails,
} from "api/api";
import { setLoader } from "features/User/UserSlice";
import Swal from "sweetalert2";
import { useHistory, useLocation } from "react-router-dom";
import React from "react";
import { BiPlus } from "react-icons/bi";
import AddProductModal from "pages/Product/AddProduct";

const CreateChallan = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const history = useHistory();
  const [rowIndex, setRowIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [showProduct, setShowProduct] = useState(false);
  const [invoiceId, setInvoiceId] = useState(0);
  const inputRef = useRef(null);

  const [upperData, setUpperData] = useState({
    product: "",
    pr: "",
  });
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [error, setError] = useState({ product: "" });
  const [rows, setRows] = useState([]);

  const location = useLocation();

  const handleToggleProduct = () => {
    setShowProduct(!showProduct);
  };

  useEffect(() => {
    setRows(rows);
  }, [products]);

  const addInvoice = async () => {
    if (upperData.product == "") {
      setError({ ...error, product: "Please Select product" });
    } else if (rows.length == 0 || rows[0].row.item == "") {
      Toast.fire({
        icon: "error",
        title: "Invalid Data in Rows",
      });
    } else {
      dispatch(setLoader(true));
      let resp;
      if (invoiceId > 0) {
        resp = await updateRecipe(
          user.token,
          {
            item: upperData.product,
            pr: upperData.pr,
            id: invoiceId,
          },
          JSON.stringify({
            item: rows.map((x) => x.row.item),
            type: rows.map((x) => x.row.type),
            subpr: rows.map((x) => x.row.subpr),
            prweste: rows.map((x) => x.row.prweste),
          })
        );
        dispatch(setLoader(false));
      } else {
        resp = await createRecipe(
          user.token,
          {
            item: upperData.product,
            pr: upperData.pr,
          },
          JSON.stringify({
            item: rows.map((x) => x.row.item),
            type: rows.map((x) => x.row.type),
            subpr: rows.map((x) => x.row.subpr),
            prweste: rows.map((x) => x.row.prweste),
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
          history.push(`/admin/${user.path}/product-recipes`);
        }, 1500);
      } else {
        Toast.fire({
          icon: "error",
          title: resp.data.msg || "Something went wrong",
        });
      }
    }
  };

  const getProducts = async () => {
    dispatch(setLoader(true));
    const data = await productListGet(user.token);
    setProducts(data.data);
    dispatch(setLoader(false));
  };

  useEffect(() => {
    getProducts();
    dispatch(keepSidebar(false));
    dispatch(toggleSidebar(false));
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
    if (urlSearchParams.has("recipe")) {
      const variable1Value = urlSearchParams.get("recipe");
      setInvoiceId(atob(variable1Value));
    } else {
      setRows([
        {
          id: rowIndex,
          row: {
            item: "",
            type: "",
            subpr: "",
            prweste: "",
            id: rowIndex,
          },
        },
      ]);
    }
  }, []);

  const fetchInvoiceData = async (invoiceId) => {
    dispatch(setLoader(true));
    const resp = await getRecipeDetails(user.token, invoiceId);
    dispatch(setLoader(false));
    const invoiceData = resp.data;
    const invoiceRows = resp.data.item;
    setUpperData({
      ...upperData,
      product: invoiceData.details?.item,
      pr: invoiceData.details?.pr,
    });

    const invoiceRowstoShow = [];
    invoiceRows.forEach((element, index) => {
      const product = products.find((x) => x.id == element.item);
      invoiceRowstoShow.push({
        id: index,
        row: {
          id: index,
          item: product?.id,
          type: element.type ?? "",
          subpr: element.subpr ?? "",
          prweste: element.prweste ?? "",
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

  return (
    <>
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
                  label="Product Name *"
                  type="select"
                  options={[
                    <option value="">Select Product</option>,
                    ...products.map((opt) => {
                      return <option value={opt.id}>{opt.item_name}</option>;
                    }),
                  ]}
                  errorMsg={error.product}
                  value={upperData.product}
                  onChange={(e) => {
                    setError({ ...error, product: "" });
                    setUpperData({ ...upperData, product: e.target.value });
                  }}
                  addon={
                    <Button
                      className="btn-sm btn-outline-primary"
                      onClick={handleToggleProduct}
                    >
                      <BiPlus />
                    </Button>
                  }
                />
              </Col>
              <Col xs="6" sm="4" lg="3">
                <CustomInputWoutFormik
                  label="PR"
                  value={upperData.pr}
                  onChange={(e) => {
                    setUpperData({
                      ...upperData,
                      pr: e.target.value,
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
                type: "9%",
                subpr: "9%",
                prweste: "9%",
              }}
              fieldsToExclude={["id"]}
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
                        }}
                      />
                    );

                  case "type":
                    return (
                      <CustomInputWoutFormik
                        type="select"
                        options={[
                          <option value="">Select Type</option>,
                          <option value="input">Input</option>,
                          <option value="output">Output</option>,
                        ]}
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                        }}
                      />
                    );
                  case "subpr":
                    return (
                      <CustomInputWoutFormik
                        type="text"
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                        }}
                      />
                    );
                  case "prweste":
                    return (
                      <CustomInputWoutFormik
                        type="text"
                        defaultValue={value}
                        onChange={(event) => {
                          row[field] = event.target.value;
                        }}
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
                                type: "",
                                subpr: "",
                                prweste: "",
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
                onClick={() =>
                  history.push(`/admin/${user.path}/product-recipes`)
                }
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

export default CreateChallan;
