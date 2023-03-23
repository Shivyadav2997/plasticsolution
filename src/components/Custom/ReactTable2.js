import React, { useMemo } from "react";
import { useTable, usePagination } from "react-table";
import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

import { usePagination2, DOTS } from "./usePagination2";
export const Paginated = ({ columns, data, showCard = false }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  const { pageIndex, pageSize } = state;
  const paginationRange = usePagination2({
    currentPage: pageIndex,
    totalCount: data.length,
    siblingCount: 1,
    pageSize: pageSize,
  });
  return (
    <>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre> */}
      {/* <Card className="shadow"> */}
      <div className="table-responsive mt-3">
        <table
          {...getTableProps()}
          className="align-items-center table-flush table dt-responsive"
          style={{ width: "100%" }}
        >
          <thead className="thead-light">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <CardFooter className="py-4">
        <nav aria-label="...">
          <Pagination
            className="pagination justify-content-end mb-0"
            listClassName="justify-content-end mb-0"
          >
            <PaginationItem className={!canPreviousPage ? "disabled" : ""}>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  previousPage();
                }}
                disabled={!canPreviousPage}
                tabIndex="-1"
              >
                <i className="fas fa-angle-left" />
                <span className="sr-only">Previous</span>
              </PaginationLink>
            </PaginationItem>
            {paginationRange.map((pageNumber) => {
              if (pageNumber === DOTS) {
                return <li className="pagination-item dots">&#8230;</li>;
              }

              return (
                <PaginationItem
                  className={pageNumber == pageIndex + 1 ? "active" : ""}
                >
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      gotoPage(pageNumber - 1);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem className={!canNextPage ? "disabled" : ""}>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  nextPage();
                }}
                disabled={!canNextPage}
              >
                <i className="fas fa-angle-right" />
                <span className="sr-only">Next</span>
              </PaginationLink>
            </PaginationItem>
          </Pagination>
        </nav>

        <div>
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
        </div>
      </CardFooter>
      {/* </Card> */}
    </>
  );
};
