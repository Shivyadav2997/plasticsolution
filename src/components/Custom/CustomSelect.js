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
    let filterDataSearch = getFilterData(search);
    if (selectedValue) {
      const isExists = filterDataSearch.find(
        (item) => item.value == selectedValue
      );
      console.log(
        "selected",
        isExists,
        allOptions.find((item) => item.id == selectedValue)
      );
      if (!isExists) {
        const selectedOption = allOptions.find(
          (item) => item.id == selectedValue
        );
        filterDataSearch.push({
          value: selectedOption.id,
          label: selectedOption.item_name,
        });
      }
    }
    setFilterData(filterDataSearch);
  }, [search, allOptions, selectedValue]);

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
