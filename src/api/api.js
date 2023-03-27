import axios from "axios";
import React from "react";
import {
  userLoginAction,
  partyListAction,
  transactionListAction,
  partyAddAction,
  deleteAction,
  partyEditAction,
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
    console.log(resp);
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

export {
  getData,
  loginApi,
  partyListGet,
  transactionListget,
  partyAdd,
  partyEdit,
  deleteRecord,
};
