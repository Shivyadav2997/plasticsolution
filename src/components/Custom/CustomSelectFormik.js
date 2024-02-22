import React, { Children, useEffect, useState } from "react";
import Select from "react-select";
import { Input, FormGroup } from "reactstrap";
import { ErrorMessage, useField } from "formik";

const CustomSelect = ({
  allOptions,
  portal,
  getFilterData,
  disabled,
  label,
  handlechange,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setFilterData(getFilterData(search));
  }, [search, allOptions]);

  useEffect(() => {
    console.log("bheem", field, props);
  }, [field, props]);

  const handleChange = (option) => {
    helpers.setValue(option.value);
  };

  return (
    <FormGroup className="mb-1">
      {label && (
        <label className="form-control-label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <Select
        {...field}
        {...props}
        menuPortalTarget={portal}
        classNamePrefix="customselect"
        value={
          field.value
            ? filterData.find((item) => item.value == field.value)
            : ""
        }
        inputValue={search}
        onInputChange={(val, action) => setSearch(val)}
        options={filterData}
        onChange={handleChange}
        isDisabled={disabled ?? false}
        onBlur={() => helpers.setTouched(true)}
      />
    </FormGroup>
  );
};

export default CustomSelect;
