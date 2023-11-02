import Register from "pages/Register.js";
import Login from "pages/Login.js";
import AutoLogin from "pages/AutoLogin.js";
import { GrTransaction } from "react-icons/gr";
import { AiFillBook, AiOutlineDropbox, AiOutlineBank } from "react-icons/ai";
import { TbPackageExport, TbPackageImport } from "react-icons/tb";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { FaBalanceScale, FaFileInvoiceDollar, FaTruck } from "react-icons/fa";
import Party from "pages/Party/index";
import Transport from "pages/Transport/index";
import Transaction from "pages/Transaction";
import Expense from "pages/Expenses";
import Sales from "pages/Sales";
import Purchase from "pages/Purchase";
import CreateInvoice from "pages/Sales/CreateInvoice.js";
import PurchaseInvoice from "pages/Purchase/CreateInvoice.js";
import DayBook from "pages/Daybook";
import Contact from "pages/ContactUs";
import Account from "pages/Account";
import Balance from "pages/Balance";
import Bank from "pages/Bank";
import Profile from "pages/Profile";
import ProductList from "pages/Product";
import ProductStock from "pages/Product/stock";
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
import PurchaseV2 from "pages/v2/Purchase";
import CreateInvoiceV2 from "pages/v2/Sales/CreateInvoice.js";
import PurchaseInvoiceV2 from "pages/v2/Purchase/CreateInvoice.js";
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
    name: "Party",
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
    name: "Account",
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
    path: "/v1/sales",
    name: "Sales",
    icon: "text-yellow",
    layout: "/admin",
    iconCmp: TbPackageExport,
    component: Sales,
  },
  {
    path: "/v1/purchase",
    name: "Purchase",
    icon: "text-red",
    layout: "/admin",
    iconCmp: TbPackageImport,
    component: Purchase,
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
    ],
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
    name: "Party",
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
    name: "Account",
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
    component: ExpenseV2,
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
    path: "/v2/sales",
    name: "Sales",
    icon: "text-yellow",
    layout: "/admin",
    iconCmp: TbPackageExport,
    component: SalesV2,
  },
  {
    path: "/v2/purchase",
    name: "Purchase",
    icon: "text-red",
    layout: "/admin",
    iconCmp: TbPackageImport,
    component: PurchaseV2,
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
    ],
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
