import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendWhatsappMsg } from "api/api";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { setLoader } from "features/User/UserSlice";

const WhatsappModal = ({
  show,
  handleToggle,
  title,
  mobile,
  msg,
  withMsg,
  api,
  params,
}) => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const validate = Yup.object({
    mo: Yup.string()
      .required("Required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
    msg: withMsg ? Yup.string().required("Required") : null,
  });
  const sendWhatsapp = async (payload) => {
    if (api) {
      api(...params, payload.mo);
    } else {
      dispatch(setLoader(true));
      const resp = await sendWhatsappMsg(user.token, {
        mo: payload.mo,
        msg: payload.msg,
      });
      dispatch(setLoader(false));
      if (resp.data.sucess == 1) {
        handleToggle();
        Toast.fire({
          icon: "success",
          title: resp.message,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: resp.message,
        });
      }
    }
  };
  return (
    <CustomModal
      show={show}
      title={title ?? "Send Whatsapp"}
      handleToggle={handleToggle}
      footer={
        <Button
          type="submit"
          className="mr-1"
          color="primary"
          block
          size="md"
          onClick={() => formRef.current.handleSubmit()}
        >
          Send
        </Button>
      }
    >
      <Formik
        initialValues={{
          mo: mobile,
          msg: msg,
        }}
        validationSchema={validate}
        onSubmit={(values) => {
          sendWhatsapp(values);
        }}
        innerRef={formRef}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {(formik) => (
          <div>
            <Form>
              <CustomInput
                placeholder="Mobile"
                name="mo"
                type="number"
                label="Mobile"
                maxLength={10}
              />

              {withMsg && (
                <CustomInput
                  placeholder="Message"
                  name="msg"
                  type="textarea"
                  label="Message"
                  rows="5"
                />
              )}
            </Form>
          </div>
        )}
      </Formik>
    </CustomModal>
  );
};

export default WhatsappModal;
