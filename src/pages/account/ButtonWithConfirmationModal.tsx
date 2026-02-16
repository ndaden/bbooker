import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import React from "react";

interface ButtonWithConfirmationModalProps extends Omit<ButtonProps, "onClick"> {
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  label: string;
  type?: "button" | "submit" | "reset";
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  message: React.ReactNode;
  onClick?: () => void;
}

const ButtonWithConfirmationModal: React.FC<ButtonWithConfirmationModalProps> = ({
  className,
  isDisabled,
  isLoading,
  label,
  type,
  variant = "solid",
  color,
  message,
  onClick = () => undefined,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onClickHandler = () => {
    onClick();
    onOpen();
  };

  return (
    <>
      <Button
        type={type}
        variant={variant}
        color={color}
        onClick={onClickHandler}
        className={className}
        isDisabled={isDisabled}
        isLoading={isLoading}
      >
        {label}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Message de confirmation</ModalHeader>
              <ModalBody>{message}</ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Fermer</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ButtonWithConfirmationModal;
