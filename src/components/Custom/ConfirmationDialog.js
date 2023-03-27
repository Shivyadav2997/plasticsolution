import React from "react";
import { Modal, Button, ModalBody, ModalFooter } from "reactstrap";

const ConfirmationDialog = ({
  children,
  handleToggle,
  show,
  title,
  handleOkay,
  handleCancel,
}) => {
  return (
    <>
      <Modal isOpen={show} toggle={handleToggle}>
        <div class="modal-header">
          <h3 class="modal-title">{title}</h3>
        </div>
        <ModalBody className="pt-0">{children}</ModalBody>
        <ModalFooter>
          <>
            <Button
              type=""
              className="mr-1"
              color="primary"
              onClick={handleOkay}
            >
              OK
            </Button>
            <Button
              type=""
              className="mr-1"
              color="default"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ConfirmationDialog;
