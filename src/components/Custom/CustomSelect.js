import React, { Children, useEffect, useState } from "react";
import Select from "react-select";

const CustomSelect = ({
  allOptions,
  portal,
  selectedValue,
  getFilterData,
  handlechange,
  label,
}) => {
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setFilterData(getFilterData(search));
  }, [search, allOptions]);

  return (
    <>
      {label && <label className="form-control-label">{label}</label>}
      <Select
        menuPortalTarget={portal}
        classNamePrefix="customselect"
        value={
          selectedValue
            ? filterData.find((item) => item.value == selectedValue)
            : ""
        }
        inputValue={search}
        onInputChange={(val, action) => setSearch(val)}
        onChange={handlechange}
        options={filterData}
      />
    </>
  );
};

export default CustomSelect;
