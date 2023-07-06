import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import { gstListGet, gstMonthListGet, gstr1json } from "api/apiv2";
import Loader from "components/Custom/Loader";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import ReactDOM from "react-dom/client";

const GST = () => {
  const [gstData, setGSTData] = useState([]);
  const [monthGST, setMonthGST] = useState([]);
  const [selMonth, setSelMonth] = useState(null);
  const { user, fyear } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const gstJSON = async (rowData) => {
    const id = rowData.m1;
    dispatch(setLoader(true));
    const resp = await gstr1json(user.token, id, 0);
    dispatch(setLoader(false));
    if (resp.data.pdfurl) {
      const url = resp.data.pdfurl;
      let alink = document.createElement("a");
      alink.href = url;
      alink.target = "_blank";
      alink.download = url.substring(url.lastIndexOf("/") + 1);
      alink.click();
    }
  };

  const columns = [
    {
      title: "Month",
      data: "month",
      className: "all",
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        root.render(
          <a
            className="text-primary cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setSelMonth(rowData);
            }}
          >
            {cellData}
          </a>
        );
      },
    },
    {
      title: "Sale GST",
      data: "sale gst",
    },
    {
      title: "Purchase GST",
      data: "purchase gst",
    },
    {
      title: "Payable GST",
      data: "Payble gst",
      className: "all",
    },
    {
      title: "Action",
      data: null,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        root.render(
          <>
            {" "}
            <div className="d-flex gap-10">
              <div>
                <Button
                  className="btn-outline-primary btn-icon btn-sm"
                  color="default"
                  onClick={() => gstJSON(rowData)}
                >
                  <span>EwayBillJSON</span>
                </Button>
              </div>
            </div>
          </>
        );
      },
      className: "all",
    },
  ];

  const monColumns = [
    {
      title: "No",
      data: null,
    },

    {
      title: "Party",
      data: "name",
      className: "all",
    },
    {
      title: "Type",
      data: "type",
    },
    {
      title: "Invoice Value",
      data: "invoice value",
    },
    {
      title: "Sale GST",
      data: "purchase gst",
    },
    {
      title: "Purchase GST",
      data: "purchase gst",
    },
  ];
  const getGSTList = async () => {
    setLoading(true);
    if (selMonth == null) {
      const resp = await gstListGet(user.token);
      if (resp.data && resp.data.gstr1) setGSTData(resp.data.gstr1);
      else setGSTData([]);
    } else {
      const resp = await gstMonthListGet(user.token, {
        m: selMonth.m1,
        mm: selMonth.m2,
      });
      if (resp.data && resp.data.gstr1m) setMonthGST(resp.data.gstr1m);
      else setMonthGST([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    getGSTList();
  }, [fyear, selMonth]);

  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        {loading ? (
          <Loader loading={loading} />
        ) : (
          <>
            {selMonth != null ? (
              <>
                <Row sm="2" className="mb-2">
                  <Col className="">
                    <Row className="ml-0">
                      <h1>{selMonth.month}</h1>
                      <Button
                        className="btn-sm btn-outline-primary ml-2 mt-2 mb-2"
                        onClick={() => setSelMonth(null)}
                      >
                        All
                      </Button>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <div className="col">
                    <CustomTable
                      cols={monColumns}
                      dark={false}
                      data={monthGST}
                      //   columndefs={colDefs}
                      title="GST List"
                      hasEdit={false}
                      hasDelete={false}
                    />
                  </div>
                </Row>
              </>
            ) : (
              <Row>
                <div className="col">
                  <CustomTable
                    cols={columns}
                    dark={false}
                    data={gstData}
                    //   columndefs={colDefs}
                    title="GST List"
                    hasEdit={false}
                    hasDelete={false}
                    showNoCol={false}
                    pageLength={12}
                  />
                </div>
              </Row>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default GST;
