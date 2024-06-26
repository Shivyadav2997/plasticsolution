import Register from "pages/Register.js";
import Login from "pages/Login.js";
import AutoLogin from "pages/AutoLogin.js";
import { GrTransaction } from "react-icons/gr";
import { AiFillBook, AiOutlineDropbox, AiOutlineBank } from "react-icons/ai";
import { TbPackageExport, TbPackageImport } from "react-icons/tb";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import {
  FaBalanceScale,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaTruck,
} from "react-icons/fa";
import Party from "pages/Party/index";
import Transport from "pages/Transport/index";
import Transaction from "pages/Transaction";
import Expense from "pages/Expenses";
import Sales from "pages/Sales";
import SalesReturn from "pages/SalesReturn";
import SalesChallan from "pages/SalesChallan";
import PurchaseChallan from "pages/PurchaseChallan";
import PurchaseReturn from "pages/PurchaseReturn";
import Purchase from "pages/Purchase";
import CreateInvoice from "pages/Sales/CreateInvoice.js";
import PurchaseInvoice from "pages/Purchase/CreateInvoice.js";
import SalesReturnInvoice from "pages/SalesReturn/CreateInvoice";
import PurchaseReturnInvoice from "pages/PurchaseReturn/CreateInvoice";
import CreateSalesChallan from "pages/SalesChallan/CreateInvoice";
import CreatePurchaseChallan from "pages/PurchaseChallan/CreateInvoice";
import Quotation from "pages/Quotation/";
import CreateQuotation from "pages/Quotation/CreateInvoice";
import Report from "pages/Report";

import DayBook from "pages/Daybook";
import Contact from "pages/ContactUs";
import Account from "pages/Account";
import Balance from "pages/Balance";
import Bank from "pages/Bank";
import Profile from "pages/Profile";
import ProductList from "pages/Product";
import ProductStock from "pages/Product/stock";
import ProductRecipes from "pages/ProductRecipes/index";
import CreateRecipe from "pages/ProductRecipes/CreateInvoice";
import ViewAccount from "pages/Account/view";
import Setting from "pages/Setting";
import Dashboard from "pages/Dashboard/Index";
import Production from "pages/Production";
import GST from "pages/GST";
//v2
import PartyV2 from "pages/v2/Party/index";
import TransactionV2 from "pages/v2/Transaction";
import ExpenseV2 from "pages/v2/Expenses";
import SalesV2 from "pages/v2/Sales";
import SalesReturnV2 from "pages/v2/SalesReturn";
import SalesChallanV2 from "pages/v2/SalesChallan";
import PurchaseChallanV2 from "pages/v2/PurchaseChallan";
import PurchaseReturnV2 from "pages/v2/PurchaseReturn";
import PurchaseV2 from "pages/v2/Purchase";
import CreateInvoiceV2 from "pages/v2/Sales/CreateInvoice.js";
import PurchaseInvoiceV2 from "pages/v2/Purchase/CreateInvoice.js";

import SalesReturnInvoiceV2 from "pages/v2/SalesReturn/CreateInvoice";
import PurchaseReturnInvoiceV2 from "pages/v2/PurchaseReturn/CreateInvoice";
import CreateSalesChallanV2 from "pages/v2/SalesChallan/CreateInvoice";
import CreatePurchaseChallanV2 from "pages/v2/PurchaseChallan/CreateInvoice";

import DayBookV2 from "pages/v2/Daybook";
import ContactV2 from "pages/v2/ContactUs";
import AccountV2 from "pages/v2/Account";
import BalanceV2 from "pages/v2/Balance";
import BankV2 from "pages/v2/Bank";
import ProfileV2 from "pages/v2/Profile";
import ProductListV2 from "pages/v2/Product";
import ProductStockV2 from "pages/v2/Product/stock";
import ViewAccountV2 from "pages/v2/Account/view";
import DashboardV2 from "pages/v2/Dashboard/Index";
import ProductionV2 from "pages/v2/Production";
import GSTV2 from "pages/v2/GST";
import TransportV2 from "pages/v2/Transport/index";

import QuotationV2 from "pages/v2/Quotation/";
import CreateQuotationV2 from "pages/v2/Quotation/CreateInvoice";

