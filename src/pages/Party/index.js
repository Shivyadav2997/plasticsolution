import { Container, Row, Col, Button, Input } from "reactstrap";
// core components
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CustomTable from "components/Custom/CustomTable";
import * as React from "react";
import { useState } from "react";
import { partyListGet } from "api/api";
import ReactDOM from "react-dom/client";
import CustomModal from "components/Custom/CustomModal";
import { Formik, Form } from "formik";
import { CustomInput } from "components/Custom/CustomInput";
import * as Yup from "yup";
const Party = () => {
  const [parties, setParties] = useState([]);
  const { user } = useSelector((store) => store.user);
  const [show, setShow] = useState(false);
  const inputRef = useRef(null);
  const handleToggle = () => {
    setShow(!show);
  };
  const validate = Yup.object({
    Bname: Yup.string().required("Required"),
    Oname: Yup.string().required("Required"),
    BEmail: Yup.string().email("Email is invalid").required("Required"),
    BMobileNumber: Yup.string().required("Required"),
    Bgst: Yup.string().required("Required"),
    Bcity: Yup.string().required("Required"),
    Baddress: Yup.string().required("Required"),
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

  useEffect(() => {
    const getParties = async () => {
      const data = await partyListGet(user.token);
      var dummyParties = [];
      for (let index = 0; index < 100; index++) {
        dummyParties = [...dummyParties, ...data.data];
      }
      setParties(dummyParties);
    };
    getParties();
  }, []);
  return (
    <>
      <Container className="pt-6" fluid>
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
                      Bname: "",
                      Oname: "",
                      BMobileNumber: "",
                      BEmail: "",
                      Bgst: "",
                      Bcity: "",
                      Baddress: "",
                    }}
                    validationSchema={validate}
                    onSubmit={(values) => {
                      console.log(values);
                    }}
                    innerRef={inputRef}
                  >
                    {(formik) => (
                      <div>
                        <Form>
                          <CustomInput
                            placeholder="Bussiness Name"
                            name="Bname"
                            type="text"
                          />

                          <CustomInput
                            placeholder="Owner Name"
                            name="Oname"
                            type="text"
                          />
                          <CustomInput
                            placeholder="Bussiness Mobile No."
                            name="BMobileNumber"
                            type="number"
                          />
                          <CustomInput
                            placeholder="Bussiness Email"
                            name="BEmail"
                            type="email"
                          />
                          <CustomInput
                            placeholder="Bussiness GST No."
                            name="Bgst"
                            type="text"
                          />
                          <CustomInput
                            placeholder="Bussiness City"
                            name="Bcity"
                            type="text"
                          />
                          <CustomInput
                            placeholder="Bussiness Address"
                            name="Baddress"
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
            <CustomTable
              cols={columns}
              dark={false}
              data={parties}
              columndefs={colDefs}
              title="Party List"
            />
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Party;
