import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import { partyListGet, partyAdd, deleteRecord } from "api/api";
import ReactDOM from "react-dom/client";
import CustomModal from "components/Custom/CustomModal";
import { Formik, Form } from "formik";
import { CustomInput } from "components/Custom/CustomInput";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Loader from "components/Custom/Loader";
const Party = () => {
  const [parties, setParties] = useState([]);
  const { user } = useSelector((store) => store.user);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const handleToggle = () => {
    setShow(!show);
  };
  const validate = Yup.object({
    name: Yup.string().required("Required"),
    owner: Yup.string().required("Required"),
    email: Yup.string().email("Email is invalid").required("Required"),
    mobile: Yup.string().required("Required"),
    gst: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    add: Yup.string().required("Required"),
  });

  const colDefs = [
    {
      targets: 0,
      createdCell: (td, cellData, rowData, row, col) => {
        const root = ReactDOM.createRoot(td);
        root.render(`${row + 1}`);
      },
      orderable: false,
    },
  ];

  const columns = [
    {
      title: "Id",
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
      title: "Owner",
      data: "b_add",
    },
    {
      title: "Action",
      data: null,
    },
  ];

  const deleteClick = async (cellData, rowData, row, col) => {
    const resp = await deleteRecord(user.token, {
      type: "party",
      id: cellData.id,
    });
    toast(resp.message);
    if (resp.data.sucess == 1) {
      getParties();
    }
  };

  const getParties = async () => {
    setLoading(true);
    const data = await partyListGet(user.token);
    setParties(data.data);
    setLoading(false);
  };

  const addParty = async (payload) => {
    const resp = await partyAdd(user.token, payload);
    toast(resp.message);
    if (resp.data.sucess == 1) {
      getParties();
      handleToggle();
    }
  };

  useEffect(() => {
    getParties();
  }, []);

  return (
    <>
      <Container className="pt-6" fluid>
        {loading ? (
          <Loader loading={loading} />
        ) : (
          <>
            <Row xs="1">
              <Col>
                <Row className="float-sm-right">
                  <Col>
                    <Button className="btn-md" onClick={handleToggle}>
                      Add Party
                    </Button>
                    <CustomModal
                      show={show}
                      handleToggle={handleToggle}
                      title="Add Party"
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
                          name: "",
                          owner: "",
                          mobile: "",
                          email: "",
                          gst: "",
                          city: "",
                          add: "",
                        }}
                        validationSchema={validate}
                        onSubmit={(values) => {
                          addParty(values);
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
                  </Col>
                  <Col>
                    <Button className="btn-md">Add File</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <div className="col">
                {parties.length > 0 && (
                  <CustomTable
                    cols={columns}
                    dark={false}
                    data={parties}
                    columndefs={colDefs}
                    title="Party List"
                    deleteClick={deleteClick}
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
