import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { useEffect, useState } from "react";
import { profileGet } from "api/api";
import UserHeader from "components/Headers/UserHeader.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "features/User/UserSlice";
import logo from "assets/img/brand/logo.png";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { CustomInput } from "components/Custom/CustomInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { format, parse } from "date-fns";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, fyear } = useSelector((store) => store.user);
  const [profile, setProfile] = useState({
    id: "",
    b_name: "",
    b_owner: "",
    b_mo: "",
    b_mo2: null,
    b_mo3: null,
    b_mo4: null,
    b_add: "",
    b_city: "",
    b_gst: "",
    email: "",
    logo: "",
    lat: "",
    lng: "",
    letterpad: "",
    create_date: "",
  });

  const getProfile = async () => {
    dispatch(setLoader(true));
    var data = await profileGet(user.token);
    if (data.data.length > 0) {
      setProfile(data.data[0]);
    } else {
      setProfile({
        id: "",
        b_name: "",
        b_owner: "",
        b_mo: "",
        b_mo2: null,
        b_mo3: null,
        b_mo4: null,
        b_add: "",
        b_city: "",
        b_gst: "",
        email: "",
        logo: "",
        lat: "",
        lng: "",
        letterpad: "",
        create_date: "",
      });
    }
    dispatch(setLoader(false));
  };

  useEffect(() => {
    getProfile();
  }, [fyear]);
  return (
    <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <Row>
        <Col md={3}></Col>
        <Col md={6}>
          <Card style={{ borderTop: "3px solid #007bff" }}>
            <CardBody>
              <div className="text-center">
                <img src={logo} alt="plastic-logo" style={{ width: "200px" }} />
              </div>
              <h3
                className="text-center"
                style={{ fontSize: "21px", marginTop: "5px" }}
              >
                {profile.b_name}
              </h3>
              <p className="text-center text-muted">
                {profile.b_owner}
                <b>
                  <br />
                  Renew 284 Days Left
                </b>
              </p>
              <Formik
                initialValues={{
                  email: profile?.email,
                  gst: profile?.b_gst,
                  city: profile?.b_city,
                  add: profile?.b_add,
                  lat:profile?.lat,
                  long:profile?.lng
                }}
                validateOnBlur={false}
                validateOnChange={false}
              >
                {(formik) => (
                  <div>
                    <Form>
                      <ListGroup>
                        <ListGroupItem className="border-left-0 border-right-0">
                          <b>Mobile No. {profile.b_mo}</b>
                          <a className="float-right">
                            Create Date :{" "}
                            {profile.create_date != ""
                              ? format(
                                  new Date(profile.create_date),
                                  "dd-MMM-yyyy"
                                )
                              : ""}
                          </a>
                        </ListGroupItem>
                        <ListGroupItem className="border-left-0 border-right-0">
                          <b>Email</b>
                          <CustomInput size="sm" name="email" type="text" value={profile.email}/>
                        </ListGroupItem>
                        <ListGroupItem className="border-left-0 border-right-0">
                          <b>Gst No.</b>
                          <CustomInput size="sm" name="gst"  type="text" value={profile.b_gst}/>
                        </ListGroupItem>
                        <ListGroupItem className="border-left-0 border-right-0">
                          <b>City</b>
                          <CustomInput size="sm" name="city" type="text" value={profile.b_city} />
                        </ListGroupItem>
                        <ListGroupItem className="border-left-0 border-right-0">
                          <b>Address</b>
                          <CustomInput size="sm" name="add"  type="text" value={profile.b_add}/>
                        </ListGroupItem>
                        <ListGroupItem className="border-left-0 border-right-0">
                          <b>Latitude & Longitude</b>
                          <CustomInput size="sm" name="lat"  type="text" value={profile.lat}/>
                          <CustomInput size="sm" name="long"  type="text" value={profile.lng}/>
                        </ListGroupItem>
                      </ListGroup>
                      <Button
                        type="submit"
                        className="mr-1"
                        color="primary"
                        block
                        size="md"
                        onClick={() => {}}
                      >
                        Change Password
                      </Button>
                    </Form>
                  </div>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
