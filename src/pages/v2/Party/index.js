import { Container, Row, Col, Button } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import { partyListGet, deleteRecord } from "api/apiv2";
import ReactDOM from "react-dom/client";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import Loader from "components/Custom/Loader";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import AddPartyModal from "../../Party/AddParty";

const Party = () => {
  var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    heightAuto: false,
    timer: 1500,
  });

  const [parties, setParties] = useState([]);
  const { user, fyear } = useSelector((store) => store.user);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const handleToggle = async () => {
    setShow(!show);
  };
  const handleShowConfirmation = () => {
    if (showDelete) {
      setParty(null);
    }
    setShowDelete(!showDelete);
  };

  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Name",
      data: "b_name",
      className: "all",
    },
    {
      title: "Owner",
      data: "b_owner",
    },
    {
      title: "Email/GST",
      data: "email",
    },
    {
      title: "Action",
      data: null,
    },
  ];

  var colDefs = [
    {
      targets: 1,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        root.render(
          <div
            style={{ widhth: "100%" }}
            className="d-flex justify-content-between"
          >
            <strong>{rowData.b_name}</strong>
            <span>
              <Button className="btn-neutral btn-icon btn-sm" color="default">
                <a href={`tel:${rowData.mobile}`}>
                  <FaPhoneAlt size={16} />
                </a>
              </Button>
              <Button className="btn-neutral btn-icon btn-sm">
                <a
                  className="ml-1"
                  href={`whatsapp://send?phone=:${rowData.mobile}`}
                >
                  <FaWhatsapp size={18} className="text-success" />
                </a>
              </Button>
            </span>
          </div>
        );
      },
    },
    {
      targets: 3,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        rowData.gst
          ? root.render(
              <div>
                {rowData.email}
                <br />
                {rowData.gst}
              </div>
            )
          : root.render(<div>{cellData}</div>);
      },
    },
  ];

  const deleteParty = async () => {
    if (party != null) {
      handleShowConfirmation();
      dispatch(setLoader(true));
      const resp = await deleteRecord(user.token, {
        type: "party",
        id: party.id,
      });

      if (resp.data.sucess == 1) {
        Toast.fire({
          icon: "success",
          title: resp.message,
        });
        getParties();
        setParty(null);
        dispatch(setLoader(false));
      } else {
        Toast.fire({
          icon: "error",
          timer: null,
          showCloseButton: true,
          title: resp.message,
        });
      }
    }
  };

  const deleteClick = (cellData, rowData, row, col) => {
    setParty(cellData);
    handleShowConfirmation();
  };

  const editClick = (cellData, rowData, row, col) => {
    setParty(cellData);
    handleToggle();
  };

  const getParties = async () => {
    setLoading(true);
    const data = await partyListGet(user.token);
    if (data.data) {
      setParties(data.data);
    } else {
      setParties([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    getParties();
  }, [fyear]);

  useEffect(() => {
    if (sessionStorage.getItem("openAdd")) {
      handleToggle();
      sessionStorage.removeItem("openAdd");
    }
  }, [sessionStorage.getItem("openAdd")]);

  return (
    <>
      <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
        <AddPartyModal
          show={show}
          party={party}
          Toast={Toast}
          callbackFunction={getParties}
          toggle={handleToggle}
        />
        <ConfirmationDialog
          show={showDelete}
          handleToggle={handleShowConfirmation}
          title="Delete"
          handleOkay={deleteParty}
          handleCancel={handleShowConfirmation}
        >
          Are You Sure you want to delete this ?
        </ConfirmationDialog>
        <Row sm="2" className="mb-2">
          <Col className="d-none d-sm-block"></Col>
          <Col>
            <Row className="justify-content-end mr-0">
              <Button
                className="btn-md btn-outline-primary"
                onClick={handleToggle}
              >
                Add Party
              </Button>
              <Button className="btn-md btn-outline-default">Add File</Button>
            </Row>
          </Col>
        </Row>
        {loading ? (
          <Loader loading={loading} />
        ) : (
          <>
            <Row>
              <div className="col">
                <CustomTable
                  cols={columns}
                  dark={false}
                  data={parties}
                  columndefs={colDefs}
                  title="Party List"
                  deleteClick={deleteClick}
                  editClick={editClick}
                />
              </div>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Party;
