import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import { productListGet, deleteRecord } from "api/api";

import ConfirmationDialog from "components/Custom/ConfirmationDialog";

import Loader from "components/Custom/Loader";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import AddProductModal from "./AddProduct";

const ProductList = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const [products, setProducts] = useState([]);
  const { user, fyear } = useSelector((store) => store.user);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const handleToggle = async () => {
    setShow(!show);
  };
  const handleShowConfirmation = () => {
    if (showDelete) {
      setProduct(null);
    }
    setShowDelete(!showDelete);
  };

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
          timer: null,
          showCloseButton: true,
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

  useEffect(() => {
    getProducts();
  }, [fyear]);

  useEffect(() => {
    if (sessionStorage.getItem("openAdd")) {
      setProduct(null);
      handleToggle();
      sessionStorage.removeItem("openAdd");
    }
  }, [sessionStorage.getItem("openAdd")]);
  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <ConfirmationDialog
          show={showDelete}
          handleToggle={handleShowConfirmation}
          title="Delete"
          handleOkay={deleteProduct}
          handleCancel={handleShowConfirmation}
        >
          Are You Sure you want to delete this ?
        </ConfirmationDialog>
        <AddProductModal
          show={show}
          handleToggle={handleToggle}
          callbackFunction={getProducts}
          product={product}
          Toast={Toast}
        />
        <Row sm="2" className="mb-2">
          <Col className="d-none d-sm-block"></Col>
          <Col>
            <Row className="justify-content-end mr-0">
              <Button
                className="btn-md btn-outline-primary"
                onClick={() => {
                  setProduct(null);
                  handleToggle();
                }}
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
