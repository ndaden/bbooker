import { Button, Input } from "@nextui-org/react";
import useMutateUser from "../../hooks/useMutateUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useFetchRoles from "../../hooks/useFetchRoles";
import { useQueryClient } from "@tanstack/react-query";
import { USERS_KEY } from "../../hooks/queryKeys";
import QModal from "../../components/QModal";

const UserForm = () => {
  const queryCache = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid },
    watch,
    reset,
  } = useForm();
  const { roles } = useFetchRoles();
  const { mutateUser, isLoading, data: mutateUserResult } = useMutateUser();
  const [serverResponse, setServerResponse] = useState();

  useEffect(() => {
    const getResult = async () => {
      const result = await mutateUserResult?.json();
      if (result && !result.error) {
        await queryCache.invalidateQueries({ queryKey: [USERS_KEY] });
        reset();
      }
      setServerResponse(result);
    };

    getResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutateUserResult]);

  const submitUserForm = async (data) => {
    if (isValid) {
      const jsonUserData = toDatabaseUser(data);
      await mutateUser(jsonUserData);
    }
  };

  const toDatabaseUser = (formData) => {
    const standardRole =
      roles.length > 0 ? roles.find((role) => role.name === "standard") : {};
    return {
      username: formData.username,
      password: formData.password,
      roles: [standardRole._id],
      email: {
        address: formData.email,
      },
      profile: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: {
          street1: formData.address,
        },
      },
    };
  };

  return (
    <form name="userForm" onSubmit={handleSubmit(submitUserForm)}>
      <div className="flex gap-4 mb-6">
        <Input
          {...register("username", {
            required: { value: true, message: "Username is mandatory." },
            min: {
              value: 5,
              message: "Username must contain more than 5 characters.",
            },
            max: {
              value: 20,
              message: "Username must contain less than 20 characters.",
            },
            pattern: {
              value: /^[a-zA-Z0-9]+$/,
              message: "Username format is invalid.",
            },
          })}
          type="text"
          label="Nom d'utilisateur"
          validationState={
            errors?.username || serverResponse?.error?.username
              ? "invalid"
              : "valid"
          }
          errorMessage={
            errors?.username?.message ||
            serverResponse?.error?.username?.message
          }
          size="sm"
        />
        <Input
          type="email"
          {...register("email", {
            required: { value: true, message: "Email is mandatory." },
            pattern: { value: /\S+@\S+\.\S+/, message: "Email is invalid." },
          })}
          label="Email"
          formNoValidate
          validationState={errors?.email ? "invalid" : "valid"}
          errorMessage={errors?.email?.message}
          size="sm"
        />
      </div>
      <div className="flex gap-4 mb-6">
        <Input
          type="password"
          label="Mot de passe"
          {...register("password", {
            required: { value: true, message: "Password is mandatory" },
          })}
          validationState={errors?.password ? "invalid" : "valid"}
          errorMessage={errors?.password?.message}
          size="sm"
        />
        <Input
          type="password"
          label="Re-saisir le mot de passe"
          {...register("passwordAgain", {
            required: {
              value: true,
              message: "Type your password a second time.",
            },
            validate: (value) =>
              value === watch("password") || "Passwords don't match.",
          })}
          validationState={errors?.passwordAgain ? "invalid" : "valid"}
          errorMessage={errors?.passwordAgain?.message}
          size="sm"
        />
      </div>
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          label="Prénom"
          {...register("firstName", {
            required: { value: true, message: "First name is mandatory" },
          })}
          validationState={errors?.firstName ? "invalid" : "valid"}
          errorMessage={errors?.firstName?.message}
          size="sm"
        />
        <Input
          type="text"
          label="Nom"
          {...register("lastName", {
            required: { value: true, message: "Last name is mandatory" },
          })}
          validationState={errors?.lastName ? "invalid" : "valid"}
          errorMessage={errors?.lastName?.message}
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
          validationState={errors?.address ? "invalid" : "valid"}
          errorMessage={errors?.address?.message}
          size="sm"
        />
      </div>
      <div className="flex justify-center lg:max-w-[50%] m-auto">
        <Button color="primary" type="submit" disabled={isLoading} fullWidth>
          Créer mon compte
        </Button>
      </div>
      <QModal triggerOpenModal={serverResponse && !serverResponse.error} />
    </form>
  );
};

export default UserForm;
