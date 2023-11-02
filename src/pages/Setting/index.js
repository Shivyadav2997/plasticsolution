import {
  Container,
  Row,
  Col,
  Button,
  Label,
  InputGroup,
  InputGroupAddon,
  FormGroup,
} from "reactstrap";
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
import {
  getSettings,
  updateSettings,
  ewayGet,
  ewayAddEdit,
  getAccountant,
  findaccountant,
  updateAccountant,
} from "api/api";
import { FaSearch } from "react-icons/fa";

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
    gstuser: "",
    gstpass: "",
  });
  const [bankList, setBankList] = useState([]);
  const [accountCa, setAccountCa] = useState({
    auth_token: "",
    Name: "",
    type: "",
  });
  const onChangeEvents = [
    () => {
      getSetting();
    },
    () => {
      getEwayBill();
    },
    () => {
      getAccountantData();
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
      gstuser: ewayData.gstuser,
      gstpass: ewayData.gstpass,
    });
    Toast.fire({
      icon: resp.data.sucess == 1 ? "success" : "error",
      title: resp.data.msg || "Something wen't wrong",
    });
    dispatch(setLoader(false));
  };

  const getAccountantData = async () => {
    dispatch(setLoader(true));
    const resp = await getAccountant(user.token);
    if (resp.data && resp.data.length > 0) {
      setAccountCa(resp.data[0]);
    }
    dispatch(setLoader(false));
  };

  const findAccount = async () => {
    dispatch(setLoader(true));
    const resp = await findaccountant(user.token, {
      auth_token: accountCa.auth_token,
    });
    if (resp.data && resp.data.length > 0) {
      setAccountCa(resp.data[0]);
    }
    dispatch(setLoader(false));
  };

  const saveAccount = async () => {
    dispatch(setLoader(true));
    const resp = await updateAccountant(user.token, {
      auth_token: accountCa.auth_token,
      type: accountCa.type,
    });
    Toast.fire({
      icon: resp.data.success == 1 ? "success" : "error",
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
          <Col xs="12" sm="6" lg="3">
            <CustomInputWoutFormik
              label="GST User"
              type="input"
              value={ewayData.gstuser}
              onChange={(e) => {
                setEwayData({ ...ewayData, gstuser: e.target.value });
              }}
            />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <CustomInputWoutFormik
              label="GST Pass"
              type="input"
              value={ewayData.gstpass}
              onChange={(e) => {
                setEwayData({ ...ewayData, gstpass: e.target.value });
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
    <>
      <div className="p-4">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <FormGroup className="mb-1">
              <label className="form-control-label">Auth Token</label>
              <InputGroup className="input-group-alternative">
                <CustomInputWoutFormik
                  label="Type"
                  type="select"
                  options={[
                    <option value="">Select Type</option>,
                    ...["1", "2", "All"].map((opt) => (
                      <option value={opt}>{`${opt}`}</option>
                    )),
                  ]}
                  value={accountCa.type}
                  onChange={(e) => {
                    setAccountCa({ ...accountCa, type: e.target.value });
                  }}
                  withFormGroup={false}
                />
                {/* <CustomInputWoutFormik
                  placeholder="Auth Token"
                  name="gst"
                  type="text"
                  value={accountCa.auth_token}
                  onChange={(e) => {
                    setAccountCa({
                      ...accountCa,
                      Name: "",
                      auth_token: e.target.value,
                    });
                  }}
                /> */}
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <FormGroup className="mb-1">
              <label className="form-control-label">Auth Token</label>
              <InputGroup className="input-group-alternative">
                <CustomInputWoutFormik
                  placeholder="Auth Token"
                  name="gst"
                  type="text"
                  withFormGroup={false}
                  value={accountCa.auth_token}
                  onChange={(e) => {
                    setAccountCa({
                      ...accountCa,
                      Name: "",
                      auth_token: e.target.value,
                    });
                  }}
                />
                <InputGroupAddon addonType="append">
                  <Button
                    className="pt-0 pb-0"
                    color="primary"
                    type="button"
                    onClick={findAccount}
                  >
                    <FaSearch />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <label>Name: {accountCa.Name}</label>
            </FormGroup>
          </Col>
        </Row>
        <Row className="justify-content-end mr-0 pt-1">
          {accountCa.Name.replace("-", "") != "" && (
            <Button
              className="btn-md btn-outline-success"
              onClick={saveAccount}
            >
              Save
            </Button>
          )}
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
              tabnames={["Setting", "Eway Bill", "Accountant_CA"]}
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
