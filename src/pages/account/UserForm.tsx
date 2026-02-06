import { Button, Checkbox, RadioGroup, Radio } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import QModal from "../../components/QModal";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";
import { signupSchema, SignupFormData } from "../../schemas/auth";
import { FormField, PasswordField } from "../../components/form";
import get from "lodash/get";

const UserForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordAgain: "",
      accountType: "STANDARD" as const,
      isAcceptConditionChecked: false,
    },
  });

  const { mutate: signup, isPending, isSuccess, isError, error, data } = useSignup();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const accountType = watch("accountType");

  useEffect(() => {
    if (isSuccess && data) {
      queryClient.invalidateQueries({ queryKey: ["AUTHENTICATED_USER"] });
      
      // Si c'est un professionnel, rediriger vers la création d'entreprise
      if (accountType === "OWNER") {
        reset();
        navigate("/new-business");
      } else {
        // Sinon, afficher le modal de succès et rediriger vers login
        setShowSuccessModal(true);
        reset();
      }
    }
    if (isError && error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Une erreur s'est produite lors de la création du compte"
      );
    }
  }, [isSuccess, isError, error, data, accountType, reset, queryClient, navigate]);

  const onSubmit = async (data: SignupFormData) => {
    if (isValid) {
      setServerError(null);
      signup({
        email: data.email,
        password: data.password,
        passwordAgain: data.passwordAgain,
        accountType: data.accountType,
      });
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const isAcceptConditionCheckedError = get(errors, "isAcceptConditionChecked")?.message as string | undefined;

  return (
    <form name="userForm" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-4 mb-6">
        <FormField
          name="email"
          control={control}
          label="Email"
          type="email"
          size="sm"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <Controller
          name="accountType"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Type de compte"
              value={field.value}
              onValueChange={field.onChange}
              size="sm"
            >
              <Radio value="STANDARD">
                <div>
                  <div className="font-medium">Client</div>
                  <div className="text-xs text-default-500">
                    Pour prendre des rendez-vous
                  </div>
                </div>
              </Radio>
              <Radio value="OWNER">
                <div>
                  <div className="font-medium">Professionnel</div>
                  <div className="text-xs text-default-500">
                    Pour gérer un établissement
                  </div>
                </div>
              </Radio>
            </RadioGroup>
          )}
        />
      </div>
      
      <div className="flex gap-4 mb-6">
        <PasswordField
          name="password"
          control={control}
          label="Mot de passe"
          showToggleVisibility={true}
          showStrengthIndicator={true}
          size="sm"
        />
      </div>
      
      <div className="flex gap-4 mb-6">
        <PasswordField
          name="passwordAgain"
          control={control}
          label="Re-saisir le mot de passe"
          showToggleVisibility={true}
          showStrengthIndicator={false}
          size="sm"
        />
      </div>

      <div>
        <Controller
          name="isAcceptConditionChecked"
          control={control}
          render={({ field }) => (
            <div>
              <Checkbox
                isSelected={field.value}
                onValueChange={field.onChange}
                size="sm"
              >
                J'accepte les conditions générales d'utilisation de BeautyBooker.
              </Checkbox>
              {isAcceptConditionCheckedError && (
                <div className="text-sm text-pink-800 ml-7 mt-1">
                  {isAcceptConditionCheckedError}
                </div>
              )}
            </div>
          )}
        />
      </div>
      
      {serverError && (
        <div 
          role="alert" 
          aria-live="polite"
          className="m-4 text-center text-red-400 font-bold"
        >
          {serverError}
        </div>
      )}
      
      <div className="flex justify-center lg:max-w-[50%] m-auto my-4">
        <Button 
          color="primary" 
          type="submit" 
          isLoading={isPending} 
          fullWidth
          disabled={!isValid || isPending}
        >
          Créer mon compte
        </Button>
      </div>
      
      <QModal
        triggerOpenModal={showSuccessModal}
        onCloseHandler={goToLogin}
      />
    </form>
  );
};

export default UserForm;
