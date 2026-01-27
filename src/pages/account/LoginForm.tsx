import { Button, Card, CardBody, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuthenticateUser from "../../hooks/useAuthenticateUser";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const LoginForm = () => {
  const queryCache = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    authenticate,
    data: authenticationResult,
    isLoading,
    isError,
    error,
  } = useAuthenticateUser();

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const submitLoginForm = async (data) => {
    if (isValid) {
      authenticate(data);
    }
  };

  useEffect(() => {
    if (authenticationResult && authenticationResult.success) {
      queryCache.invalidateQueries({ queryKey: ["AUTHENTICATED_USER"] });
      navigate("/profile");
    } else {
      setErrorMessage(authenticationResult?.message);
    }
  }, [isLoading, authenticationResult]);

  return (
    <div>
      {isError ? (
        <div>Une erreur s'est produite</div>
      ) : (
        <>
          <Card>
            <CardBody>
              <form name="loginForm" onSubmit={handleSubmit(submitLoginForm)}>
                <div className="flex gap-4 mb-6">
                  <Input
                    type="text"
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Veuillez saisir votre e-mail.",
                      },
                    })}
                    label="E-mail"
                    validationBehavior="aria"
                    validationState={errors?.email ? "invalid" : "valid"}
                    errorMessage={errors?.email?.message}
                    formNoValidate
                    size="sm"
                    defaultValue=""
                  />
                </div>
                <div className="flex gap-4 mb-6">
                  <Input
                    type="password"
                    label="Mot de passe"
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Veuillez saisir votre mot de passe.",
                      },
                    })}
                    errorMessage={errors?.password?.message}
                    size="sm"
                    autoComplete="off"
                    defaultValue=""
                  />
                </div>
                {errorMessage && (
                  <div className="m-4 text-center text-red-400 font-bold">
                    Les informations fournies ne nous permettent de vous
                    identifier.
                  </div>
                )}
                <Button
                  color="primary"
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                >
                  S'identifier
                </Button>
              </form>
              <Button className="my-2" variant="ghost">
                Mot de passe oublié
              </Button>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};

export default LoginForm;
