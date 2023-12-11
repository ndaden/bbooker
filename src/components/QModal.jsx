import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
const QModal = ({ triggerOpenModal = false }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (triggerOpenModal) {
      onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerOpenModal]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="p-5 m-auto">
              <div className="m-auto">
                <BsPatchCheckFill size={"45"} color=" green" />
              </div>
              <p>Account created successfully.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cool!
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default QModal;
