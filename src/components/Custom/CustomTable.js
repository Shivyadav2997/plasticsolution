import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
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

import ReactDOM, { createRoot } from "react-dom/client";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import $ from "jquery";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import JSZip from "jszip";
window.JSZip = JSZip;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const CustomTable = ({
  cols,
  data,
  dark,
  columndefs = null,
  hasEdit = true,
  hasDelete = true,
  editClick = null,
  deleteClick = null,
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
              <span className="btn-inner--icon">
                <BiEditAlt />
              </span>
            </Button>
          </div>
        )}
        {hasDelete && (
          <div>
            <Button
              className="btn-neutral btn-icon btn-sm"
              color="default"
              onClick={() => deleteClick(cellData, rowData, row, col)}
            >
              <span className="btn-inner--icon">
                <MdDelete />
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
    colDefs = [...colDefs, columndefs];
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
      info: true,
      responsive: true,
      paging: false,
      columnDefs: colDefs,
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
    <Card className="shadow">
      <CardHeader className="border-0">
        <h3 className="mb-0">Card tables</h3>
      </CardHeader>
      <div className="table-responsive">
        <table
          className="align-items-center table-flush table dt-responsive"
          style={{ width: "100%" }}
          ref={datatableRef}
        ></table>
      </div>
      <CardFooter className="py-4">
        <nav aria-label="...">
          <Pagination
            className="pagination justify-content-end mb-0"
            listClassName="justify-content-end mb-0"
          >
            <PaginationItem className="disabled">
              <PaginationLink
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                tabIndex="-1"
              >
                <i className="fas fa-angle-left" />
                <span className="sr-only">Previous</span>
              </PaginationLink>
            </PaginationItem>
            <PaginationItem className="active">
              <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
                2 <span className="sr-only">(current)</span>
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
                <i className="fas fa-angle-right" />
                <span className="sr-only">Next</span>
              </PaginationLink>
            </PaginationItem>
          </Pagination>
        </nav>
      </CardFooter>
    </Card>
  );
};

export default CustomTable;
