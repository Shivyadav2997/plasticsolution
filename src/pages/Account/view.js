import { Container, Row, Col, Button, Input, Table } from "reactstrap";
import { useParams } from "react-router-dom";
import { viewaccount } from "api/api";
import { useEffect, useRef,useState } from "react";
import { useSelector } from "react-redux";
import * as React from "react";
import { useDispatch } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import ReactDOM from "react-dom/client";
import CustomTab from "components/Custom/CustomTab";
import Loader from "components/Custom/Loader";
import { format } from "date-fns";
import HTMLReactParser from "html-react-parser";

const ViewAccount = () => {

  let { id } = useParams();
  const { user, fyear } = useSelector((store) => store.user);
  const [accountData,setAccountData] = useState({
    creditarray:[],
    creditarraywith:[],
    creditarraybill:[],
    debitarray:[],
    debitarraywith:[],
    debitarraybill:[],
    fullarray:[],
    total1:[],
  })
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const dispatch = useDispatch();
  

  const getAccountData = async () => {
    setLoading(true);
    var data = await viewaccount(
      user.token,
      id,
      filterDate.st,
      filterDate.et
    );
    if (data.data) {
      var data2 = data.data;
      setAccountData({
        creditarray: data2.creditarray || [],
        creditarraywith: data2.creditarraywith || [],
        creditarraybill: data2.creditarraybill || [],
        debitarray: data2.debitarray || [],
        debitarraywith: data2.debitarraywith || [],
        debitarraybill: data2.debitarraybill || [],
        fullarray: data2.fullarray || [],
        total1: data2.total1 || [],
      })
    } else {
      setAccountData({
        creditarray:[],
        creditarraywith:[],
        creditarraybill:[],
        debitarray:[],
        debitarraywith:[],
        debitarraybill:[],
        fullarray:[],
        total1:[],
      })
    }
    
    setLoading(false);
  };  
  
  const dateSelect = (start, end) => {
    setFilterDate({
      st: format(start.toDate(), "yyyy-MM-dd"),
      et: format(end.toDate(), "yyyy-MM-dd"),
    });
  };

  const getSum = (array,name,isFormatted = true) => {
    const sum =  array.reduce((tot,cur)=>{
            return tot + Number(cur[name]);
        },0)
        if(isFormatted){
            return sum.toLocaleString('hi-IN');
        }
        else{
            return sum;
        }
    
  }

  const getTotal = (array1,array2,name) => {
    let sum =  getSum(array1,name,false)
    sum -= getSum(array2,name,false)
    return "₹ " + Math.abs(sum).toLocaleString('hi-IN') + `${sum<0?" Dr":" Cr"}`;
  }

  const getSumSecondTab = (type,name) => {
    let array = accountData.fullarray.filter((x)=>x.type==type);
    const sum =  array.reduce((tot,cur)=>{
        return tot + Number(cur[name]);
    },0)
    return sum.toLocaleString('hi-IN');
  }

  const getSumThirdFourthTab = (array,name,isFormatted = true) => {
    const sum =  array.reduce((tot,cur)=>{
        return tot + Number(cur[name]);
    },0)
    if(isFormatted){
      return sum.toLocaleString('hi-IN');
    }
    else{
        return sum;
    }
  }

  const getTotalThirdFourthTab = (array1,array2,name)=>{
    let sum =  getSumThirdFourthTab(array1,name,false)
    sum -= getSumThirdFourthTab(array2,name,false)
    return "₹ " + Math.abs(sum).toLocaleString('hi-IN') + `${sum<0?" Dr":" Cr"}`;
  }

  useEffect(() => {
    getAccountData();
  }, [filterDate, fyear]);

  const getFirstTabData = (row,index,type) => {

    return (<tr>
        <td>{type==1?row.withoutamt:index < accountData.creditarray.length ? accountData.creditarray[index].withoutamt:""}</td>
        <td>{type==1?row.billamt:index < accountData.creditarray.length ? accountData.creditarray[index].billamt:""}</td>
        <td>{type==1?row.total:index < accountData.creditarray.length ? accountData.creditarray[index].total:""}</td>
        <td>{type==1?HTMLReactParser(row.desc):index < accountData.creditarray.length ? HTMLReactParser(accountData.creditarray[index].desc):""}</td>
        <td style={{ borderLeft: "1px dotted" }}>{type==2?row.withoutamt:index < accountData.debitarray.length ? accountData.debitarray[index].withoutamt:""}</td>
        <td>{type==2?row.billamt:index < accountData.debitarray.length ? accountData.debitarray[index].billamt:""}</td>
        <td>{type==2?row.total:index < accountData.debitarray.length ? accountData.debitarray[index].total:""}</td>
        <td>{type==2?HTMLReactParser(row.desc):index < accountData.debitarray.length ? HTMLReactParser(accountData.debitarray[index].desc):""}</td>
      </tr>)
    
  }

  const getSecondTabData = (row)=> {
    return (<tr>
      <td>{row.date}</td>
      <td>{HTMLReactParser(row.desc)}</td>
      <td>{row.type=="debit"?row.withoutamt:""}</td>
      <td>{row.type=="debit"?row.billamt:""}</td>
      <td>{row.type=="credit"?row.withoutamt:""}</td>
      <td>{row.type=="credit"?row.billamt:""}</td>
    </tr>)
  }

  const getThirdTabData = (row,index,type)=>{
    return (
      <tr>
        <td style={{ width: "10%" }}> {type==1?row.withoutamt:index < accountData.creditarraywith.length ? accountData.creditarraywith[index].withoutamt:""}</td>
        <td style={{ width: "40%" }}>
        {type==1?HTMLReactParser(row.desc):index < accountData.creditarraywith.length ? HTMLReactParser(accountData.creditarraywith[index].desc):""}
        </td>
        <td style={{ borderLeft: "1px dotted", width: "10%" }}>
        {type==2?row.withoutamt:index < accountData.debitarraywith.length ? accountData.debitarraywith[index].withoutamt:""}
        </td>
        <td style={{ width: "40%" }}>
        {type==2?HTMLReactParser(row.desc):index < accountData.debitarraywith.length ? HTMLReactParser(accountData.debitarraywith[index].desc):""}
        </td>
      </tr>
    )
  }

  const getFourthTabData = (row,index,type)=>{
    return (
      <tr>
        <td style={{ width: "10%" }}> {type==1?row.billamt:index < accountData.creditarraybill.length ? accountData.creditarraybill[index].billamt:""}</td>
        <td style={{ width: "40%" }}>
        {type==1?HTMLReactParser(row.desc):index < accountData.creditarraybill.length ? HTMLReactParser(accountData.creditarraybill[index].desc):""}
        </td>
        <td style={{ borderLeft: "1px dotted", width: "10%" }}>
        {type==2?row.billamt:index < accountData.debitarraybill.length ? accountData.debitarraybill[index].billamt:""}
        </td>
        <td style={{ width: "40%" }}>
        {type==2?HTMLReactParser(row.desc):index < accountData.debitarraybill.length ? HTMLReactParser(accountData.debitarraybill[index].desc):""}
        </td>
      </tr>
    )
  }
  const tabPan = [
    <>
      <Row>
        <Col xs="12">
          <div className=" p-3 mb-3">
            <div className="invoice">
              <Col xs="12" responsive>
                <Table
                  style={{ width: "100%" }}
                  className="ledger-table"
                  responsive={true}
                >
                  <tbody>
                    <tr>
                      <td colSpan={4} style={{ width: "50%" }}>
                        <b>Credit</b>
                      </td>
                      <td colSpan={4} style={{ width: "50%" }}>
                        <b>Debit</b>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>WithtAmt</b>
                      </td>
                      <td>
                        <b>BillAmt</b>
                      </td>
                      <td>
                        <b>Total</b>
                      </td>
                      <td>
                        <b>Description</b>
                      </td>
                      <td style={{ borderLeft: "1px dotted" }}>
                        <b>WithtAmt</b>
                      </td>
                      <td>
                        <b>BillAmt</b>
                      </td>
                      <td>
                        <b>Total</b>
                      </td>
                      <td>
                        <b>Description</b>
                      </td>
                    </tr>
                    {accountData.creditarray.length > accountData.debitarray.length ?
                    accountData.creditarray.map((val,index)=>{
                        return getFirstTabData(val,index,1)
                    })
                    : accountData.debitarray.map((val,index)=>{
                        return getFirstTabData(val,index,2)
                    })}
                    <tr>
                      <th>{getSum(accountData.creditarray,"withoutamt")}</th>
                      <th>{getSum(accountData.creditarray,"billamt")}</th>
                      <th>{getSum(accountData.creditarray,"total")}</th>
                      <th></th>
                      <th style={{ borderLeft: "1px dotted" }}>{getSum(accountData.debitarray,"withoutamt")}</th>
                      <th>{getSum(accountData.debitarray,"billamt")}</th>
                      <th>{getSum(accountData.debitarray,"total")}</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th colspan="1">WithoutAmt</th>
                      <th colspan="1">BillAmt</th>
                      <th colspan="1">Total</th>
                    </tr>
                    <tr>
                        <th colspan="1">{getTotal(accountData.creditarray,accountData.debitarray,"withoutamt")}</th>
                        <th colspan="1">{getTotal(accountData.creditarray,accountData.debitarray,"billamt")}</th>
                        <th colspan="1">{getTotal(accountData.creditarray,accountData.debitarray,"total")}</th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        Cls. Balance &nbsp;&nbsp;
                        <Button class="btn btn-default">
                          <b>{getTotal(accountData.creditarray,accountData.debitarray,"total")}</b>
                        </Button>
                      </th>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </div>
          </div>
        </Col>
      </Row>
    </>,
    <>
      <Row>
        <Col xs="12">
          <div className=" p-3 mb-3">
            <Col xs="12" responsive>
              <Table className="ledger-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <td>
                      <b>Date</b>
                    </td>
                    <td>
                      <b>Description</b>
                    </td>
                    <td colspan="2" align="center">
                      <b>Debit</b>
                    </td>
                    <td colspan="2" align="center">
                      <b>Credit</b>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <b>WithtAmt</b>
                    </td>
                    <td>
                      <b>BillAmt</b>
                    </td>
                    <td>
                      <b>WithtAmt</b>
                    </td>
                    <td>
                      <b>BillAmt</b>
                    </td>
                  </tr>
                </thead>

                <tbody>
                    {accountData.fullarray.map((val,index)=>{
                        return getSecondTabData(val)
                    })}
                  <tr>
                    <th></th>
                    <td align="right">
                      <b>Total</b>
                    </td>
                    <th>{getSumSecondTab("debit","withoutamt")}</th>
                    <th>{getSumSecondTab("debit","billamt")}</th>
                    <th>{getSumSecondTab("credit","withoutamt")}</th>
                    <th>{getSumSecondTab("credit","billamt")}</th>
                    <th></th>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </div>
        </Col>
      </Row>
    </>,
    <>
      <Row>
        <Col xs="12">
          <div className=" p-3 mb-3">
            <div className="invoice">
              <Col xs="12" responsive>
                <Table style={{ width: "100%" }} className="ledger-table">
                  <tbody>
                    <tr>
                      <td colSpan={2} style={{ width: "50%" }}>
                        <b>Credit</b>
                      </td>
                      <td colSpan={2} style={{ width: "50%" }}>
                        <b>Debit</b>
                      </td>
                    </tr>
                    {accountData.creditarraywith.length > accountData.debitarraywith.length ?
                    accountData.creditarraywith.map((val,index)=>{
                        return getThirdTabData(val,index,1)
                    })
                    : accountData.debitarraywith.map((val,index)=>{
                        return getThirdTabData(val,index,2)
                    })}
                    <tr>
                      <th>{getSumThirdFourthTab(accountData.creditarraywith,"withoutamt")}</th>

                      <th></th>

                      <th>{getSumThirdFourthTab(accountData.debitarraywith,"withoutamt")}</th>

                      <th></th>
                    </tr>
                    <tr>
                      <th colspan="2">
                        Cls. Balance &nbsp;&nbsp;
                        <Button class="btn btn-default">
                          <b>{getTotalThirdFourthTab(accountData.creditarraywith,accountData.debitarraywith,"withoutamt")}</b>
                        </Button>
                      </th>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </div>
          </div>
        </Col>
      </Row>
    </>,
    <>
      <Row>
        <Col xs="12">
          <div className=" p-3 mb-3">
            <div className="invoice">
              <Col xs="12" responsive>
                <Table style={{ width: "100%" }} className="ledger-table">
                  <tbody>
                    <tr>
                      <td colSpan={2} style={{ width: "50%" }}>
                        <b>Credit</b>
                      </td>
                      <td colSpan={2} style={{ width: "50%" }}>
                        <b>Debit</b>
                      </td>
                    </tr>

                    {accountData.creditarraybill.length > accountData.debitarraybill.length ?
                    accountData.creditarraybill.map((val,index)=>{
                        return getFourthTabData(val,index,1)
                    })
                    : accountData.debitarraybill.map((val,index)=>{
                        return getFourthTabData(val,index,2)
                    })}
                    <tr>
                      <th>{getSumThirdFourthTab(accountData.creditarraybill,"billamt")}</th>

                      <th></th>

                      <th>{getSumThirdFourthTab(accountData.debitarraybill,"billamt")}</th>

                      <th></th>
                    </tr>
                    <tr>
                      <th colspan="2">
                        Cls. Balance &nbsp;&nbsp;
                        <Button class="btn btn-default">
                          <b>{getTotalThirdFourthTab(accountData.creditarraybill,accountData.debitarraybill,"billamt")}</b>
                        </Button>
                      </th>
                    </tr>
                    
                  </tbody>
                </Table>
              </Col>
            </div>
          </div>
        </Col>
      </Row>
    </>,
  ];
  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <Row sm="2" xs="1" className="mb-2">
        <Col>
          <Row className="ml-0">
           <span className="pt-2 mr-2">WEBSTAR INFOWAY</span> 
            <Button
              className="btn-md btn-outline-danger"
              //   onClick={() => setShowAccount(false)}
            >
              1232 Cls Bal
            </Button>
          </Row>
        </Col>
        <Col>
          <Row className="justify-content-end mr-0">
            <Button className="btn-md btn-outline-primary">
              Account settlement
            </Button>
          </Row>
        </Col>
      </Row>
      <Row sm="2" xs="1" className="mb-2">
        <Col>
          <Row className="ml-0 mb-1">
            <CustomDatePicker
              onCallback={dateSelect}
              text="Ledger By Date"
            />
            <Button
              className="btn-md btn-outline-primary mb-1 ml-0"
              onClick={() => setFilterDate({ st: "", et: "" })}
            >
              Full Ledger
            </Button>

            <h1>
              <span style={{ fontSize: "18px" }}>
                {filterDate.st != "" &&
                  ` (${filterDate.st} to ${filterDate.et})`}
              </span>{" "}
            </h1>
          </Row>
        </Col>
        <Col>
          
        </Col>
      </Row>
        {loading ? (
              <Loader loading={loading} />
            ) : (
              <>
                <CustomTab
                    tabnames={["Ledger", "Full Ledger", "Without Ledger", "Bill Ledger"]}
                    tabpanes={tabPan}
                />
              </>
            )}
      </Container>
    </>
  );
};

export default ViewAccount;
