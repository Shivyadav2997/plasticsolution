import React from "react";
import { Input, FormGroup } from "reactstrap";
import { ErrorMessage, useField } from "formik";

export const CustomInput = ({ label, showError, options, size, ...props }) => {
  const [field, meta] = useField(props);
  const errorClass = meta.error != undefined ? "has-error" : "";
  return (
    <>
      <FormGroup className="mb-1">
        {label && (
          <label className="form-control-label" htmlFor={props.id}>
            {label}
          </label>
        )}

        <Input
          bsSize={size || "sm"}
          className={`form-control-alternative ${errorClass}`}
          {...field}
          {...props}
        >
          {options}
        </Input>
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
