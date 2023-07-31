import { Container, Row, Col, Button } from "reactstrap";
// core components
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTab from "components/Custom/CustomTab";
import * as React from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";
import { getSettings, updateSettings, ewayGet, ewayAddEdit } from "api/apiv2";

const Setting = () => {
  const dispatch = useDispatch();
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });
  const { user, fyear } = useSelector((store) => store.user);
  const [setting, setSetting] = useState({
    id: "",
    uid: "",
    salew: "",
    purchasew: "",
    reportw: "",
    primary_bank: "",
    create_date: "",
  });
  const [ewayData, setEwayData] = useState({
    id: "",
    ewbuser: "",
    ewbpass: "",
    govuser: "",
    govpass: "",
  });
  const [bankList, setBankList] = useState([]);

  const onChangeEvents = [
    () => {
      getSetting();
    },
    () => {
      getEwayBill();
    },
  ];

  const getSetting = async () => {
    dispatch(setLoader(true));
    const resp = await getSettings(user.token);
    setSetting(resp.data.setting);
    setBankList(resp.data.bank_list);
    dispatch(setLoader(false));
  };

  const saveSetting = async () => {
    dispatch(setLoader(true));
    const resp = await updateSettings(user.token, {
      s: setting.salew,
      p: setting.purchasew,
      r: setting.reportw,
      b: setting.primary_bank,
    });
    Toast.fire({
      icon: resp.data.success == 1 ? "success" : "error",
      title: resp.data.msg || "Something wen't wrong",
    });
    dispatch(setLoader(false));
  };

  const getEwayBill = async () => {
    dispatch(setLoader(true));
    const resp = await ewayGet(user.token);
    if (resp.data && resp.data.length > 0) {
      setEwayData(resp.data[0]);
    }
    dispatch(setLoader(false));
  };

  const saveEwayBill = async () => {
    dispatch(setLoader(true));
    const resp = await ewayAddEdit(user.token, {
      ewbuser: ewayData.ewbuser,
      ewbpass: ewayData.ewbpass,
      govuser: ewayData.govuser,
      govpass: ewayData.govpass,
    });
    Toast.fire({
      icon: resp.data.sucess == 1 ? "success" : "error",
      title: resp.data.msg || "Something wen't wrong",
    });
    dispatch(setLoader(false));
  };

  useEffect(() => {
    // getSetting();
  }, []);
  const tabPan = [
    <>
      <div className="p-4">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <CustomInputWoutFormik
              label="Sale Bill Whatsapp"
              type="select"
              options={[
                <option value="off">Off</option>,
                ...["1", "2", "3", "4"].map((opt) => (
                  <option value={opt}>{`${opt}`}</option>
                )),
              ]}
              value={setting.salew}
              onChange={(e) => {
                setSetting({ ...setting, salew: e.target.value });
              }}
            />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <CustomInputWoutFormik
              label="Purchase Bill Whatsapp"
              type="select"
              options={[
                <option value="off">Off</option>,
                ...["1", "2", "3", "4"].map((opt) => (
                  <option value={opt}>{`${opt}`}</option>
                )),
              ]}
              value={setting.purchasew}
              onChange={(e) => {
                setSetting({ ...setting, purchasew: e.target.value });
              }}
            />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <CustomInputWoutFormik
              label="Daily Whatsapp report"
              type="select"
              options={[
                <option value="off">Off</option>,
                <option value="on">On</option>,
              ]}
              value={setting.reportw}
              onChange={(e) => {
                setSetting({ ...setting, reportw: e.target.value });
              }}
            />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <CustomInputWoutFormik
              label="Primary Bank in Bill"
              type="select"
              value={setting.primary_bank}
              options={[
                ...bankList.map((opt) => (
                  <option
                    value={opt.id}
                  >{`${opt.bank_name}-${opt.ac_holder}`}</option>
                )),
              ]}
              onChange={(e) => {
                setSetting({ ...setting, primary_bank: e.target.value });
              }}
            />
          </Col>
        </Row>
        <Row className="justify-content-end mr-0 pt-1">
          <Button className="btn-md btn-outline-success" onClick={saveSetting}>
            Update
          </Button>
        </Row>
      </div>
    </>,
    <>
      <div className="p-4">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <CustomInputWoutFormik
              label="Eway bill User"
              type="input"
              value={ewayData.ewbuser}
              onChange={(e) => {
                setEwayData({ ...ewayData, ewbuser: e.target.value });
              }}
            />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <CustomInputWoutFormik
              label="Eway bill Pass"
              type="input"
              value={ewayData.ewbpass}
              onChange={(e) => {
                setEwayData({ ...ewayData, ewbpass: e.target.value });
              }}
            />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <CustomInputWoutFormik
              label="Gov User"
              type="input"
              value={ewayData.govuser}
              onChange={(e) => {
                setEwayData({ ...ewayData, govuser: e.target.value });
              }}
            />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <CustomInputWoutFormik
              label="Gov Pass"
              type="input"
              value={ewayData.govpass}
              onChange={(e) => {
                setEwayData({ ...ewayData, govpass: e.target.value });
              }}
            />
          </Col>
        </Row>
        <Row className="justify-content-end mr-0 pt-1">
          <Button className="btn-md btn-outline-success" onClick={saveEwayBill}>
            Update
          </Button>
        </Row>
      </div>
    </>,
  ];
  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <Row>
          <Col>
            <CustomTab
              tabnames={["Setting", "Eway Bill"]}
              tabpanes={tabPan}
              onChangeEvents={onChangeEvents}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Setting;
