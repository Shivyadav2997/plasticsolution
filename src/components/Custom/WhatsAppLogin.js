import React, { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import { Button } from "reactstrap";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppLogin = ({ className, onClick }) => {
  const [show, setShow] = useState(false);

  const handleToggle = async () => {
    setShow(!show);
  };
  useEffect(() => {}, []);
  return (
    <>
      <CustomModal
        show={show}
        title={`WhatsApp Login`}
        handleToggle={handleToggle}
      >
        <iframe
          src="https://accountdigi.com/api/wpc.php"
          width="100%"
          height="400"
        ></iframe>
      </CustomModal>
      {/* className="btn-sm btn-outline-success d-none d-sm-block" */}
      <Button
        className={className}
        onClick={() => {
          handleToggle();
          if (onClick) {
            onClick();
          }
        }}
      >
        <FaWhatsapp size={18} />
      </Button>
    </>
  );
};

export default WhatsAppLogin;
