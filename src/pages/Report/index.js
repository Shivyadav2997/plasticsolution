import {
  Container,
  Row,
  Col,
  Button,
  Input,
  Table,
  CardBody,
  Card,
  Label,
} from "reactstrap";
import { useState, useEffect } from "react";
import {
  reportsGet,
  partyListGet,
  createReport,
  downloadReport,
} from "api/api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import { FormGroup } from "reactstrap";
import { format, parse, add, sub } from "date-fns";
import CustomDatePicker from "components/Custom/CustomDatePicker";
import { CustomInputWoutFormik } from "components/Custom/CustomInputWoutFormik";
import { createPortal } from "react-dom";
import { FaDownload, FaPrint, FaWhatsapp } from "react-icons/fa";
import WhatsappModal from "components/Custom/WhatsappModal";
import Swal from "sweetalert2";

const Report = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });
  const [reportOption, setReportOption] = useState({ main: [] });
  const [selectedReport, setSelectedReport] = useState({
    id: "",
    gname: "",
    name: "",
    date: "0",
    party: "0",
  });
  const [filterDate, setFilterDate] = useState({ st: "", et: "" });
  const [oldfilterDate, setOldFilterDate] = useState({ st: "", et: "" });
  const [invoiceHtml, setInvoiceHtml] = useState("");
  const [parties, setParties] = useState([]);
  const [selParty, setselParty] = useState("");
  const [oldselParty, setoldselParty] = useState("");
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [contentRef, setContentRef] = useState(null);
  const mountNode = contentRef?.contentWindow?.document?.body;
  const [wpData, setWPData] = useState({
    show: false,
    mobile: "",
    t: 0,
  });
  const toggleWPModal = () => {
    setWPData({ ...wpData, show: !wpData.show });
  };
  const printIframe = (id) => {
    const iframe = document.frames
      ? document.frames[id]
      : document.getElementById(id);
    const iframeWindow = iframe.contentWindow || iframe;

    iframe.focus();
    iframeWindow.print();

    return false;
  };
  const getReportOption = async () => {
    dispatch(setLoader(true));
    const resp = await reportsGet(user.token);
    setReportOption(resp.data);
    dispatch(setLoader(false));
  };
  const getTransactionParties = async () => {
    dispatch(setLoader(true));
    var data = await partyListGet(user.token);
    dispatch(setLoader(false));
    if (data.data) {
      setParties(data.data);
    }
  };

  const generateReport = async () => {
    dispatch(setLoader(true));
    var resp = await createReport(user.token, {
      p: selParty,
      st: filterDate.st,
      en: filterDate.et,
      id: selectedReport.id,
    });
    dispatch(setLoader(false));
    setoldselParty(selParty);
    setOldFilterDate(filterDate);
    setFilterDate({ st: "", et: "" });
    setselParty("");
    setInvoiceHtml(resp.data);
  };

  const dateSelect = (start, end) => {
    setFilterDate({
      st: format(start.toDate(), "yyyy-MM-dd"),
      et: format(end.toDate(), "yyyy-MM-dd"),
    });
  };

  const downloadOrWhatsappInvoice = async (whatsapp, mob) => {
    dispatch(setLoader(true));
    const resp = await downloadReport(user.token, {
      p: oldselParty,
      st: oldfilterDate.st,
      en: oldfilterDate.et,
      id: selectedReport.id,
      wp: whatsapp ? 1 : 0,
      mo: mob,
    });
    dispatch(setLoader(false));
    if (whatsapp) {
      toggleWPModal();
      Toast.fire({
        icon: resp.data.success == 1 ? "success" : "error",
        title: resp.data.msg || "Something went wrong",
      });
    } else {
      const url = resp.data.pdfurl;
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    getReportOption();
    getTransactionParties();
  }, []);

  return (
    <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <Row className="text-center mb-2 d-none d-lg-flex" noGutters={true}>
        <Col xs="auto" className="d-flex">
          <CustomInputWoutFormik
            name="gpname"
            type="select"
            label=""
            value={selectedReport.id}
            onChange={(e) =>
              setSelectedReport(
                Object.values(reportOption).find(
                  (record) => record.id == e.target.value
                )
              )
            }
            options={[
              <option value="">Select Report type</option>,
              ...reportOption.main.map((opt) => {
                const matchingObjects = Object.values(reportOption).filter(
                  (obj) => obj?.gname == opt
                );
                return (
                  <optgroup label={opt}>
                    {matchingObjects.map((opt2) => {
                      return <option value={opt2.id}>{opt2.name}</option>;
                    })}
                  </optgroup>
                );
              }),
            ]}
          />
          &nbsp;
          {selectedReport.party == "1" && (
            <CustomInputWoutFormik
              label=""
              type="select"
              options={[
                <option value="">Select Party</option>,
                ...parties.map((opt) => {
                  return <option value={opt.id}>{opt.b_name}</option>;
                }),
              ]}
              value={selParty}
              onChange={(e) => {
                setselParty(e.target.value);
              }}
            />
          )}
          &nbsp;
          {selectedReport.date == "1" && (
            <CustomDatePicker
              size="btn-sm"
              onCallback={dateSelect}
              text="Date"
            />
          )}
          {filterDate.st != "" && ` (${filterDate.st} to ${filterDate.et})`}
          &nbsp;
          <Button
            className="btn-sm btn-outline-primary"
            onClick={generateReport}
          >
            Generate Report
          </Button>
        </Col>
      </Row>
      <Row
        className="text-center mb-2 justify-content-center align-items-center d-flex d-lg-none"
        noGutters={true}
      >
        <Col xs="12" sm="6" md={3}>
          <CustomInputWoutFormik
            name="gpname"
            type="select"
            label=""
            value={selectedReport.id}
            onChange={(e) =>
              setSelectedReport(
                Object.values(reportOption).find(
                  (record) => record.id == e.target.value
                )
              )
            }
            options={[
              <option value="">Select Report type</option>,
              ...reportOption.main.map((opt) => {
                const matchingObjects = Object.values(reportOption).filter(
                  (obj) => obj?.gname == opt
                );
                return (
                  <optgroup label={opt}>
                    {matchingObjects.map((opt2) => {
                      return <option value={opt2.id}>{opt2.name}</option>;
                    })}
                  </optgroup>
                );
              }),
            ]}
          />
        </Col>

        {selectedReport.party == "1" && (
          <Col xs="12" sm="6" md={3}>
            <CustomInputWoutFormik
              label=""
              type="select"
              options={[
                <option value="">Select Party</option>,
                ...parties.map((opt) => {
                  return <option value={opt.id}>{opt.b_name}</option>;
                }),
              ]}
              value={selParty}
              onChange={(e) => {
                setselParty(e.target.value);
              }}
            />
          </Col>
        )}
        {selectedReport.date == "1" && (
          <Col xs="12" sm="6" md={3}>
            <CustomDatePicker
              size="btn-sm"
              onCallback={dateSelect}
              text="Date"
            />

            {filterDate.st != "" && ` (${filterDate.st} to ${filterDate.et})`}
          </Col>
        )}
        <Col xs="12" sm="6" md={3}>
          <Button
            className="btn-sm btn-outline-primary"
            onClick={generateReport}
          >
            Generate Report
          </Button>
        </Col>
      </Row>
      <div style={{ minHeight: "70vh" }}>
        {/* {invoiceHtml != "" && ( */}
        <iframe
          style={{ minWidth: "100%", minHeight: "70vh" }}
          ref={setContentRef}
          id="iframe"
        >
          {mountNode &&
            createPortal(
              <div dangerouslySetInnerHTML={{ __html: invoiceHtml }}></div>,
              mountNode
            )}
        </iframe>
        {/* )} */}
      </div>
      {/* <Row className="text-center mb-2 justify-content-center align-items-center d-none d-sm-flex"> */}
      <Row className="w-100">
        <Col xs={12} lg={9}></Col>
        <Col xs={12} lg={3}>
          <div className="d-flex">
            <Button
              type="submit"
              className="mr-1 btn-outline-success"
              size="sm"
              onClick={toggleWPModal}
            >
              <FaWhatsapp color="success" /> Whatsapp
            </Button>
            <Button
              type="submit"
              className="btn-outline-primary"
              size="sm"
              onClick={() => downloadOrWhatsappInvoice(false)}
            >
              <FaDownload color="primary" /> Download
            </Button>{" "}
            <Button
              type="submit"
              className="mr-1 btn-outline-warning"
              size="sm"
              onClick={() => printIframe("iframe")}
            >
              <FaPrint color="warning" /> Print
            </Button>
          </div>
        </Col>
      </Row>
      {/* </Row> */}
      <WhatsappModal
        show={wpData.show}
        handleToggle={toggleWPModal}
        mobile={wpData.mobile}
        withMsg={false}
        api={downloadOrWhatsappInvoice}
        params={[true]}
      />
    </Container>
  );
};

export default Report;
