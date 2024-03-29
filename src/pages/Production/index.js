import { Container, Row, Col, Button } from "reactstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import * as React from "react";
import { useState, useRef } from "react";
import CustomTab from "components/Custom/CustomTab";
import { productionGet } from "api/api";
import { format, lastDayOfMonth } from "date-fns";
import Loader from "components/Custom/Loader";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";
import { useHistory } from "react-router-dom";
const Production = () => {
  const history = useHistory();
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const [productions, setProductions] = useState({
    Manufacture: [],
    sale: [],
    purchase: [],
  });
  const childRef = useRef(null);
  const childRef2 = useRef(null);
  const childRef3 = useRef(null);
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const [month, setMonth] = useState("");
  const { user, fyear } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  var colDefs = [];

  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Product",
      data: "product",
    },
    {
      title: "Production",
      data: "production",
    },
    {
      title: "Production (Ton)",
      data: "ton",
    },
  ];

  const allMonths = [
    { label: "January (01)", value: "1" },
    { label: "February (02)", value: "2" },
    { label: "March (03)", value: "3" },
    { label: "April (04)", value: "4" },
    { label: "May (05)", value: "5" },
    { label: "June (06)", value: "6" },
    { label: "July (07)", value: "7" },
    { label: "August (08)", value: "8" },
    { label: "September (09)", value: "9" },
    { label: "October (10)", value: "10" },
    { label: "November (11)", value: "11" },
    { label: "December (12)", value: "12" },
  ];
  const getProductions = async () => {
    setLoading(true);
    var data = { data: { Manufacture: [], sale: [], purchase: [] } };
    if (month != "") {
      const today = new Date();
      today.setMonth(month - 1);
      data = await productionGet(
        user.token,
        format(today, "yyyy-MM-01"),
        format(lastDayOfMonth(today), "yyyy-MM-dd")
      );
    } else {
      data = await productionGet(user.token, filterDate.st, filterDate.et);
    }
    if (data.data) {
      var data2 = data.data;
      setProductions({
        Manufacture: data2.Manufacture || [],
        sale: data2.sale || [],
        purchase: data2.purchase || [],
      });
    } else {
      setProductions({ Manufacture: [], sale: [], purchase: [] });
    }
    setLoading(false);
  };

  useEffect(() => {
    getProductions();
  }, [filterDate, fyear, month]);

  const tabPan = [
    <CustomTable
      // rowCallBack={rowCallBack}
      cols={columns}
      columndefs={colDefs}
      dark={false}
      data={productions.Manufacture}
      title="Manufacture Product"
      withCard={false}
      hasEdit={false}
      hasDelete={false}
      custom={true}
      ref={childRef}
      numColumns={[4, 5]}
    />,
    <CustomTable
      cols={columns}
      columndefs={colDefs}
      dark={false}
      data={productions.sale}
      title="Sale Product"
      withCard={false}
      hasEdit={false}
      hasDelete={false}
      custom={true}
      ref={childRef2}
    />,
    <CustomTable
      cols={columns}
      columndefs={colDefs}
      dark={false}
      data={productions.purchase}
      title="Purchase Product"
      withCard={false}
      hasEdit={false}
      hasDelete={false}
      custom={true}
      ref={childRef3}
    />,
  ];

  const onChangeEvents = [
    () => {
      childRef.current.setResponsive();
    },
    () => {
      childRef2.current.setResponsive();
    },
    () => {
      childRef3.current.setResponsive();
    },
  ];

  const dateSelect = (start, end) => {
    setMonth("");
    setFilterDate({
      st: format(start.toDate(), "yyyy-MM-dd"),
      et: format(end.toDate(), "yyyy-MM-dd"),
    });
  };

  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <Row sm="2" xs="1" className="mb-2">
          <Col>
            <Row className="ml-0 mb-1 align-items-center">
              <CustomInputWoutFormik
                name="type"
                type="select"
                value={month}
                options={[
                  { label: "Filter By Month", value: "" },
                  ...allMonths,
                ].map((opt) => {
                  return <option value={opt.value}>{opt.label}</option>;
                })}
                onChange={(e) => {
                  setMonth(e.target.value);
                  if (e.target.value) {
                    setFilterDate({ st: "", et: "" });
                  }
                }}
              />
              <CustomDatePicker
                onCallback={dateSelect}
                text="Production By Date"
                className="ml-2"
              />
              <Button
                className="btn-md btn-outline-primary mb-1 ml-0"
                onClick={() => {
                  setFilterDate({ st: "", et: "" });
                  setMonth("");
                }}
              >
                All Production
              </Button>
            </Row>
          </Col>
          <Col>
            <Row className="justify-content-md-end mr-0  ml-0">
              <Button
                className="btn-md btn-outline-primary"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/admin/v1/product-stock");
                }}
              >
                Product Stock
              </Button>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>
              <span style={{ fontSize: "18px" }}>
                {filterDate.st != "" &&
                  ` (${filterDate.st} to ${filterDate.et})`}
                {month != "" && allMonths.find((x) => x.value == month).label}
              </span>{" "}
            </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            {loading ? (
              <Loader loading={loading} />
            ) : (
              <>
                <CustomTab
                  tabnames={[
                    "Manufacture Products",
                    "Sale Product",
                    "Purchase Product",
                  ]}
                  tabpanes={tabPan}
                  onChangeEvents={onChangeEvents}
                />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Production;
