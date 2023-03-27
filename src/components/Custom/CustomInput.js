import React from "react";
import { Input, FormGroup } from "reactstrap";
import { ErrorMessage, useField } from "formik";

export const CustomInput = ({ label, showError, ...props }) => {
  const [field, meta] = useField(props);
  const errorClass = meta.error != undefined ? "has-error" : "";
  return (
    <>
      <FormGroup className="mb-1">
        <Input
          className={`form-control-alternative ${errorClass}`}
          {...field}
          {...props}
        />
        {showError && (
          <ErrorMessage
            component="label"
            name={field.name}
            className="errorMsg"
          />
        )}
      </FormGroup>
    </>
  );
};
