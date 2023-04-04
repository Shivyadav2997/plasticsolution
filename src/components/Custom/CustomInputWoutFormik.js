import React from "react";
import { Input, FormGroup } from "reactstrap";

export const CustomInputWoutFormik = ({ label, options, size, ...props }) => {
  return (
    <>
      <FormGroup className="mb-1">
        {label && (
          <label className="form-control-label" htmlFor={props.id}>
            {label}
          </label>
        )}

        <Input bsSize={size || "sm"} {...props}>
          {options}
        </Input>
      </FormGroup>
    </>
  );
};
