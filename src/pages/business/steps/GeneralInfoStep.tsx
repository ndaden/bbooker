import React from "react";
import { Control, FieldErrors } from "react-hook-form";
import ControlledInput from "../../../components/ControlledInput";
import ControlledTextArea from "../../../components/ControlledTextArea";

interface GeneralInfoStepProps {
  control: Control<any>;
  errors: FieldErrors;
}

const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({
  control,
  errors,
}) => {
  return (
    <div>
      <div className="flex gap-4 mb-6">
        <ControlledInput
          control={control}
          name="businessName"
          rules={{
            required: "Veuillez saisir la raison sociale.",
          }}
          type="text"
          label="Raison sociale"
          placeholder="Ex: Salon Belle Allure"
          size="sm"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <ControlledTextArea
          control={control}
          name="businessDescription"
          rules={{
            required: "Veuillez saisir la description de votre centre.",
            minLength: {
              value: 20,
              message: "La description doit contenir au moins 20 caractères.",
            },
          }}
          label="Description"
          placeholder="Décrivez votre établissement, vos spécialités, votre ambiance..."
          minRows={4}
          size="sm"
        />
      </div>
    </div>
  );
};

export default GeneralInfoStep;
