import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
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

const CustomTable = forwardRef(
  (
    {
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
      custom = false,
      showNoCol = true,
      pageLength = 10,
      numColumns = [],
    },
    ref
  ) => {
    custom = true;
    const datatableRef = useRef(null);
    const [curTable, setCurTable] = useState(null);
    var colDefs = [];
    if (showNoCol) {
      colDefs = [
        {
          targets: 0,
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
        },
      ];
    }
    let action = null;
    if (hasEdit || hasDelete) {
      action = (td, cellData, rowData, row, col) => {
        return (
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
        );
      };
    }

    if (action != null) {
      colDefs = [
        ...colDefs,
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
    let custCallback = null;
    if (custom) {
      custCallback = function (data2, callback, settings) {
        let curData = data;
        if (data2.search.value != "" && data.length > 0) {
          curData = curData.filter((x) =>
            data2.columns
              .filter((c) => c.searchable)
              .map((value) => x[value.data])
              .some((y) =>
                y?.toLowerCase().includes(data2.search.value.toLowerCase())
              )
          );
        }

        if (data2.order.length > 0) {
          let col = data2.columns[data2.order[0].column].data.toString();
          let isAsc = data2.order[0].dir == "asc";

          if (numColumns.includes(data2.order[0].column)) {
            isAsc
              ? curData.sort((a, b) => {
                  return a[col] == ""
                    ? 1
                    : b[col] == ""
                    ? -1
                    : a[col] == b[col]
                    ? 0
                    : parseInt(a[col]) < parseInt(b[col])
                    ? -1
                    : 1;
                })
              : curData.sort((a, b) => {
                  return a[col] == ""
                    ? 1
                    : b[col] == ""
                    ? -1
                    : a[col] == b[col]
                    ? 0
                    : parseInt(a[col]) > parseInt(b[col])
                    ? -1
                    : 1;
                });
          } else {
            isAsc
              ? curData.sort((a, b) => {
                  return a[col] == ""
                    ? 1
                    : b[col] == ""
                    ? -1
                    : a[col] == b[col]
                    ? 0
                    : a[col] < b[col]
                    ? -1
                    : 1;
                })
              : curData.sort((a, b) => {
                  return a[col] == ""
                    ? 1
                    : b[col] == ""
                    ? -1
                    : a[col] == b[col]
                    ? 0
                    : a[col] > b[col]
                    ? -1
                    : 1;
                });
          }
        }
        callback({
          data: curData.slice(data2.start, data2.start + data2.length),
          recordsTotal: data.length,
          recordsFiltered: curData.length,
          draw: data2.draw,
        });
      };
    }
    function newexportaction(e, dt, button, config) {
      var self = this;
      var oldStart = dt.settings()[0]._iDisplayStart;
      dt.one("preXhr", function (e, s, data) {
        // Just this once, load all data from the server...
        data.start = 0;
        data.length = 2147483647;
        dt.one("preDraw", function (e, settings) {
          // Call the original action function
          if (button[0].className.indexOf("buttons-copy") >= 0) {
            $.fn.dataTable.ext.buttons.copyHtml5.action.call(
              self,
              e,
              dt,
              button,
              config
            );
          } else if (button[0].className.indexOf("buttons-excel") >= 0) {
            $.fn.dataTable.ext.buttons.excelHtml5.available(dt, config)
              ? $.fn.dataTable.ext.buttons.excelHtml5.action.call(
                  self,
                  e,
                  dt,
                  button,
                  config
                )
              : $.fn.dataTable.ext.buttons.excelFlash.action.call(
                  self,
                  e,
                  dt,
                  button,
                  config
                );
          } else if (button[0].className.indexOf("buttons-csv") >= 0) {
            $.fn.dataTable.ext.buttons.csvHtml5.available(dt, config)
              ? $.fn.dataTable.ext.buttons.csvHtml5.action.call(
                  self,
                  e,
                  dt,
                  button,
                  config
                )
              : $.fn.dataTable.ext.buttons.csvFlash.action.call(
                  self,
                  e,
                  dt,
                  button,
                  config
                );
          } else if (button[0].className.indexOf("buttons-pdf") >= 0) {
            $.fn.dataTable.ext.buttons.pdfHtml5.available(dt, config)
              ? $.fn.dataTable.ext.buttons.pdfHtml5.action.call(
                  self,
                  e,
                  dt,
                  button,
                  config
                )
              : $.fn.dataTable.ext.buttons.pdfFlash.action.call(
                  self,
                  e,
                  dt,
                  button,
                  config
                );
          } else if (button[0].className.indexOf("buttons-print") >= 0) {
            $.fn.dataTable.ext.buttons.print.action(e, dt, button, config);
          }
          dt.one("preXhr", function (e, s, data) {
            // DataTables thinks the first item displayed is index 0, but we're not drawing that.
            // Set the property to what it was before exporting.
            settings._iDisplayStart = oldStart;
            data.start = oldStart;
          });
          // Reload the grid with the original page. Otherwise, API functions like table.cell(this) don't work properly.
          setTimeout(dt.ajax.reload, 0);
          // Prevent rendering of the full data to the DOM
          return false;
        });
      });
      // Requery the server with the new one-time export settings
      dt.ajax.reload();
    }
    //For Export Buttons available inside jquery-datatable "server side processing" - End

    useImperativeHandle(ref, () => ({
      setResponsive() {
        if (curTable != null) {
          curTable.columns.adjust().responsive.recalc();
        }
      },
    }));

    useEffect(() => {
      var table2 = $(datatableRef.current).DataTable({
        dom: "Bfrtip",
        data: custom ? data.slice(0, pageLength) : data,
        columns: cols,
        ordering: true,
        order: [],
        info: true,
        responsive: true,
        paging: true,
        columnDefs: colDefs,
        rowCallback: rowCallBack,
        pageLength: pageLength,
        language: {
          paginate: {
            previous: ReactDOMServer.renderToString(
              <>
                <i className="fas fa-angle-left"></i>
                <span className="sr-only">Previous</span>
              </>
            ),
            next: ReactDOMServer.renderToString(
              <>
                <i className="fas fa-angle-right"></i>
                <span className="sr-only">Next</span>
              </>
            ),
          },
        },
        buttons: [
          {
            extend: "excel",
            titleAttr: "Excel",
            action: newexportaction,
          },
          {
            extend: "pdf",
            titleAttr: "PDF",
            action: newexportaction,
          },
          {
            extend: "print",
            titleAttr: "Print",
            action: newexportaction,
          },
        ],
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
        serverSide: custom,
        ajax: custCallback,
      });
      setCurTable(table2);
      $(datatableRef.current).find("thead").addClass("thead-light");
      return () => {
        if (table2 != null) {
          table2.clear();
          table2.destroy();
        }
      };
    }, [data]);
    return (
      <>
        {withCard ? (
          <Card className="shadow">
            <div className="table-responsive mt-3 pb-1">
              <table
                className="align-items-center table-flush table dt-responsive"
                style={{ width: "100%" }}
                ref={datatableRef}
              ></table>
            </div>
          </Card>
        ) : (
          <div className="table-responsive pb-1">
            <table
              className="align-items-center table-flush table dt-responsive"
              style={{ width: "100%" }}
              ref={datatableRef}
            ></table>
          </div>
        )}
      </>
    );
  }
);

export default CustomTable;
