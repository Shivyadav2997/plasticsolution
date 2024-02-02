import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import {
  productStockGet,
  productStockEntryGet,
  productListGet,
  addUseProductStock,
  deleteRecord,
} from "api/api";
import ReactDOM from "react-dom/client";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loader from "components/Custom/Loader";
import { FaPlus, FaCopy } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import { format } from "date-fns";
import CustomDatePicker from "components/Custom/CustomDatePicker";

const ProductStock = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const [productStockList, setProductStockList] = useState([]);
  const [productStock, setproductStock] = useState([]);
  const [products, setProducts] = useState([]);
  const { user, fyear } = useSelector((store) => store.user);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllStock, setShowAllStock] = useState(true);
  const [addType, setAddType] = useState(1);
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const inputRef = useRef(null);

  const dispatch = useDispatch();

  const getProducts = async () => {
    dispatch(setLoader(true));
    const data = await productListGet(user.token);
    setProducts(data.data);
    dispatch(setLoader(false));
  };

  const handleToggle = async () => {
    if (show) {
      setProduct(null);
    } else {
      setAddType(1);
      await getProducts();
    }
    setShow(!show);
  };

  const addUseProduct = async (productEdit, type) => {
    if (!show) {
      await getProducts();
      setAddType(type);
      setProduct(productEdit);
    }
    setShow(!show);
  };

  const addUseStock = async (payload) => {
    dispatch(setLoader(true));
    const resp = await addUseProductStock(user.token, payload);
    dispatch(setLoader(false));
    handleToggle();

    if (resp.data.success == 1) {
      Toast.fire({
        icon: "success",
        title:
          addType == 1 ? "Stock Added Successfully" : "Stock Used Successfully",
      });
      handleToggle();
      getProductStock();
    } else {
      Toast.fire({
        icon: "error",
        title: "Something wen't wrong",
      });
    }
  };

  const handleShowConfirmation = () => {
    if (showDelete) {
      setProduct(null);
    }
    setShowDelete(!showDelete);
  };
  const validate = Yup.object({
    productid: Yup.string().required("Required"),
    date: Yup.date().required("Required"),
    qty: Yup.number().required("Required"),
  });

  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Name",
      data: "name",
      className: "all",
    },
    {
      title: "Stock",
      data: "stock",
    },
    {
      title: "Unit",
      data: "unit",
    },
    {
      title: "Date",
      data: "date",
    },
    {
      title: "Action",
      data: null,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        root.render(
          <>
            {" "}
            <div className="d-flex gap-10">
              <div>
                <Button
                  className="btn-outline-primary btn-icon btn-sm"
                  color="default"
                  onClick={() => addUseProduct(rowData, 1)}
                >
                  <span>
                    <FaPlus size={12} /> Add
                  </span>
                </Button>
              </div>
              <div>
                <Button
                  className="btn-outline-info btn-icon btn-sm"
                  onClick={() => addUseProduct(rowData, 2)}
                >
                  <span>
                    <FaCopy size={12} /> Use
                  </span>
                </Button>
              </div>
              <div>
                <Button
                  className="btn-danger btn-icon btn-sm"
                  onClick={() => deleteClick(cellData, rowData, row, col)}
                >
                  <span>
                    <MdDelete size={16} />
                  </span>
                </Button>
              </div>
            </div>
          </>
        );
      },
      className: "all",
    },
  ];
  const columns2 = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Name",
      data: "name",
      className: "all",
    },
    {
      title: "Type",
      data: "type",
    },
    {
      title: "Stock Type",
      data: "stock_type",
    },
    {
      title: "Qty",
      data: "qty",
      className: "all",
    },
    {
      title: "Date",
      data: "date",
    },
  ];

  const getProductStock = async () => {
    setLoading(true);
    const data = await productStockGet(
      user.token,
      filterDate.st,
      filterDate.et
    );
    setProductStockList(data.data);
    setLoading(false);
  };

  const getIndividualStock = async () => {
    setLoading(true);
    const data = await productStockEntryGet(
      user.token,
      filterDate.st,
      filterDate.et
    );
    setproductStock(data.data);
    setLoading(false);
  };

  const deleteStock = async () => {
    if (product != null) {
      handleShowConfirmation();
      dispatch(setLoader(true));
      const resp = await deleteRecord(user.token, {
        type: "productstock",
        id: product.id,
      });

      if (resp.data.sucess == 1) {
        Toast.fire({
          icon: "success",
          title: resp.message,
        });
        getProductStock();
        setProduct(null);
        dispatch(setLoader(false));
      } else {
        Toast.fire({
          icon: "error",
          title: resp.message,
        });
      }
    }
  };

  const deleteClick = (cellData, rowData, row, col) => {
    setProduct(cellData);
    handleShowConfirmation();
  };

  useEffect(() => {
    if (showAllStock) {
      getProductStock();
    } else {
      getIndividualStock();
    }
  }, [showAllStock, fyear, filterDate]);

  const dateSelect = (start, end) => {
    setFilterDate({
      st: format(start.toDate(), "yyyy-MM-dd"),
      et: format(end.toDate(), "yyyy-MM-dd"),
    });
  };

  useEffect(() => {
    if (sessionStorage.getItem("openAdd")) {
      handleToggle();
      sessionStorage.removeItem("openAdd");
    }
  }, [sessionStorage.getItem("openAdd")]);

  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        {showAllStock ? (
          <>
            <CustomModal
              show={show}
              handleToggle={handleToggle}
              title={`${addType == 1 ? "Add" : "Use"} Stock`}
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
                  productid: Number(product?.id),
                  date: format(new Date(), "yyyy-MM-dd"),
                  qty: "",
                  curStock: product?.stock,
                }}
                validationSchema={validate}
                onSubmit={(values) => {
                  if (addType == 1) {
                    addUseStock({
                      type: "ADD",
                      ...values,
                    });
                  } else {
                    addUseStock({
                      type: "USE",
                      ...values,
                    });
                  }
                }}
                validateOnBlur={false}
                validateOnChange={false}
                innerRef={inputRef}
              >
                {(formik) => (
                  <div>
                    <Form>
                      <CustomInput
                        name="productid"
                        type="select"
                        label="Product"
                        disabled={product != null}
                        options={[
                          <option value="">Select Product</option>,
                          ...products.map((opt) => {
                            return (
                              <option value={opt.id}>{opt.item_name}</option>
                            );
                          }),
                        ]}
                      />
                      {product != null && (
                        <CustomInput
                          placeholder="Quantity"
                          label="Stock"
                          name="curStock"
                          type="number"
                          disabled={true}
                        />
                      )}
                      <CustomInput
                        placeholder="Quantity"
                        label="Quantity"
                        name="qty"
                        type="number"
                      />
                      <CustomInput
                        placeholder="Date"
                        label="Date"
                        name="date"
                        type="date"
                      />
                    </Form>
                  </div>
                )}
              </Formik>
            </CustomModal>
            <ConfirmationDialog
              show={showDelete}
              handleToggle={handleShowConfirmation}
              title="Delete"
              handleOkay={deleteStock}
              handleCancel={handleShowConfirmation}
            >
              Are You Sure you want to delete this ?
            </ConfirmationDialog>
            <Row sm="2" className="mb-2">
              <Col>
                <Row className="ml-0 mb-1">
                  <Button
                    className="btn-md btn-outline-primary"
                    onClick={() => setShowAllStock(false)}
                  >
                    Stock Entry
                  </Button>
                  <CustomDatePicker
                    onCallback={dateSelect}
                    text="Product Stocks By Date"
                  />
                  {filterDate.st != "" && (
                    <Button
                      className="btn-md btn-outline-primary mb-1"
                      onClick={() => setFilterDate({ st: "", et: "" })}
                    >
                      All Product Stocks
                    </Button>
                  )}
                  <h1>
                    <span style={{ fontSize: "18px" }}>
                      {filterDate.st != "" &&
                        ` (${filterDate.st} to ${filterDate.et})`}
                    </span>{" "}
                  </h1>
                </Row>
              </Col>
              <Col>
                <Row className="justify-content-end mr-0">
                  <Button
                    className="btn-md btn-outline-primary"
                    onClick={handleToggle}
                  >
                    Add Stock
                  </Button>
                </Row>
              </Col>
            </Row>
            {loading ? (
              <Loader loading={loading} />
            ) : (
              <>
                <Row>
                  <div className="col">
                    <CustomTable
                      cols={columns}
                      dark={false}
                      data={productStockList}
                      title="Product Stock List"
                      hasEdit={false}
                      hasDelete={false}
                    />
                  </div>
                </Row>
              </>
            )}
          </>
        ) : (
          <>
            <Row sm="2" className="mb-2">
              <Col>
                <Row className="ml-0">
                  <Button
                    className="btn-md btn-outline-primary"
                    onClick={() => setShowAllStock(true)}
                  >
                    Product Stock
                  </Button>
                  <CustomDatePicker
                    onCallback={dateSelect}
                    text="Stock Entry By Date"
                  />
                  {filterDate.st != "" && (
                    <Button
                      className="btn-md btn-outline-primary mb-1"
                      onClick={() => setFilterDate({ st: "", et: "" })}
                    >
                      All Stock Entry
                    </Button>
                  )}
                  <h1>
                    <span style={{ fontSize: "18px" }}>
                      {filterDate.st != "" &&
                        ` (${filterDate.st} to ${filterDate.et})`}
                    </span>{" "}
                  </h1>
                </Row>
              </Col>
            </Row>
            {loading ? (
              <Loader loading={loading} />
            ) : (
              <Row>
                <div className="col">
                  <div>
                    <CustomTable
                      cols={columns2}
                      dark={false}
                      data={productStock}
                      title="Stock Entry"
                      hasEdit={false}
                      hasDelete={false}
                    />
                  </div>
                </div>
              </Row>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default ProductStock;
