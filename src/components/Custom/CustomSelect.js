import React, { Children, useEffect, useState } from "react";
import Select from "react-select";

const CustomSelect = ({
  allOptions,
  portal,
  selectedValue,
  getFilterData,
  handlechange,
}) => {
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setFilterData(getFilterData(search));
  }, [search, allOptions]);

  return (
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
  );
};

export default CustomSelect;
