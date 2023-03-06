import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
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
// import "datatables.net-responsive-bs";
import $ from "jquery";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import JSZip from "jszip";
window.JSZip = JSZip;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const CustomTable = ({ cols, data, dark }) => {
  const datatableRef = useRef(null);
  //   const $ = require("jquery");
  //   $.DataTable = require("datatables.net");

  useEffect(() => {
    var table2 = $(datatableRef.current).DataTable({
      dom: "Bfrtip",

      data: data,
      columns: cols,
      ordering: true,
      info: true,
      responsive: true,
      paging: false,

      buttons: ["excel", "pdf", "print"],
      //   buttons: true,
      initComplete: (settings) => {
        // console.log(
        //   "table2",
        //   settings.oInstance.api().buttons().container().html()
        // );
        // settings.oInstance
        //   .api()
        //   .buttons()
        //   .container()
        //   .appendTo($(containerRef.current));
        $(".dataTables_wrapper")
          .find(".dt-button")
          .addClass("btn btn-primary btn-sm");
        $(".dataTables_wrapper")
          .find(".dt-buttons")
          .addClass("btn-group flex-wrap");
      },
    });
    $(datatableRef.current).find("thead").addClass("thead-light");

    // class="dataTables_wrapper no-footer"

    return () => {
      $(".data-table-wrapper").find("table").DataTable().destroy(true);
    };
  }, []);
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
