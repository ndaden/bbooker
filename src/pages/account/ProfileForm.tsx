import { Input } from "@nextui-org/react";
import React from "react";
import { useForm } from "react-hook-form";
import ControlledCheckbox from "../../components/ControlledCheckbox";

const ProfileForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid },
    watch,
    reset,
    control,
  } = useForm();

  return (
    <>
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          label="Prénom"
          {...register("firstName", {
            required: { value: true, message: "First name is mandatory" },
          })}
          errorMessage={errors?.firstName?.message as string}
          size="sm"
        />
        <Input
          type="text"
          label="Nom"
          {...register("lastName", {
            required: { value: true, message: "Last name is mandatory" },
          })}
          errorMessage={errors?.lastName?.message as string}
          size="sm"
        />
      </div>
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          label="Adresse postale"
          {...register("address", {
            required: { value: true, message: "Address is mandatory" },
          })}
          errorMessage={errors?.address?.message as string}
          size="sm"
        />
      </div>
      <div>
        <ControlledCheckbox control={control} name="isProfessional" rules={[]}>
          Je suis un professionnel
        </ControlledCheckbox>
      </div>
    </>
  );
};

export default ProfileForm;
