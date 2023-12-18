import { Button, Card, CardBody, Input } from "@nextui-org/react"
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors = {}, isValid },
        watch,
        reset,
    } = useForm();

    const [isLoading, setIsLoading] = useState();
    const [serverResponse, setServerResponse] = useState();

    const submitLoginForm = async (data) => {
        if (isValid) {
            console.log('login...')
        }
    }

    return <div className="grid grid-cols-10 m-auto">
    <Card className="col col-span-6 ">
        <CardBody>
        <form name="loginForm" onSubmit={handleSubmit(submitLoginForm)}>
        <div className="flex gap-4 mb-6">
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
                label="Password"
                {...register("password", {
                    required: { value: true, message: "Password is mandatory" },
                })}
                validationState={errors?.password ? "invalid" : "valid"}
                errorMessage={errors?.password?.message}
                size="sm"
            />

        </div>

        <Button color="primary" type="submit" disabled={isLoading} fullWidth>
            S'identifier
        </Button>
    </form>
    </CardBody></Card>
    </div>
}

export default Login