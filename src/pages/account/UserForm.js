import { Button, Input } from "@nextui-org/react";
import useMutateUser from "../../hooks/useMutateUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { USERS_KEY } from "../../hooks/queryKeys";
import QModal from "../../components/QModal";
import ControlledCheckbox from "../../components/ControlledCheckbox";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  const queryCache = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid },
    watch,
    reset,
    control,
  } = useForm();

  const navigate = useNavigate();
  const { mutateUser, isLoading, data: mutateUserResult } = useMutateUser();
  const [serverResponse, setServerResponse] = useState();

  useEffect(() => {
    const getResult = async () => {
      const result = await mutateUserResult?.json();
      if (result && result.success) {
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
      const { email, password, passwordAgain } = data;
      await mutateUser({ email, password, passwordAgain });
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <form name="userForm" onSubmit={handleSubmit(submitUserForm)}>
      <div className="flex gap-4 mb-6">
        <Input
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "Veuillez saisir votre adresse e-mail.",
            },
            pattern: { value: /\S+@\S+\.\S+/, message: "Email is invalid." },
          })}
          label="Email"
          formNoValidate
          errorMessage={errors?.email?.message}
          size="sm"
        />
      </div>
      <div className="flex gap-4 mb-6">
        <Input
          type="password"
          label="Mot de passe"
          {...register("password", {
            required: {
              value: true,
              message: "Veuillez saisir un mot de passe.",
            },
          })}
          errorMessage={errors?.password?.message}
          size="sm"
        />
      </div>
      <div className="flex gap-4 mb-6">
        <Input
          type="password"
          label="Re-saisir le mot de passe"
          {...register("passwordAgain", {
            required: {
              value: true,
              message: "Veuillez re-saisir votre mot de passe.",
            },
            validate: (value) =>
              value === watch("password") ||
              "Les mots de passes ne sont pas identiques.",
          })}
          errorMessage={errors?.passwordAgain?.message}
          size="sm"
        />
      </div>

      <div>
        <ControlledCheckbox
          control={control}
          name="isAcceptConditionChecked"
          rules={{
            required: {
              value: true,
              message: "Cochez cette case si vous acceptez les CGUs.",
            },
          }}
        >
          J'accepte les conditions générales d'utilisation de BeautyBooker.
        </ControlledCheckbox>
      </div>
      {serverResponse && !serverResponse.success && (
        <div className="m-4 text-center text-red-400 font-bold">
          L'e-mail est déjà utilisé par un autre compte. Si le problème persiste
          veuillez nous contacter.
        </div>
      )}
      <div className="flex justify-center lg:max-w-[50%] m-auto my-4">
        <Button color="primary" type="submit" isLoading={isLoading} fullWidth>
          Créer mon compte
        </Button>
      </div>
      <QModal
        triggerOpenModal={serverResponse && serverResponse.success}
        onCloseHandler={goToLogin}
      />
    </form>
  );
};

export default UserForm;
