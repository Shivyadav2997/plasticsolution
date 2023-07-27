import React from "react";
import { Input, FormGroup, InputGroup, InputGroupAddon } from "reactstrap";

export const CustomInputWoutFormik = ({
  label,
  options,
  size,
  withFormGroup,
  ref,
  errorMsg = "",
  addon,
  ...props
}) => {
  const errorClass = errorMsg != "" ? "has-error" : "";
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
          {addon ? (
            <InputGroup>
              <Input
                className={errorClass}
                bsSize={size || "sm"}
                innerRef={ref}
                {...props}
              >
                {options}
              </Input>
              <InputGroupAddon addonType="append">{addon}</InputGroupAddon>
            </InputGroup>
          ) : (
            <Input
              className={errorClass}
              bsSize={size || "sm"}
              innerRef={ref}
              {...props}
            >
              {options}
            </Input>
          )}
        </FormGroup>
      )}
    </>
  );
};
