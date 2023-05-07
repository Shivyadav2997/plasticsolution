import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import { productStockGet, productStockEntryGet, productListGet } from "api/api";
import ReactDOM from "react-dom/client";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loader from "components/Custom/Loader";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import { format } from "date-fns";

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

  const inputRef = useRef(null);

  const dispatch = useDispatch();

  const getProducts = async () => {
    dispatch(setLoader(true));
    const data = await productListGet(user.token);
    setProducts(data.data);
    dispatch(setLoader(false));
  };

  const handleToggle = () => {
    if (show) {
      setProduct(null);
    } else {
      getProducts();
    }
    setShow(!show);
  };
  const handleShowConfirmation = () => {
    if (showDelete) {
      setProduct(null);
    }
    setShowDelete(!showDelete);
  };
  const validate = Yup.object({
    product: Yup.string().required("Required"),
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
    const data = await productStockGet(user.token);
    setProductStockList(data.data);
    setLoading(false);
  };

  const getIndividualStock = async () => {
    setLoading(true);
    const data = await productStockEntryGet(user.token);
    setproductStock(data.data);
    setLoading(false);
  };

  useEffect(() => {
    if (showAllStock) {
      getProductStock();
    } else {
      getIndividualStock();
    }
  }, [showAllStock, fyear]);

  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        {showAllStock ? (
          <>
            <CustomModal
              show={show}
              handleToggle={handleToggle}
              title={`${product ? "Edit" : "Add"} Stock`}
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
                  product: product?.id,
                  date: format(new Date(), "yyyy-MM-dd"),
                  qty: "",
                  curStock: product?.stock,
                }}
                validationSchema={validate}
                onSubmit={(values) => {
                  //   if (product) {
                  //     editProduct({ id: product.id, ...values });
                  //   } else {
                  //     addProduct(values);
                  //   }
                }}
                validateOnBlur={false}
                validateOnChange={false}
                innerRef={inputRef}
              >
                {(formik) => (
                  <div>
                    <Form>
                      <CustomInput
                        name="unit"
                        type="select"
                        label="Product"
                        options={[
                          <option value="">Select Product</option>,
                          ...products.map((opt) => {
                            return (
                              <option value={opt.id ? opt.id : 1}>
                                {opt.item_name}
                              </option>
                            );
                          }),
                        ]}
                      />
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
              //   handleOkay={deleteProduct}
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
                      //   columndefs={colDefs}
                      title="Product Stock List"
                      //   deleteClick={deleteClick}
                      //   editClick={editClick}
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
