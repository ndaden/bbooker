import { Button, Card, CardBody } from "@heroui/react";
import { addToast } from "@heroui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useLogin } from "../../hooks/useLogin";
import { loginSchema, LoginFormData } from "../../schemas/auth";
import { FormField, PasswordField } from "../../components/form";

const LoginForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/profile";
  
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin({
    onSuccess: async (data) => {
      if (data?.success) {
        addToast({
          title: "Connexion réussie",
          description: "Bienvenue sur BeautyBooker",
          color: "success",
        });
        await queryClient.refetchQueries({ queryKey: ["AUTHENTICATED_USER"] });
        // Restore appointment state if coming from appointment page
        const savedState = sessionStorage.getItem('appointmentState');
        if (returnTo === '/appointment' && savedState) {
          const { business } = JSON.parse(savedState);
          navigate(returnTo, { state: { business } });
        } else {
          navigate(returnTo);
        }
      } else {
        setErrorMessage(data?.message || "Les informations fournies ne nous permettent de vous identifier.");
      }
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur s'est produite lors de la connexion"
      );
    }
  });

  const onSubmit = async (formData: LoginFormData) => {
    if (isValid) {
      setErrorMessage(null);
      login(formData);
    }
  };

  return (
    <div>
      <Card>
        <CardBody>
          <form name="loginForm" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex gap-4 mb-6">
              <FormField
                name="email"
                control={control}
                label="E-mail"
                type="email"
                size="sm"
              />
            </div>
            <div className="flex gap-4 mb-6">
              <PasswordField
                name="password"
                control={control}
                label="Mot de passe"
                showToggleVisibility={true}
                showStrengthIndicator={false}
                size="sm"
              />
            </div>
            {errorMessage && (
              <div 
                role="alert" 
                aria-live="polite"
                className="m-4 text-center text-red-400 font-bold"
              >
                {errorMessage}
              </div>
            )}
            <Button
              color="primary"
              type="submit"
              fullWidth
              isLoading={isPending}
              disabled={!isValid || isPending}
            >
              S'identifier
            </Button>
          </form>
          <Button className="my-2" variant="ghost">
            Mot de passe oublié
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginForm;
