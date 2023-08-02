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
  saleListAction,
  purchaseListAction,
  homeAction,
  homeLinkAction,
  accountListAction,
  creditDebitListAction,
  daybookAction,
  forgotPassAction,
  yearChangeAction,
  balanceAction,
  balanceEntryAction,
  bankListAction,
  bankNameAction,
  bankAddAction,
  bankUpdateAction,
  balanceUpdateAction,
  productListAction,
  productAddAction,
  productEditAction,
  productUnitAction,
  productStockAction,
  productStockEntryAction,
  creditDebitAction,
  addUseStock,
  viewaccountAction,
  viewProfileAction,
  registerAction,
  sendOtpAction,
  checkGSTAction,
  updateProfileAction,
  updatePassAction,
  createInvoiceAction,
  getBillAction,
  viewSettingsAction,
  updateSettingAction,
  productionAction,
  gstAction,
  gstMonthAction,
  transportListAction,
  transportAddAction,
  transportEditAction,
  ewayAddEditAction,
  ewayGetAction,
  createewayAction,
} from "./action.js";

const baseUrltest = "https://jsonplaceholder.typicode.com/";
const baseUrl = process.env.REACT_APP_API_URL_V2;
const baseInvoiceUrl = process.env.REACT_APP_INVOICE_URL_V2;
const baseInvoiceDownloadUrl = process.env.REACT_APP_INVOICE_DOWNLOAD_URL_V2;
const key = "accountdigi9868";

