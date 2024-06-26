import axios from "axios";
import React from "react";
import {
  userLoginAction,
  autoLoginAction,
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
  groupNameAction,
  stateCodeAction,
  getAccountantAction,
  findAccountantAction,
  saveAccountantAction,
  sendWhatsappMsgAction,
  transactionPdfAction,
  transactionReceiptAction,
  transactionDownloadAction,
  getInvoiceAction,
  updateInvoiceAction,
  returnSaleListAction,
  returnPurchaseistAction,
  createPurchaseReturnAction,
  createSalesReturnAction,
  updatePurchaseReturnAction,
  updateSalesReturnAction,
  createChallanAction,
  updateChallanAction,
  getChallanNoAction,
  challanDetailsAction,
  saleChallanListAction,
  purchaseChallanListAction,
  challanToInvoiceAction,
  quotationListAction,
  quotationToInvoiceAction,
  getQuatationNoAction,
  createQuotationAction,
  updateQuotationAction,
  quotationDetailsAction,
  reportAction,
  discountAction,
  recipesListAction,
  createRecipesAction,
  recipeGetAction,
  updateRecipesAction,
  expenseGroupAction,
} from "./action.js";

const baseUrltest = "https://jsonplaceholder.typicode.com/";
const baseUrl = process.env.REACT_APP_API_URL;
const baseInvoiceUrl = process.env.REACT_APP_INVOICE_URL;
const baseInvoiceDownloadUrl = process.env.REACT_APP_INVOICE_DOWNLOAD_URL;
const baseChallanUrl = process.env.REACT_APP_CHALLAN_URL;
const baseChallanDownloadUrl = process.env.REACT_APP_CHALLAN_DOWNLOAD_URL;
const baseQuotationUrl = process.env.REACT_APP_QUOTATION_URL;
const baseQuotationDownloadUrl = process.env.REACT_APP_QUOTATION_DOWNLOAD_URL;
const baseReportUrl = process.env.REACT_APP_CREATE_REPORT_URL;
const baseReportDownloadUrl = process.env.REACT_APP_REPORT_DOWNLOAD_URL;
const baseMonthlyInvoiceUrl = process.env.REACT_APP_MONTHLY_INVOICE_URL;
const key = "accountdigi9868";

const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString("en-US", { month: "long" });
};

const getParams = (payload) => {
  const strParams = Object.keys(payload).map((k) => {
    if (payload[k] != null && payload[k] != undefined) {
      return `${k}=${payload[k]}`;
    } else {
      return null;
    }
  });
  return strParams.filter((x) => x != null).join("&");
};

const getFormData = (payload, action) => {
  let data = new FormData();
  data.append("action", action);
  Object.keys(payload).forEach((k) => {
    if (payload[k] != null && payload[k] != undefined) {
      data.append(k, payload[k]);
    }
  });
  return data;
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
    if (resp.data.login == 0) {
      window.location.href = `${window.location.origin}/auth/login`;
    }
    return resp.data;
  } catch (error) {
    return {
      data: [],
      message: "Something wen't wrong",
    };
  }
};

