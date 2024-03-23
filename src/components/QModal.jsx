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
const QModal = ({ triggerOpenModal = false, onCloseHandler }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (triggerOpenModal) {
      onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerOpenModal]);

  const onCloseModal = (callback) => {
    onCloseHandler();
    callback();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="p-5 m-auto">
              <div className="m-auto">
                <BsPatchCheckFill size={"45"} color=" green" />
              </div>
              <p>Félicitations, vous avez créé votre compte Beauty Booker.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={() => onCloseModal(onClose)}>
                Se connecter
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default QModal;
