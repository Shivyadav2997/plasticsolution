import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import {
  productListGet,
  productAdd,
  productEdit,
  deleteRecord,
  productUnitGet,
} from "api/api";
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

const ProductList = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const { user, fyear } = useSelector((store) => store.user);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  const dispatch = useDispatch();

  const getProductUnits = async () => {
    dispatch(setLoader(true));
    var data = await productUnitGet(user.token);
    dispatch(setLoader(false));
    if (data.data) {
      setUnits(data.data);
    }
  };

  const handleToggle = async () => {
    if (show) {
      setProduct(null);
    } else {
      await getProductUnits();
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
    item_name: Yup.string().required("Required"),
    item_type: Yup.string().required("Required"),
    unit: Yup.string().required("Required"),
    hsn: Yup.number().required("Required"),
    // gst: Yup.string().required("Required"),
  });

  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Item",
      data: "item_name",
      className: "all",
    },
    {
      title: "Type",
      data: "item_type",
    },
    {
      title: "Unit",
      data: "unit",
    },
    {
      title: "HSN",
      data: "hsn",
    },
    {
      title: "GST %",
      data: "gst",
    },
    {
      title: "Description",
      data: "description",
    },
    {
      title: "Action",
      data: null,
    },
  ];

  const deleteProduct = async () => {
    if (product != null) {
      handleShowConfirmation();
      dispatch(setLoader(true));
      const resp = await deleteRecord(user.token, {
        type: "product",
        id: product.id,
      });

      if (resp.data.sucess == 1) {
        Toast.fire({
          icon: "success",
          title: resp.message,
        });
        getProducts();
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

  const editClick = (cellData, rowData, row, col) => {
    setProduct(cellData);
    handleToggle();
  };

  const getProducts = async () => {
    setLoading(true);
    const data = await productListGet(user.token);
    setProducts(data.data);
    setLoading(false);
  };

  const addProduct = async (payload) => {
    dispatch(setLoader(true));
    const resp = await productAdd(user.token, payload);
    dispatch(setLoader(false));
    handleToggle();

    if (resp.data.success == 1) {
      Toast.fire({
        icon: "success",
        title: "Product Added Successfully",
      });
      handleToggle();
      getProducts();
    } else {
      Toast.fire({
        icon: "error",
        title: "Something wen't wrong",
      });
    }
  };

  const editProduct = async (payload) => {
    dispatch(setLoader(true));
    const resp = await productEdit(user.token, payload);
    dispatch(setLoader(false));
    Toast.fire({
      icon: resp.data.success == 1 ? "success" : "error",
      title: resp.message || "Product Updated Successfully",
    });
    if (resp.data.success == 1) {
      handleToggle();
      getProducts();
    }
  };

  useEffect(() => {
    getProducts();
  }, [fyear]);

  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <CustomModal
          show={show}
          handleToggle={handleToggle}
          title={`${product ? "Edit" : "Add"} Product`}
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
              item_name: product?.item_name,
              item_type: product ? product.item_type : "Goods",
              unit: product?.unit,
              hsn: product?.hsn,
              gst: product?.gst,
              description: product?.description,
              srate: product?.srate,
              prate: product?.srate,
              mstock: product?.mstock,
            }}
            validationSchema={validate}
            onSubmit={(values) => {
              if (product) {
                editProduct({ id: product.id, ...values });
              } else {
                addProduct(values);
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
                    placeholder="Sale Rate"
                    label="Sale Rate"
                    name="srate"
                    type="text"
                  />
                  <CustomInput
                    placeholder="Purchase Rate"
                    label="Purchase Rate"
                    name="prate"
                    type="text"
                  />
                  <CustomInput
                    placeholder="Minimum Stock"
                    label="Minimum Stock"
                    name="mstock"
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
        <ConfirmationDialog
          show={showDelete}
          handleToggle={handleShowConfirmation}
          title="Delete"
          handleOkay={deleteProduct}
          handleCancel={handleShowConfirmation}
        >
          Are You Sure you want to delete this ?
        </ConfirmationDialog>
        <Row sm="2" className="mb-2">
          <Col className="d-none d-sm-block"></Col>
          <Col>
            <Row className="justify-content-end mr-0">
              <Button
                className="btn-md btn-outline-primary"
                onClick={handleToggle}
              >
                Add Product
              </Button>
              <Button className="btn-md btn-outline-default">Add File</Button>
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
                  data={products}
                  //   columndefs={colDefs}
                  title="Product List"
                  deleteClick={deleteClick}
                  editClick={editClick}
                />
              </div>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default ProductList;
