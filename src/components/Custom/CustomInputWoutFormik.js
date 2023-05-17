import React from "react";
import { Input, FormGroup } from "reactstrap";

export const CustomInputWoutFormik = ({
  label,
  options,
  size,
  withFormGroup,
  ref,
  ...props
}) => {
  return (
    <>
      {withFormGroup === false ? (
        <Input {...props}>{options}</Input>
      ) : (
        <FormGroup className="mb-1">
          {label && (
            <label className="form-control-label" htmlFor={props.id}>
              {label}
            </label>
          )}

          <Input bsSize={size || "sm"} innerRef={ref} {...props}>
            {options}
          </Input>
        </FormGroup>
      )}
    </>
  );
};