import { GiFactory } from "react-icons/gi";
var routes = [
  {
    path: "/v1/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/v1/party",
    name: "Account",
    icon: "ni ni-single-02 text-yellow",
    component: Party,
    layout: "/admin",
  },
  {
    path: "/v1/transporter",
    name: "Transporter",
    icon: " text-success",
    component: Transport,
    iconCmp: FaTruck,

    layout: "/admin",
  },
  {
    path: "/v1/account",
    name: "Account Ledger",
    icon: "text-success",
    component: Account,
    layout: "/admin",
    iconCmp: GrTransaction,
  },
  {
    path: "/v1/viewAccount/:id",
    name: "ViewAccount",
    icon: "text-success",
    component: ViewAccount,
    layout: "/admin",
    iconCmp: GrTransaction,
    wOutLink: true,
  },
  {
    path: "/v1/balance",
    name: "Balance",
    icon: "text-primary",
    component: Balance,
    layout: "/admin",
    iconCmp: FaBalanceScale,
  },
  {
    path: "/v1/bank",
    name: "Bank",
    icon: "text-yellow",
    component: Bank,
    layout: "/admin",
    iconCmp: AiOutlineBank,
  },
  {
    path: "/v1/transaction",
    name: "Transaction",
    icon: "ni ni-bullet-list-67 text-red",
    component: Transaction,
    layout: "/admin",
  },
  {
    path: "/v1/expenses",
    name: "Expenses",
    icon: "ni ni-money-coins text-success",
    component: Expense,
    layout: "/admin",
  },
  {
    path: "/v1/day-book",
    name: "Day Book",
    icon: "text-blue",
    component: DayBook,
    layout: "/admin",
    iconCmp: AiFillBook,
  },
  {
    path: "/v1/",
    name: "Sales",
    icon: "text-yellow",
    layout: "/admin",
    iconCmp: TbPackageExport,
    hasChild: true,
    state: "purchase",
    childRoutes: [
      {
        path: "/v1/sales",
        name: "Sales List",
        icon: "text-orange",
        component: Sales,
        layout: "/admin",
        iconCmp: TbPackageExport,
      },
      {
        path: "/v1/return-sales",
        name: "Sales Return",
        icon: "text-green",
        layout: "/admin",
        iconCmp: TbPackageExport,
        component: SalesReturn,
      },
      {
        path: "/v1/sales-challan",
        name: "Sales Challan",
        icon: "text-blue",
        layout: "/admin",
        iconCmp: TbPackageExport,
        component: SalesChallan,
      },
    ],
  },
  {
    path: "/v1/",
    name: "Purchase",
    icon: "text-red",
    layout: "/admin",
    iconCmp: TbPackageExport,
    hasChild: true,
    state: "sales",
    childRoutes: [
      {
        path: "/v1/purchase",
        name: "Purchase List",
        icon: "text-yellow",
        layout: "/admin",
        iconCmp: TbPackageImport,
        component: Purchase,
      },
      {
        path: "/v1/return-purchase",
        name: "Purchase Return",
        icon: "text-green",
        layout: "/admin",
        iconCmp: TbPackageImport,
        component: PurchaseReturn,
      },
      {
        path: "/v1/purchase-challan",
        name: "Purchase Challan",
        icon: "text-blue",
        layout: "/admin",
        iconCmp: TbPackageExport,
        component: PurchaseChallan,
      },
    ],
  },
  {
    path: "/v1/quotation",
    name: "Quotation",
    icon: "text-blue",
    component: Quotation,
    layout: "/admin",
    iconCmp: AiFillBook,
  },
  {
    path: "/v1/sales-invoice",
    name: "Create Sales Invoice",
    component: CreateInvoice,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v1/purchase-invoice",
    name: "Create Purchase Invoice",
    component: PurchaseInvoice,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v1/return-sales-invoice",
    name: "Create Return Sales Invoice",
    component: SalesReturnInvoice,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v1/return-purchase-invoice",
    name: "Create Return Purchase Invoice",
    component: PurchaseReturnInvoice,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v1/sales-challan-create",
    name: "Create Sales Challan",
    component: CreateSalesChallan,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v1/purchase-challan-create",
    name: "Create Purchase Challan",
    component: CreatePurchaseChallan,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v1/quotation-create",
    name: "Create Quotation",
    component: CreateQuotation,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v1/",
    name: "Product",
    icon: "text-red",
    layout: "/admin",
    iconCmp: AiOutlineDropbox,
    hasChild: true,
    state: "product",
    childRoutes: [
      {
        path: "/v1/product-list",
        name: "Product List",
        icon: "",
        component: ProductList,
        layout: "/admin",
        iconCmp: RiCheckboxBlankCircleLine,
      },
      {
        path: "/v1/product-stock",
        name: "Product Stock",
        icon: "",
        component: ProductStock,
        layout: "/admin",
        iconCmp: RiCheckboxBlankCircleLine,
      },
      {
        path: "/v1/product-recipes",
        name: "Product Recipes",
        icon: "",
        component: ProductRecipes,
        layout: "/admin",
        iconCmp: RiCheckboxBlankCircleLine,
      },
    ],
  },
  {
    path: "/v1/recipe-create",
    name: "Create Product Recipe",
    component: CreateRecipe,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v1/production",
    name: "Production",
    icon: "text-primary",
    component: Production,
    layout: "/admin",
    iconCmp: GiFactory,
  },
  {
    path: "/v1/gst",
    name: "GSTR-1",
    icon: "text-success",
    component: GST,
    layout: "/admin",
    iconCmp: FaFileInvoiceDollar,
  },
  {
    path: "/v1/report",
    name: "Report",
    icon: "text-info",
    component: Report,
    layout: "/admin",
    iconCmp: FaFileInvoice,
  },
  {
    path: "/v1/setting",
    name: "Setting",
    icon: "ni ni-settings text-yellow",
    component: Setting,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v1/contact-us",
    name: "Contact Us",
    icon: "ni ni-email-83 text-red",
    component: Contact,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v1/profile",
    name: "My Profile",
    component: Profile,
    layout: "/admin",
    iconCmp: GrTransaction,
    wOutLink: true,
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-circle-08 text-pink",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/autologin",
    name: "AutoLogin",
    icon: "ni ni-circle-08 text-pink",
    component: AutoLogin,
    layout: "/auth",
  },
  // {
  //   path: "/view",
  //   name: "View",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: ViewTest,
  //   layout: "/admin",
  // },
  //v2
  {
    path: "/v2/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: DashboardV2,
    layout: "/admin",
  },
  {
    path: "/v2/party",
    name: "Account",
    icon: "ni ni-single-02 text-yellow",
    component: PartyV2,
    layout: "/admin",
  },
  {
    path: "/v2/transporter",
    name: "Transporter",
    icon: " text-success",
    component: TransportV2,
    iconCmp: FaTruck,
    layout: "/admin",
  },
  {
    path: "/v2/account",
    name: "Account Ledger",
    icon: "text-success",
    component: AccountV2,
    layout: "/admin",
    iconCmp: GrTransaction,
  },
  {
    path: "/v2/viewAccount/:id",
    name: "ViewAccount",
    icon: "text-success",
    component: ViewAccountV2,
    layout: "/admin",
    iconCmp: GrTransaction,
    wOutLink: true,
  },
  {
    path: "/v2/balance",
    name: "Balance",
    icon: "text-primary",
    component: BalanceV2,
    layout: "/admin",
    iconCmp: FaBalanceScale,
  },
  {
    path: "/v2/bank",
    name: "Bank",
    icon: "text-yellow",
    component: BankV2,
    layout: "/admin",
    iconCmp: AiOutlineBank,
  },
  {
    path: "/v2/transaction",
    name: "Transaction",
    icon: "ni ni-bullet-list-67 text-red",
    component: TransactionV2,
    layout: "/admin",
  },
  {
    path: "/v2/expenses",
    name: "Expenses",
    icon: "ni ni-money-coins text-success",
    component: Expense,
    layout: "/admin",
  },
  {
    path: "/v2/day-book",
    name: "Day Book",
    icon: "text-blue",
    component: DayBookV2,
    layout: "/admin",
    iconCmp: AiFillBook,
  },
  {
    path: "/v2/",
    name: "Sales",
    icon: "text-yellow",
    layout: "/admin",
    iconCmp: TbPackageExport,
    hasChild: true,
    state: "sales",
    childRoutes: [
      {
        path: "/v2/sales",
        name: "Sales List",
        icon: "text-orange",
        component: SalesV2,
        layout: "/admin",
        iconCmp: TbPackageExport,
      },
      {
        path: "/v2/return-sales",
        name: "Sales Return",
        icon: "text-green",
        layout: "/admin",
        iconCmp: TbPackageExport,
        component: SalesReturnV2,
      },
      {
        path: "/v2/sales-challan",
        name: "Sales Challan",
        icon: "text-blue",
        layout: "/admin",
        iconCmp: TbPackageExport,
        component: SalesChallanV2,
      },
    ],
  },
  {
    path: "/v2/",
    name: "Purchase",
    icon: "text-red",
    layout: "/admin",
    iconCmp: TbPackageExport,
    hasChild: true,
    state: "purchase",
    childRoutes: [
      {
        path: "/v2/purchase",
        name: "Purchase List",
        icon: "text-yellow",
        layout: "/admin",
        iconCmp: TbPackageImport,
        component: PurchaseV2,
      },
      {
        path: "/v2/return-purchase",
        name: "Purchase Return",
        icon: "text-green",
        layout: "/admin",
        iconCmp: TbPackageImport,
        component: PurchaseReturnV2,
      },
      {
        path: "/v2/purchase-challan",
        name: "Purchase Challan",
        icon: "text-blue",
        layout: "/admin",
        iconCmp: TbPackageExport,
        component: PurchaseChallanV2,
      },
    ],
  },
  {
    path: "/v2/quotation",
    name: "Quotation",
    icon: "text-blue",
    component: QuotationV2,
    layout: "/admin",
    iconCmp: AiFillBook,
  },
  {
    path: "/v2/sales-invoice",
    name: "Create Sales Invoice",
    component: CreateInvoiceV2,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v2/purchase-invoice",
    name: "Create Purchase Invoice",
    component: PurchaseInvoiceV2,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v2/return-sales-invoice",
    name: "Create Return Sales Invoice",
    component: SalesReturnInvoiceV2,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v2/return-purchase-invoice",
    name: "Create Return Purchase Invoice",
    component: PurchaseReturnInvoiceV2,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v2/sales-challan-create",
    name: "Create Sales Challan",
    component: CreateSalesChallanV2,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v2/purchase-challan-create",
    name: "Create Purchase Challan",
    component: CreatePurchaseChallanV2,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v2/quotation-create",
    name: "Create Quotation",
    component: CreateQuotationV2,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v2/",
    name: "Product",
    icon: "text-red",
    layout: "/admin",
    iconCmp: AiOutlineDropbox,
    hasChild: true,
    state: "product",
    childRoutes: [
      {
        path: "/v2/product-list",
        name: "Product List",
        icon: "",
        component: ProductListV2,
        layout: "/admin",
        iconCmp: RiCheckboxBlankCircleLine,
      },
      {
        path: "/v2/product-stock",
        name: "Product Stock",
        icon: "",
        component: ProductStockV2,
        layout: "/admin",
        iconCmp: RiCheckboxBlankCircleLine,
      },
      {
        path: "/v2/product-recipes",
        name: "Product Recipes",
        icon: "",
        component: ProductRecipes,
        layout: "/admin",
        iconCmp: RiCheckboxBlankCircleLine,
      },
    ],
  },
  {
    path: "/v2/recipe-create",
    name: "Create Product Recipe",
    component: CreateRecipe,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v2/production",
    name: "Production",
    icon: "text-primary",
    component: ProductionV2,
    layout: "/admin",
    iconCmp: GiFactory,
  },
  {
    path: "/v2/gst",
    name: "GSTR-1",
    icon: "text-success",
    component: GSTV2,
    layout: "/admin",
    iconCmp: FaFileInvoiceDollar,
  },
  {
    path: "/v2/report",
    name: "Report",
    icon: "text-info",
    component: Report,
    layout: "/admin",
    iconCmp: FaFileInvoice,
  },
  {
    path: "/v2/setting",
    name: "Setting",
    icon: "ni ni-settings text-yellow",
    component: Setting,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v2/contact-us",
    name: "Contact Us",
    icon: "ni ni-email-83 text-red",
    component: ContactV2,
    layout: "/admin",
    wOutLink: true,
  },
  {
    path: "/v2/profile",
    name: "My Profile",
    component: ProfileV2,
    layout: "/admin",
    iconCmp: GrTransaction,
    wOutLink: true,
  },
];
export default routes;
