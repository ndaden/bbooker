import React from "react";
import { Control, FieldErrors } from "react-hook-form";
import ControlledInput from "../../../components/ControlledInput";
import ControlledTextArea from "../../../components/ControlledTextArea";
import ControlledFileInput from "../../../components/ControlledFileInput";
import KeywordsInput from "../../../components/form/KeywordsInput";

interface GeneralInfoStepProps {
  control: Control<any>;
  errors: FieldErrors;
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
}

const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({
  control,
  errors,
  keywords,
  onAddKeyword,
  onRemoveKeyword,
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

      <div className="mb-6">
        <KeywordsInput
          control={control}
          errors={errors}
          keywords={keywords}
          onAddKeyword={onAddKeyword}
          onRemoveKeyword={onRemoveKeyword}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <ControlledInput
          control={control}
          name="businessAddress"
          rules={{
            required: "Veuillez saisir l'adresse de votre centre.",
            minLength: {
              value: 10,
              message: "L'adresse doit contenir au moins 10 caractères.",
            },
          }}
          type="text"
          label="Adresse"
          placeholder="Ex: 123 rue de la Paix, 75001 Paris"
          size="sm"
        />
      </div>

      <div className="mb-6">
        <ControlledFileInput
          control={control}
          name="businessImage"
          type="file"
          label="Photo de couverture"
          rules={{
            validate: (value: File | null) => {
              if (!value || value.size === 0) return true;
              const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
              if (!validTypes.includes(value.type)) {
                return "Format non supporté. Utilisez JPG, PNG ou WEBP";
              }
              if (value.size > 2 * 1024 * 1024) {
                return "L'image ne doit pas dépasser 2MB";
              }
              return true;
            },
          }}
        />
      </div>
    </div>
  );
};

export default GeneralInfoStep;
