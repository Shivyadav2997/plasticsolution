import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Login from "pages/Login.js";
import { MdAccountBox } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { GiExpense, GiFactory } from "react-icons/gi";
import { AiFillBook, AiOutlineDropbox } from "react-icons/ai";
import { TbPackageExport, TbPackageImport } from "react-icons/tb";
import { FaFileInvoiceDollar } from "react-icons/fa";
import Party from "pages/Party/index";

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
    component: Profile,
    layout: "/admin",
    iconCmp: GrTransaction,
  },
  {
    path: "/transaction",
    name: "Transaction",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/expenses",
    name: "Expenses",
    icon: "ni ni-money-coins text-success",
    component: Index,
    layout: "/admin",
  },
  {
    path: "/day-book",
    name: "Day Book",
    icon: "text-blue",
    component: Icons,
    layout: "/admin",
    iconCmp: AiFillBook,
  },
  {
    path: "/sales",
    name: "Sales",
    icon: "text-yellow",
    component: Profile,
    layout: "/admin",
    iconCmp: TbPackageExport,
  },
  {
    path: "/purchase",
    name: "Purchase",
    icon: "text-red",
    component: Tables,
    layout: "/admin",
    iconCmp: TbPackageImport,
  },

  {
    path: "/product",
    name: "Product",
    icon: "text-red",
    component: Tables,
    layout: "/admin",
    iconCmp: AiOutlineDropbox,
  },
  {
    path: "/production",
    name: "Production",
    icon: "text-primary",
    component: Index,
    layout: "/admin",
    iconCmp: GiFactory,
  },
  {
    path: "/gst",
    name: "GST",
    icon: "text-success",
    component: Icons,
    layout: "/admin",
    iconCmp: FaFileInvoiceDollar,
  },
  {
    path: "/setting",
    name: "Setting",
    icon: "ni ni-settings text-yellow",
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/contact-us",
    name: "Contact Us",
    icon: "ni ni-email-83 text-red",
    component: Tables,
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
];
export default routes;
