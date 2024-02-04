import { Input } from "@nextui-org/react";
import React from "react";
import { Controller } from "react-hook-form";
import get from "lodash/get";

const ControlledInput = ({ name, control, rules, ...props }) => {
  return (
    <Controller
      defaultValue={""}
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState, formState }) => {
        const result = get(formState.errors, name)?.message;
        return (
          <Input
            value={field.value}
            onChange={field.onChange}
            isInvalid={!!result}
            errorMessage={result?.toString()}
            {...props}
          />
        );
      }}
    ></Controller>
  );
};

export default ControlledInput;
