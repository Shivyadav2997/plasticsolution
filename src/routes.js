import Index from "views/Index.js";
// import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Login from "pages/Login.js";
import { MdAccountBox } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { GiExpense, GiFactory } from "react-icons/gi";
import { AiFillBook, AiOutlineDropbox, AiOutlineBank } from "react-icons/ai";
import { TbPackageExport, TbPackageImport } from "react-icons/tb";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import Party from "pages/Party/index";
import Transaction from "pages/Transaction";
import Expense from "pages/Expenses";
import Sales from "pages/Sales";
import Purchase from "pages/Purchase";
import CreateInvoice from "pages/Sales/CreateInvoice.js";
import DayBook from "pages/Daybook";
import Contact from "pages/ContactUs";
import Account from "pages/Account";
import Balance from "pages/Balance";
import Bank from "pages/Bank";
import Profile from "pages/Profile";
import ViewTest from "pages/View";
import ProductList from "pages/Product";
import ProductStock from "pages/Product/stock";
import Production from "pages/Production";
import { FaBalanceScale } from "react-icons/fa";
import { BsBank } from "react-icons/bs";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },
  {
    path: "/party",
    name: "Party",
    icon: "ni ni-single-02 text-yellow",
    component: Party,
    layout: "/admin",
  },
  {
    path: "/account",
    name: "Account",
    icon: "text-success",
    component: Account,
    layout: "/admin",
    iconCmp: GrTransaction,
  },
  {
    path: "/balance",
    name: "Balance",
    icon: "text-primary",
    component: Balance,
    layout: "/admin",
    iconCmp: FaBalanceScale,
  },
  {
    path: "/bank",
    name: "Bank",
    icon: "text-yellow",
    component: Bank,
    layout: "/admin",
    iconCmp: AiOutlineBank,
  },
  {
    path: "/transaction",
    name: "Transaction",
    icon: "ni ni-bullet-list-67 text-red",
    component: Transaction,
    layout: "/admin",
  },
  // {
  //   path: "/transaction2",
  //   name: "Regular Datatable",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Transaction2,
  //   layout: "/admin",
  // },
  // {
  //   path: "/transaction3",
  //   name: "React Table",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Transaction3,
  //   layout: "/admin",
  // },
  {
    path: "/expenses",
    name: "Expenses",
    icon: "ni ni-money-coins text-success",
    component: Expense,
    layout: "/admin",
  },
  {
    path: "/day-book",
    name: "Day Book",
    icon: "text-blue",
    component: DayBook,
    layout: "/admin",
    iconCmp: AiFillBook,
  },
  {
    name: "Sales",
    icon: "text-yellow",
    layout: "/admin",
    iconCmp: TbPackageExport,
    hasChild: true,
    state: "sales",
    childRoutes: [
      {
        path: "/sales-invoice",
        name: "Create Invoices",
        icon: "",
        component: CreateInvoice,
        layout: "/admin",
        iconCmp: RiCheckboxBlankCircleLine,
      },
      {
        path: "/sales",
        name: "Sales Bill",
        icon: "",
        component: Sales,
        layout: "/admin",
        iconCmp: RiCheckboxBlankCircleLine,
      },
    ],
  },
  // {
  //   path: "/invoiceTest",
  //   name: "Invoice",
  //   icon: "ni ni-money-coins text-success",
  //   component: CreateInvoice,
  //   layout: "/admin",
  // },
  {
    name: "Purchase",
    icon: "text-red",
    layout: "/admin",
    iconCmp: TbPackageImport,
    hasChild: true,
    state: "purchase",
    childRoutes: [
      {
        path: "/purchase-invoice",
        name: "Create Invoices",
        icon: "",
        component: CreateInvoice,
        layout: "/admin",
        iconCmp: RiCheckboxBlankCircleLine,
      },
      {
        path: "/purchase",
        name: "Purchase Bill",
        icon: "",
        component: Purchase,
        layout: "/admin",
        iconCmp: RiCheckboxBlankCircleLine,
      },
    ],
  },

  // {
  //   name: "Product",
  //   icon: "text-red",
  //   layout: "/admin",
  //   iconCmp: AiOutlineDropbox,
  //   hasChild: true,
  //   state: "product",
  //   childRoutes: [
  //     {
  //       path: "/product-list",
  //       name: "Product List",
  //       icon: "",
  //       component: ProductList,
  //       layout: "/admin",
  //       iconCmp: RiCheckboxBlankCircleLine,
  //     },
  //     {
  //       path: "/product-stock",
  //       name: "Product Stock",
  //       icon: "",
  //       component: ProductStock,
  //       layout: "/admin",
  //       iconCmp: RiCheckboxBlankCircleLine,
  //     },
  //   ],
  // },
  // {
  //   path: "/production",
  //   name: "Production",
  //   icon: "text-primary",
  //   component: Production,
  //   layout: "/admin",
  //   iconCmp: GiFactory,
  // },
  // {
  //   path: "/gst",
  //   name: "GST",
  //   icon: "text-success",
  //   component: Icons,
  //   layout: "/admin",
  //   iconCmp: FaFileInvoiceDollar,
  // },
  {
    path: "/profile",
    name: "Setting",
    icon: "ni ni-settings text-yellow",
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/contact-us",
    name: "Contact Us",
    icon: "ni ni-email-83 text-red",
    component: Contact,
    layout: "/admin",
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
  // {
  //   path: "/view",
  //   name: "View",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: ViewTest,
  //   layout: "/admin",
  // },
];
export default routes;
