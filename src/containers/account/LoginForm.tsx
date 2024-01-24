import { Button, Card, CardBody, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuthenticateUser from "../../hooks/useAuthenticateUser";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid },
    watch,
    reset,
  } = useForm();

  const { authenticate, data, isLoading, isError, error } =
    useAuthenticateUser();
  const navigate = useNavigate();

  const submitLoginForm = async (data) => {
    if (isValid) {
      sessionStorage.removeItem("auth_token");
      authenticate(data);
    }
  };

  useEffect(() => {
    if (!isLoading && data) {
      sessionStorage.setItem("auth_token", data.token);
      navigate("/profile");
    }
  }, [isLoading, data]);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isError && (error as Error).message !== "Unauthorized" ? (
        <div>Une erreur s'est produite</div>
      ) : (
        <>
          {!isLoading && (
            <Card>
              <CardBody>
                <form name="loginForm" onSubmit={handleSubmit(submitLoginForm)}>
                  <div className="flex gap-4 mb-6">
                    <Input
                      type="text"
                      {...register("username", {
                        required: {
                          value: true,
                          message: "Username is mandatory.",
                        },
                      })}
                      label="Username"
                      formNoValidate
                      size="sm"
                    />
                  </div>
                  <div className="flex gap-4 mb-6">
                    <Input
                      type="password"
                      label="Password"
                      {...register("password", {
                        required: {
                          value: true,
                          message: "Password is mandatory",
                        },
                      })}
                      validationState={errors?.password ? "invalid" : "valid"}
                      size="sm"
                    />
                  </div>
                  {isError && <div>Login ou mot de passe invalides</div>}
                  <Button color="primary" type="submit" fullWidth>
                    S'identifier
                  </Button>
                </form>
              </CardBody>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default LoginForm;
