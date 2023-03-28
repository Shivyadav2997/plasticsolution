import axios from "axios";
import React from "react";
import {
  userLoginAction,
  partyListAction,
  transactionListAction,
  partyAddAction,
  deleteAction,
  partyEditAction,
  transactionPartyAction,
  transactionRecieveAction,
  transactionPaymentAction,
  expensesListAction,
  expenseAddAction,
  userLogoutAction,
} from "./action.js";

const baseUrltest = "https://jsonplaceholder.typicode.com/";
const baseUrl = process.env.REACT_APP_API_URL;
const key = "accountdigi9868";

const getParams = (payload) => {
  const strParams = Object.keys(payload).map((k) => {
    return payload[k] ? `${k}=${payload[k]}` : "";
  });
  return strParams.join("&");
};
const getData = async (type) => {
  try {
    const resp = await axios.get(baseUrltest + type);
    return {
      data: resp.data,
      message: "Data found success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Data not found",
    };
  }
};

const loginApi = async (uname, pass) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${userLoginAction}&key=${key}&u=${uname}&p=${pass}`
    );
    return resp.data;
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const logoutApi = async () => {
  try {
    const resp = await axios.get(baseUrl + `?action=${userLogoutAction}`);
    return resp.data;
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const partyListGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${partyListAction}&token=${token}`
    );
    return {
      data: resp.data,
      message: "Api call success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const partyAdd = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${partyAddAction}&token=${token}&${getParams(payload)}`
    );

    return {
      data: resp.data,
      message: resp.data.msg,
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const partyEdit = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${partyEditAction}&token=${token}&${getParams(payload)}`
    );
    return {
      data: resp.data,
      message: resp.data.msg,
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const deleteRecord = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${deleteAction}&token=${token}&${getParams(payload)}`
    );
    return {
      data: resp.data,
      message: resp.data.msg,
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const transactionListget = async (token, st = "", en = "") => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${transactionListAction}&token=${token}&st=${st}&en=${en}`
    );
    return {
      data: resp.data,
      message: "Api call success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const transactionPartyGet = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${transactionPartyAction}&token=${token}`
    );
    return {
      data: resp.data,
      message: "Api call success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const transactionRecieveAdd = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${transactionRecieveAction}&token=${token}&${getParams(
          payload
        )}`
    );

    return {
      data: resp.data,
      message: resp.data.msg,
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const transactionPaymentAdd = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${transactionPaymentAction}&token=${token}&${getParams(
          payload
        )}`
    );

    return {
      data: resp.data,
      message: resp.data.msg,
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const expensesListGet = async (token, st = "", en = "") => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${expensesListAction}&token=${token}&st=${st}&en=${en}`
    );
    return {
      data: resp.data,
      message: "Api call success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const expenseAdd = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${expenseAddAction}&token=${token}&${getParams(payload)}`
    );

    return {
      data: resp.data,
      message: resp.data.msg,
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

export {
  getData,
  loginApi,
  logoutApi,
  partyListGet,
  transactionListget,
  partyAdd,
  partyEdit,
  deleteRecord,
  transactionPartyGet,
  transactionRecieveAdd,
  transactionPaymentAdd,
  expensesListGet,
  expenseAdd,
};
