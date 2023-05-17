import React from "react";
import { Input, FormGroup } from "reactstrap";
import { ErrorMessage, useField } from "formik";

export const CustomInput = ({
  label,
  showError,
  options,
  size,
  withFormGroup,
  ...props
}) => {
  const [field, meta] = useField(props);
  const errorClass = meta.error != undefined ? "has-error" : "";
  return (
    <>
      {withFormGroup === false ? (
        <>
          <Input
            // bsSize={size || "sm"}
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
        </>
      ) : (
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
      )}
    </>
  );
};
