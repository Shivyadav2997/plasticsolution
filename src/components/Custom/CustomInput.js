import React from "react";
import { Input, FormGroup } from "reactstrap";
import { ErrorMessage, useField } from "formik";

export const CustomInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <FormGroup className="mb-1">
        <Input
          className="form-control-alternative has-error"
          {...field}
          {...props}
        />
        <ErrorMessage
          component="label"
          name={field.name}
          className="errorMsg"
        />
      </FormGroup>
    </>
  );
};
