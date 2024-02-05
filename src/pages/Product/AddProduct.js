import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as React from "react";
import { useState } from "react";
import { productAdd, productEdit, productUnitGet } from "api/api";
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

const AddProduct = ({
  show,
  product,
  Toast,
  callbackFunction,
  handleToggle,
}) => {
  const validate = Yup.object({
    item_name: Yup.string().required("Required"),
    item_type: Yup.string().required("Required"),
    unit: Yup.string().required("Required"),
    hsn: Yup.number().required("Required"),
    // gst: Yup.string().required("Required"),
  });

  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [units, setUnits] = useState([]);
  const { user, fyear } = useSelector((store) => store.user);
  const getProductUnits = async () => {
    dispatch(setLoader(true));
    var data = await productUnitGet(user.token);
    dispatch(setLoader(false));
    if (data.data) {
      setUnits(data.data);
    }
  };

  const addProductApi = async (payload) => {
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
      //   getProducts();
      if (callbackFunction) {
        callbackFunction();
      }
    } else {
      Toast.fire({
        icon: "error",
        timer: null,
        showCloseButton: true,
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
      //   getProducts();
      if (callbackFunction) {
        callbackFunction();
      }
    }
  };

  useEffect(() => {
    if (show) {
      getProductUnits();
    }
  }, [show]);
  return (
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
            addProductApi(values);
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
  );
};

export default AddProduct;
