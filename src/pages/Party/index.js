import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import { partyListGet, partyAdd, partyEdit, deleteRecord } from "api/api";
import ReactDOM from "react-dom/client";
import CustomModal from "components/Custom/CustomModal";
import { CustomInput } from "components/Custom/CustomInput";
import ConfirmationDialog from "components/Custom/ConfirmationDialog";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Loader from "components/Custom/Loader";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
const Party = () => {
  const [parties, setParties] = useState([]);
  const { user } = useSelector((store) => store.user);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const handleToggle = () => {
    if (show) {
      setParty(null);
    }
    setShow(!show);
  };
  const handleShowConfirmation = () => {
    if (showDelete) {
      setParty(null);
    }
    setShowDelete(!showDelete);
  };
  const validate = Yup.object({
    name: Yup.string().required("Required"),
    owner: Yup.string().required("Required"),
    email: Yup.string().email("Email is invalid"),
    mobile: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
  });

  const columns = [
    {
      title: "No",
      data: null,
    },
    {
      title: "Name",
      data: "b_name",
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
      title: "Address",
      data: "b_add",
    },
    {
      title: "Action",
      data: null,
    },
  ];

  var colDefs = [
    {
      targets: 2,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        root.render(
          <>
            <strong>{rowData.b_owner}</strong>
            <br />
            <a href={`tel:${rowData.mobile}`}>
              <FaPhoneAlt size={22} />
            </a>
            <a
              className="ml-1"
              href={`whatsapp://send?phone=:${rowData.mobile}`}
            >
              <FaWhatsapp size={25} />
            </a>
          </>
        );
      },
    },
  ];

  const deleteParty = async () => {
    if (party != null) {
      handleShowConfirmation();
      setLoading(true);
      const resp = await deleteRecord(user.token, {
        type: "party",
        id: party.id,
      });
      toast(resp.message);
      if (resp.data.sucess == 1) {
        getParties();
        setParty(null);
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
    setParties(data.data);
    setLoading(false);
  };

  const addParty = async (payload) => {
    setLoading(true);
    const resp = await partyAdd(user.token, payload);
    toast(resp.message);
    if (resp.data.sucess == 1) {
      handleToggle();
      getParties();
    }
  };

  const editParty = async (payload) => {
    const resp = await partyEdit(user.token, payload);
    toast(resp.message);
    if (resp.data.sucess == 1) {
      handleToggle();
      getParties();
    }
  };

  useEffect(() => {
    getParties();
  }, []);

  return (
    <>
      <Container className="pt-6" fluid>
        <CustomModal
          show={show}
          handleToggle={handleToggle}
          title={`${party ? "Edit" : "Add"} Party`}
          footer={
            <Button
              type="submit"
              className="mr-1"
              color="primary"
              block
              size="lg"
              onClick={() => {
                inputRef.current.handleSubmit();
              }}
            >
              Save
            </Button>
          }
        >
          <Formik
            initialValues={{
              name: party?.b_name,
              owner: party?.b_owner,
              mobile: party?.mobile,
              email: party?.email,
              gst: party?.gst,
              city: party?.b_city,
              add: party?.b_add,
            }}
            validationSchema={validate}
            onSubmit={(values) => {
              if (party) {
                editParty({ id: party.id, ...values });
              } else {
                addParty(values);
              }
            }}
            innerRef={inputRef}
          >
            {(formik) => (
              <div>
                <Form>
                  <CustomInput
                    placeholder="Bussiness Name"
                    name="name"
                    type="text"
                  />

                  <CustomInput
                    placeholder="Owner Name"
                    name="owner"
                    type="text"
                  />
                  <CustomInput
                    placeholder="Bussiness Mobile No."
                    name="mobile"
                    type="number"
                  />
                  <CustomInput
                    placeholder="Bussiness Email"
                    name="email"
                    type="email"
                  />
                  <CustomInput
                    placeholder="Bussiness GST No."
                    name="gst"
                    type="text"
                  />
                  <CustomInput
                    placeholder="Bussiness City"
                    name="city"
                    type="text"
                  />
                  <CustomInput
                    placeholder="Bussiness Address"
                    name="add"
                    type="text"
                  />
                </Form>
              </div>
            )}
          </Formik>
        </CustomModal>
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
                {parties.length > 0 && (
                  <CustomTable
                    cols={columns}
                    dark={false}
                    data={parties}
                    // columndefs={colDefs}
                    title="Party List"
                    deleteClick={deleteClick}
                    editClick={editClick}
                  />
                )}
              </div>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Party;
