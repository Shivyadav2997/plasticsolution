import {
  Container,
  Row,
  Col,
  Button,
  Table,
  FormGroup,
  Card,
  CardBody,
} from "reactstrap";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { format, parse } from "date-fns";
import { transactionPartyGet } from "api/api";
import EditableTable from "components/Custom/EditableTable";
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";

const CreateInvoice = () => {
  const stateObj = {
    item: "",
    pUnit: "",
    pQty: "",
    uQty: "",
    rate: "",
    bRate: "",
    gst: "",
    tax: "",
    wAmt: "",
    bAmt: "",
  };
  const childRef = useRef(null);
  const [parties, setParties] = useState([]);
  const { user } = useSelector((store) => store.user);

  const [index, setIndex] = useState(0);

  const [allData, setAllData] = useState([{ ind: index, data: stateObj }]);
  const [allRows, setAllRows] = useState([]);

  // console.log("1", allData);
  const getTransactionParties = async () => {
    var data = await transactionPartyGet(user.token);
    if (data.data) {
      setParties(data.data);
    }
  };

  useEffect(() => {
    getTransactionParties();
    // setAllData([{ ind: index, data: stateObj }],console.log("all"));
    // setIndex((oldIndex) => oldIndex + 1);
    // setAllRows([
    //   {
    //     ind: index,
    //     row: (
    //       <>
    //         <td>
    //           <CustomInputWoutFormik
    //             id="item"
    //             onChange={(e) => {
    //               // var curData = allData.find((x) => x.ind == index);
    //               // console.log("1", e.currentTarget);
    //               console.log("2", allData);
    //             }}
    //           />
    //         </td>
    //         <td>1</td>
    //         <td>23</td>
    //         <td>3</td>
    //         <td>4</td>
    //         <td>5</td>
    //         <td>6</td>
    //         <td>7</td>
    //         <td>8</td>
    //         <td>9</td>
    //       </>
    //     ),
    //   },
    // ]);
  }, []);

  useEffect(() => {
    // if (index > 0) {
    setAllRows([
      ...allRows,
      {
        ind: index,
        row: (
          <>
            <td>
              <CustomInputWoutFormik
                id="item"
                value={allData.find((x) => x.ind == index).data["item"]}
                onChange={(e) => {
                  // var curData = allData.find((x) => x.ind == index);
                  var allRowsData = [...allData];
                  allRowsData.find((x) => x.ind == index).data["item"] =
                    e.target.value;
                  // curData.data[e.currentTarget.id] = e.target.value;
                  // console.log("2", curData);
                  setAllData(allRowsData);
                }}
              />
            </td>
            <td>1</td>
            <td>23</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td>7</td>
            <td>8</td>
            <td>9</td>
          </>
        ),
      },
    ]);
    // }
  }, [index]);

  return (
    <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <Card>
        <CardBody>
          <Row>
            <Col xs="4">
              <CustomInputWoutFormik
                label="Party Name"
                type="select"
                options={[
                  <option value="">Select Party</option>,
                  ...parties.map((opt) => {
                    return <option value={opt.pid}>{opt.b_name}</option>;
                  }),
                ]}
              />
            </Col>
            <Col xs="2">
              <CustomInputWoutFormik
                label="Bill Type"
                type="select"
                options={[<option value="">Select Type</option>]}
              />
            </Col>
            <Col xs="2">
              <CustomInputWoutFormik label="Bill No" />
            </Col>
            <Col xs="2">
              <CustomInputWoutFormik
                label="Date"
                type="date"
                defaultValue={format(new Date(), "yyyy-MM-dd")}
              />
            </Col>
          </Row>
          <Row>
            <Col xs="2">
              <CustomInputWoutFormik label="Transport" />
            </Col>
            <Col xs="2">
              <CustomInputWoutFormik label="L.R.No." />
            </Col>
            <Col xs="2">
              <CustomInputWoutFormik label="Vehicle No." />
            </Col>
          </Row>
          <h1>{allRows.length}</h1>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                {[
                  "Item",
                  "PackUnit",
                  "PckQty",
                  "UnitQty",
                  "Rate",
                  "BillRate",
                  "Gst%",
                  "Tax",
                  "WtoutAmt",
                  "BillAmt",
                  "Action",
                ].map((v) => {
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
                          setAllData(allData.filter((x) => x.ind != v.ind));
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
                      setAllData([
                        ...allData,
                        { ind: index + 1, data: stateObj },
                      ]);
                      setIndex(index + 1);
                    }}
                  >
                    Add Row
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>

          <Row className="justify-content-md-end mr-0">
            <Button
              className="btn-md btn-outline-success"
              onClick={() => console.log("save", allData)}
            >
              Save
            </Button>
            <Button className="btn-md btn-outline-danger">Cancel</Button>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default CreateInvoice;
