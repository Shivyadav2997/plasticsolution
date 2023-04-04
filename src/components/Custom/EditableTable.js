import { Container, Button, Table } from "reactstrap";
import { useEffect, forwardRef, useImperativeHandle } from "react";
import * as React from "react";
import { useState } from "react";

const EditableTable = forwardRef(({ header, rowDefinition, stateObj }, ref) => {
  const [allRows, setAllRows] = useState([]);
  const [allData, setAllData] = useState([]);
  const [index, setIndex] = useState(0);

  const initRow = () => {
    const curIndex = index;
    setAllData([{ ind: index, data: stateObj }]);
    setIndex((oldIndex) => oldIndex + 1);
    return rowDefinition;
  };

  useImperativeHandle(ref, () => ({
    saveTableData() {
      console.log(allData);
    },
    getCurrentIndex() {
      return index;
    },
  }));

  useEffect(() => {
    setAllRows([{ ind: index, row: initRow() }]);
  }, []);
  return (
    <Table className="align-items-center table-flush" responsive>
      <thead className="thead-light">
        <tr>
          {header.map((v) => {
            return <th>{v}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {allRows.map((v) => {
          return (
            <tr>
              {v.row}
              <td>
                <Button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    setAllRows(allRows.filter((x) => x.ind != v.ind));
                  }}
                >
                  Delete Row
                </Button>
              </td>
            </tr>
          );
        })}
        <tr>
          <td>
            <Button
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                setAllRows([
                  ...allRows,
                  {
                    ind: index,
                    row: initRow(),
                  },
                ]);
              }}
            >
              Add Row
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
});

export default EditableTable;
