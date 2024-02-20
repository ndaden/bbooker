import React from "react";
import ControlledInput from "../../components/ControlledInput";
import ControlledTextArea from "../../components/ControlledTextArea";
import ControlledFileInput from "../../components/ControlledFileInput";

const GeneralInfoSection = ({ control, validation, hidden }) => {
  return (
    <div className={`my-5 ${hidden ? "hidden" : ""}`}>
      <div className="text-2xl">Informations générales</div>
      <ControlledInput
        control={control}
        name="businessName"
        rules={validation.businessName}
        type="text"
        label="Raison sociale"
        className="my-4"
      />
      <ControlledTextArea
        control={control}
        name="businessDescription"
        rules={validation.businessDescription}
        label="Description"
        placeholder="Présentation de votre activité"
        className="my-4"
      />
      <ControlledFileInput
        type="file"
        control={control}
        name="businessImage"
        rules={validation.businessImage}
      />
    </div>
  );
};

export default GeneralInfoSection;