const autoLoginCheck = async () => {
  try {
    const resp = await axios.get(baseUrl + `?action=${autoLoginAction}`);
    return resp.data;
  } catch (error) {
    return {
      sucess: 0,
      message: "Something wen't wrong",
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, partyAddAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, partyEditAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, transactionRecieveAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, transactionPaymentAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, expenseAddAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

const purchaseListGet = async (token, st = "", en = "", m = "", pid = null) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${purchaseListAction}&token=${token}&st=${st}&en=${en}&m=${m}`;
    if (pid != null) {
      apiurlsend += `&p=${pid}`;
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

const saleListGet = async (token, st = "", en = "", m = "", pid = null) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${saleListAction}&token=${token}&st=${st}&en=${en}&m=${m}`;
    if (pid != null) {
      apiurlsend += `&p=${pid}`;
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, productAddAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, productEditAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

const productStockGet = async (token, st = "", en = "") => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${productStockAction}&token=${token}&st=${st}&en=${en}`
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

const productStockEntryGet = async (token, st = "", en = "") => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${productStockEntryAction}&token=${token}&st=${st}&en=${en}`
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

const balanceListGet = async (token, st = "", en = "") => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${balanceAction}&token=${token}&st=${st}&en=${en}`
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

const balanceEntryListGet = async (token, st = "", en = "") => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${balanceEntryAction}&token=${token}&st=${st}&en=${en}`
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, balanceUpdateAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, bankAddAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, bankUpdateAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, creditDebitAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

const adddiscount = async (token, payload) => {
  try {
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, discountAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

const createInvoice = async (token, payload, json, challanId = null) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    if (challanId != null) {
      formData.append("challan_id", challanId);
    }
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

const challanGet = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseChallanUrl + `?token=${token}&${getParams(payload)}`
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

const challanDownload = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseChallanDownloadUrl + `?token=${token}&${getParams(payload)}`
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

const accountpdf = async (
  token,
  id,
  type,
  d,
  t,
  st = null,
  en = null,
  mo = null
) => {
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
    if (mo != null) {
      apiurlsend += `&mo=${mo}`;
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, transportAddAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, transportEditAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

const stateCodeGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${stateCodeAction}&token=${token}`
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

const groupNameGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${groupNameAction}&token=${token}`
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

const getAccountant = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${getAccountantAction}&token=${token}`
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

const findaccountant = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${findAccountantAction}&token=${token}&${getParams(payload)}`
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

const updateAccountant = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${saveAccountantAction}&token=${token}&${getParams(payload)}`
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

const sendWhatsappMsg = async (token, payload) => {
  try {
    const resp = await axios.post(
      baseUrl + `?token=${token}`,
      getFormData(payload, sendWhatsappMsgAction),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

const sendTransactionWp = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${transactionPdfAction}&token=${token}&${getParams(payload)}`
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

const sendTransactionWpReceipt = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${transactionReceiptAction}&token=${token}&${getParams(
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

const downloadTransactionPdf = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${transactionDownloadAction}&token=${token}&${getParams(
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

const getInvoiceDetails = async (token, id) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${getInvoiceAction}&token=${token}&id=${id}`
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

const updateInvoice = async (token, payload, json) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${updateInvoiceAction}&token=${token}&${getParams(payload)}`,
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

const returnSaleListGet = async (
  token,
  st = "",
  en = "",
  m = "",
  pid = null
) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${returnSaleListAction}&token=${token}&st=${st}&en=${en}&m=${m}`;
    if (pid != null) {
      apiurlsend += `&p=${pid}`;
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

const returnPurchaseListGet = async (
  token,
  st = "",
  en = "",
  m = "",
  pid = null
) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${returnPurchaseistAction}&token=${token}&st=${st}&en=${en}&m=${m}`;
    if (pid != null) {
      apiurlsend += `&p=${pid}`;
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

const createReturnSalesInvoice = async (token, payload, json) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${createSalesReturnAction}&token=${token}&${getParams(
          payload
        )}`,
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

const createReturnPurchaseInvoice = async (token, payload, json) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${createPurchaseReturnAction}&token=${token}&${getParams(
          payload
        )}`,
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

const updateReturnPurchaseInvoice = async (token, payload, json) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${updatePurchaseReturnAction}&token=${token}&${getParams(
          payload
        )}`,
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

const updateReturnSalesInvoice = async (token, payload, json) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${updateSalesReturnAction}&token=${token}&${getParams(
          payload
        )}`,
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

const createChallan = async (token, payload, json) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${createChallanAction}&token=${token}&${getParams(payload)}`,
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

const updateChallan = async (token, payload, json) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${updateChallanAction}&token=${token}&${getParams(payload)}`,
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

const getChallanDetails = async (token, id) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${challanDetailsAction}&token=${token}&id=${id}`
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

const getChallanNo = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${getChallanNoAction}&token=${token}&${getParams(payload)}`
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

const purchaseChallanListGet = async (
  token,
  st = "",
  en = "",
  m = "",
  pid = null
) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${purchaseChallanListAction}&token=${token}&st=${st}&en=${en}&m=${m}`;
    if (pid != null) {
      apiurlsend += `&p=${pid}`;
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

const saleChallanListGet = async (
  token,
  st = "",
  en = "",
  m = "",
  pid = null
) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${saleChallanListAction}&token=${token}&st=${st}&en=${en}&m=${m}`;
    if (pid != null) {
      apiurlsend += `&p=${pid}`;
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

const createChallanFromInvoice = async (token, json) => {
  try {
    const formData = new FormData();
    formData.append("id", json);
    const resp = await axios.post(
      baseUrl + `?action=${challanToInvoiceAction}&token=${token}`,
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

const quotationListGet = async (
  token,
  st = "",
  en = "",
  m = "",
  pid = null
) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${quotationListAction}&token=${token}&st=${st}&en=${en}&m=${m}`;
    if (pid != null) {
      apiurlsend += `&p=${pid}`;
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

const createQuotationToInvoice = async (token, json) => {
  try {
    const formData = new FormData();
    formData.append("id", json);
    const resp = await axios.post(
      baseUrl + `?action=${quotationToInvoiceAction}&token=${token}`,
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

const getQuatationNo = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseUrl +
        `?action=${getQuatationNoAction}&token=${token}&${getParams(payload)}`
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

const createQuotation = async (token, payload, json) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${createQuotationAction}&token=${token}&${getParams(payload)}`,
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

const updateQuotation = async (token, payload, json) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${updateQuotationAction}&token=${token}&${getParams(payload)}`,
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

const getQuotationDetails = async (token, id) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${quotationDetailsAction}&token=${token}&id=${id}`
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

const quotationGet = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseQuotationUrl + `?token=${token}&${getParams(payload)}`
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

const quotationDownload = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseQuotationDownloadUrl + `?token=${token}&${getParams(payload)}`
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

const reportsGet = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${reportAction}&token=${token}`
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

const createReport = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseReportUrl + `?token=${token}&${getParams(payload)}`
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

const downloadReport = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseReportDownloadUrl + `?token=${token}&${getParams(payload)}`
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

const monthlyInvoice = async (token, payload) => {
  try {
    const resp = await axios.get(
      baseMonthlyInvoiceUrl + `?token=${token}&${getParams(payload)}`
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

const recipeListGet = async (token, st = "", en = "", m = "", pid = null) => {
  try {
    let apiurlsend =
      baseUrl +
      `?action=${recipesListAction}&token=${token}&st=${st}&en=${en}&m=${m}`;
    if (pid != null) {
      apiurlsend += `&p=${pid}`;
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

const getRecipeDetails = async (token, id) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${recipeGetAction}&token=${token}&id=${id}`
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

const getExpenseGroup = async (token) => {
  try {
    const resp = await axios.get(
      baseUrl + `?action=${expenseGroupAction}&token=${token}`
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

const createRecipe = async (token, payload, json) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${createRecipesAction}&token=${token}&${getParams(payload)}`,
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
const updateRecipe = async (token, payload, json) => {
  try {
    const formData = new FormData();
    formData.append("rows", json);
    const resp = await axios.post(
      baseUrl +
        `?action=${updateRecipesAction}&token=${token}&${getParams(payload)}`,
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

export {
  getMonthName,
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
  autoLoginCheck,
  stateCodeGet,
  groupNameGet,
  getAccountant,
  findaccountant,
  updateAccountant,
  sendWhatsappMsg,
  sendTransactionWp,
  sendTransactionWpReceipt,
  downloadTransactionPdf,
  getInvoiceDetails,
  updateInvoice,
  returnSaleListGet,
  returnPurchaseListGet,
  createReturnPurchaseInvoice,
  createReturnSalesInvoice,
  updateReturnPurchaseInvoice,
  updateReturnSalesInvoice,
  saleChallanListGet,
  createChallan,
  updateChallan,
  getChallanDetails,
  getChallanNo,
  purchaseChallanListGet,
  createChallanFromInvoice,
  challanGet,
  challanDownload,
  createQuotationToInvoice,
  quotationListGet,
  getQuatationNo,
  createQuotation,
  updateQuotation,
  getQuotationDetails,
  quotationGet,
  quotationDownload,
  reportsGet,
  createReport,
  downloadReport,
  adddiscount,
  monthlyInvoice,
  createRecipe,
  recipeListGet,
  getRecipeDetails,
  updateRecipe,
  getExpenseGroup,
};
