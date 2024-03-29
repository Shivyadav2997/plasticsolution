import React, { useEffect, useState } from "react";
import { FormGroup, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import { setLoader, setFyear } from "features/User/UserSlice";
import { yearChange } from "api/api";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const FinancialYear = ({ className }) => {
  const { fyear, user } = useSelector((store) => store.user);
  const [curYear, setCurYear] = useState(fyear);
  const changeYear = async (e) => {
    setCurYear(e.target.value);
    dispatch(setLoader(true));
    await yearChange({ token: user.token, d: e.target.value });
    dispatch(setFyear(e.target.value));
    dispatch(setLoader(false));
  };

  const [years, setYears] = useState([]);
  const dispatch = useDispatch();
  function getFinancialYear(pastYear = false) {
    var fiscalyear = "";
    var today = new Date();
    if (pastYear) {
      today = new Date(new Date().setFullYear(today.getFullYear() - 1));
    }
    if (today.getMonth() + 1 <= 3) {
      fiscalyear =
        (today.getFullYear() - 1).toString().substring(2, 4) +
        "-" +
        today.getFullYear().toString().substring(2, 4);
    } else {
      fiscalyear =
        today.getFullYear().toString().substring(2, 4) +
        "-" +
        (today.getFullYear() + 1).toString().substring(2, 4);
    }
    return fiscalyear;
  }
  useEffect(() => {
    const curYears = [];
    curYears.push(getFinancialYear(true));
    curYears.push(getFinancialYear());
    setYears(curYears);
  }, []);
  return (
    <FormGroup className={className}>
      <Input
        type="select"
        bsSize="sm"
        onChange={(e) => changeYear(e)}
        defaultValue={curYear}
        value={curYear}
      >
        {years.map((x, key) => {
          return (
            <option value={x} key={key}>
              {x}
            </option>
          );
        })}
      </Input>
    </FormGroup>
  );
};

export default FinancialYear;