const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString("en-US", { month: "long" });
};
const getParams = (payload) => {
  const strParams = Object.keys(payload).map((k) => {
    return `${k}=${payload[k]}`;
  });
  return strParams.join("&");
};
const getData = async (type) => {
  try {
    const resp = await axios.get(baseUrltest + type);
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const partyListGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${partyListAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const purchaseListGet = async (token, st = "", en = "", m = "") => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${purchaseListAction}&token=${token}&st=${st}&en=${en}&m=${m}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const saleListGet = async (token, st = "", en = "", m = "") => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${saleListAction}&token=${token}&st=${st}&en=${en}&m=${m}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const dashboardDataGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${homeAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const dashboardSendReport = async (token, type, d, dt = null) => {
  try {
    let apiurlsend =
      baseUrl + `?action=${homeLinkAction}&token=${token}&type=${type}&d=${d}`;
    if (dt != null) {
      apiurlsend += `&dt=${dt}`;
    }
    const resp = await axios.get(apiurlsend);
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const accountListGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${accountListAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const creditDebitListGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${creditDebitListAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return {
      data: resp.data,
      message: "Api success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const daybookGet = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${daybookAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return {
      data: resp.data,
      message: "Api success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const forgotPassSend = async (payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${forgotPassAction}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return {
      data: resp.data,
      message: "Api success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const yearChange = async (payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${yearChangeAction}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return {
      data: resp.data,
      message: "Api success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const productListGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${productListAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return {
      data: resp.data,
      // data: [],
      message: "Api call success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const productUnitGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${productUnitAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return {
      data: resp.data,
      // data: [],
      message: "Api call success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const productAdd = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${productAddAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    // return {
    //   data: [],
    //   message: "Api call success",
    // };
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

const productEdit = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${productEditAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const productStockGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${productStockAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return {
      data: resp.data,
      // data: [],
      message: "Api call success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const productStockEntryGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${productStockEntryAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return {
      data: resp.data,
      // data: [],
      message: "Api call success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const productionGet = async (token, st = "", en = "") => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${productionAction}&token=${token}&st=${st}&en=${en}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return {
      data: resp.data,
      // data: [],
      message: "Api call success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const bankListGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${bankListAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const bankNameGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${bankNameAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const balanceListGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${balanceAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const balanceEntryListGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${balanceEntryAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const balanceUpdate = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${balanceUpdateAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const bankAdd = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${bankAddAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const bankUpdate = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${bankUpdateAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const addCreditDebit = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${creditDebitAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const addUseProductStock = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${addUseStock}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const viewaccount = async (token, id, st = "", en = "") => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${viewaccountAction}&token=${token}&id=${id}&st=${st}&en=${en}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return {
      data: resp.data,
      // data: [],
      message: "Api call success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const profileGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${viewProfileAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return {
      data: resp.data,
      // data: [],
      message: "Api call success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const registerUser = async (payload, logo = null) => {
  try {
    const formData = new FormData();
    if (logo != null) {
      formData.append("files", logo);
    }

    const resp = await axios.post(
      baseUrl + `?action=${registerAction}&${getParams(payload)}`,
      formData
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

const sendOtp = async (payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${sendOtpAction}&${getParams(payload)}`
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

const checkGST = async (gst) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${checkGSTAction}&gst=${gst}`
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

const updateProfile = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${updateProfileAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const updatePassword = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${updatePassAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const getBillNo = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${getBillAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

function objectToFormData(obj) {
  const formData = new FormData();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      formData.append(`${key}[]`, obj[key]);
    }
  }

  return formData;
}

const createInvoice = async (token, payload, json) => {
  try {
    // const formData = objectToFormData(json);
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${createInvoiceAction}&token=${token}&${getParams(payload)}`,
      formData
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const getSettings = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${viewSettingsAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const updateSettings = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${updateSettingAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const invoiceGet = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseInvoiceUrl + `?token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const invoiceDownload = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseInvoiceDownloadUrl + `?token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const daybookDownload = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${homeLinkAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const gstListGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${gstAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const gstMonthListGet = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${gstMonthAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const accountpdf = async (token, id, type, d, t, st = null, en = null) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${homeLinkAction}&token=${token}&id=${id}&type=${type}&d=${d}&t=${t}`;
    if (st != null) {
      apiurlsend += `&st=${st}`;
    }
    if (en != null) {
      apiurlsend += `&en=${en}`;
    }
    const resp = await axios.get(apiurlsend);
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const salejson = async (token, id, d) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${homeLinkAction}&token=${token}&id=${id}&type=11&d=${d}`;

    const resp = await axios.get(apiurlsend);
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const gstr1json = async (token, id, d) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${homeLinkAction}&token=${token}&m1=${id}&type=12&d=${d}`;

    const resp = await axios.get(apiurlsend);
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const balanceView = async (token, id, d) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${homeLinkAction}&token=${token}&id=${id}&type=13&d=${d}`;

    const resp = await axios.get(apiurlsend);
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const transportListGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${transportListAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const transportAdd = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${transportAddAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const transportEdit = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${transportEditAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const ewayGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${ewayGetAction}&token=${token}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const ewayAddEdit = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${ewayAddEditAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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

const ewayCreate = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${createewayAction}&token=${token}&${getParams(payload)}`
    );
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
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
  getMonthName,
  getData,
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
  purchaseListGet,
  saleListGet,
  dashboardDataGet,
  dashboardSendReport,
  accountListGet,
  creditDebitListGet,
  daybookGet,
  forgotPassSend,
  yearChange,
  productListGet,
  productUnitGet,
  productAdd,
  productEdit,
  productStockGet,
  productStockEntryGet,
  productionGet,
  balanceListGet,
  balanceEntryListGet,
  bankListGet,
  bankNameGet,
  bankAdd,
  bankUpdate,
  balanceUpdate,
  addCreditDebit,
  addUseProductStock,
  viewaccount,
  profileGet,
  registerUser,
  sendOtp,
  checkGST,
  updateProfile,
  updatePassword,
  getBillNo,
  createInvoice,
  getSettings,
  updateSettings,
  invoiceGet,
  invoiceDownload,
  daybookDownload,
  gstListGet,
  gstMonthListGet,
  accountpdf,
  salejson,
  gstr1json,
  balanceView,
  transportListGet,
  transportAdd,
  transportEdit,
  ewayGet,
  ewayAddEdit,
  ewayCreate,
};
