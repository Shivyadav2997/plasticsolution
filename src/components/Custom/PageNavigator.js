import React, { useEffect, useState } from "react";
import { FormGroup, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const PageNavigator = ({ className }) => {
  const dispatch = useDispatch();
  let history = useHistory();
  const { user } = useSelector((store) => store.user);
  const [curPage, setCurPage] = useState("");
  const pages = [
    { value: "Add Product", page: "product-list", param: true },
    { value: "Add Party", page: "party", param: true },
    { value: "Add Transport", page: "transporter", param: true },
    { value: "Add Bank", page: "bank", param: true },
    { value: "Receive Tr.", page: "transaction", param: 1 },
    { value: "Payment Tr.", page: "transaction", param: 2 },
    { value: "Add Expense", page: "expenses", param: true },
    { value: "Create Sale", page: "sales-invoice", param: 0 },
    { value: "Create Purchase", page: "purchase-invoice", param: 0 },
    { value: "Add Stock", page: "product-stock", param: true },
    { value: "Add Credit", page: "account", param: 1 },
    { value: "Add Debit", page: "account", param: 2 },
    { value: "Deposit", page: "balance", param: 2 },
    { value: "Withdrawl", page: "balance", param: 1 },
  ];
  const openPage = async (e) => {
    // setCurPage(e.target.value);
    const page = pages.find((x) => x.value == e.target.value);
    if (page.param) {
      sessionStorage.setItem("openAdd", page.param);
    }

    history.push(`/admin/${user.path}/${page.page}`);
    // switch (e.target.value) {
    //   case "Add Product":
    //     break;
    //   case "Add Party":
    //     break;
    //   case "Add Transport":
    //     break;
    //   case "Add Bank":
    //     break;
    //   case "Receive Tr.":
    //     break;
    //   case "Payment Tr.":
    //     break;
    //   case "Add Expense":
    //     break;
    //   case "Create Sale":
    //     break;
    //   case "Create Purchase":
    //     break;
    //   case "Add Stock":
    //     break;
    //   case "Add Credit":
    //     break;
    //   case "Add Debit":
    //     break;
    //   case "Deposit":
    //     break;
    //   case "Withdrawl":
    //     break;
    // }
  };

  return (
    <FormGroup className={className}>
      <Input type="select" bsSize="sm" onChange={openPage} value={curPage}>
        <option value="">Add</option>
        {pages.map((x, key) => {
          return (
            <option value={x.value} key={key}>
              {x.value}
            </option>
          );
        })}
      </Input>
    </FormGroup>
  );
};
export default PageNavigator;
