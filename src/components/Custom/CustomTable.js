import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-responsive-dt/js/responsive.dataTables.min.js";
import "./CustomTable.css";
import ReactDOM, { createRoot } from "react-dom/client";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import $ from "jquery";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import JSZip from "jszip";
import ReactDOMServer from "react-dom/server";
window.JSZip = JSZip;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const CustomTable = ({
  cols,
  data,
  dark,
  rowCallBack,
  columndefs = null,
  hasEdit = true,
  hasDelete = true,
  editClick = null,
  deleteClick = null,
  title = "",
  withCard = true,
}) => {
  const datatableRef = useRef(null);
  var colDefs = [];
  const action = (td, cellData, rowData, row, col) => {
    return hasEdit || hasDelete ? (
      <div className="d-flex gap-10">
        {hasEdit && (
          <div>
            <Button
              className="btn-neutral btn-icon btn-sm"
              color="default"
              onClick={() => editClick(cellData, rowData, row, col)}
            >
              <span>
                <BiEditAlt size={16} />
              </span>
            </Button>
          </div>
        )}
        {hasDelete && (
          <div>
            <Button
              className="btn-danger btn-icon btn-sm"
              onClick={() => deleteClick(cellData, rowData, row, col)}
            >
              <span>
                <MdDelete size={16} />
              </span>
            </Button>
          </div>
        )}
      </div>
    ) : null;
  };
  if (action != null) {
    colDefs = [
      {
        targets: -1,
        createdCell: (td, cellData, rowData, row, col) => {
          const root = ReactDOM.createRoot(td);
          root.render(action(td, cellData, rowData, row, col));
        },
        className: "all",
      },
    ];
  }
  if (columndefs != null) {
    colDefs = [...colDefs, ...columndefs];
  }
  const [datatable, setDatatable] = useState(null);
  useEffect(() => {
    if (datatable != null) {
      datatable.clear();
      datatable.destroy();
    }
    var table2 = $(datatableRef.current).DataTable({
      dom: "Bfrtip",
      data: data,
      columns: cols,
      ordering: true,
      order: [[1, "asc"]],
      info: true,
      responsive: true,
      paging: true,
      columnDefs: colDefs,
      rowCallback: rowCallBack,
      language: {
        paginate: {
          previous: ReactDOMServer.renderToString(
            <>
              <i class="fas fa-angle-left"></i>
              <span class="sr-only">Previous</span>
            </>
          ),
          next: ReactDOMServer.renderToString(
            <>
              <i class="fas fa-angle-right"></i>
              <span class="sr-only">Next</span>
            </>
          ),
        },
      },
      drawCallback: function () {},
      buttons: ["excel", "pdf", "print"],
      initComplete: (settings) => {
        $(".dataTables_wrapper")
          .find(".dt-button")
          .addClass("btn btn-primary btn-md");
        $(".dataTables_wrapper")
          .find(".dt-buttons")
          .addClass("btn-group flex-wrap pd-custom");
        $(".dataTables_wrapper")
          .find(".dataTables_info")
          .addClass(" pd-custom");
        $(".dataTables_wrapper")
          .find(".dataTables_filter")
          .addClass("pd-custom-right");
      },
    });
    setDatatable(table2);
    $(datatableRef.current).find("thead").addClass("thead-light");
    return () => {
      if (datatable != null) {
        datatable.clear();
        datatable.destroy();
      }
    };
  }, [data]);
  return (
    <>
      {withCard ? (
        <Card className="shadow">
          <CardHeader className="border-0">
            <h3 className="mb-0">{title}</h3>
          </CardHeader>
          <div className="table-responsive">
            <table
              className="align-items-center table-flush table dt-responsive"
              style={{ width: "100%" }}
              ref={datatableRef}
            ></table>
          </div>
          <CardFooter className="py-4"></CardFooter>
        </Card>
      ) : (
        <div className="table-responsive">
          <table
            className="align-items-center table-flush table dt-responsive"
            style={{ width: "100%" }}
            ref={datatableRef}
          ></table>
        </div>
      )}
    </>
  );
};

export default CustomTable;
