import { Input, InputProps } from "@nextui-org/react";
import React from "react";
import { Control, Controller, FieldValues, RegisterOptions } from "react-hook-form";
import get from "lodash/get";

interface ControlledInputProps extends Omit<InputProps, "value" | "onChange"> {
  name: string;
  control: Control<FieldValues>;
  rules?: RegisterOptions;
}

const ControlledInput: React.FC<ControlledInputProps> = ({ name, control, rules, ...props }) => {
  return (
    <Controller
      defaultValue=""
      name={name}
      control={control}
      rules={rules}
      render={({ field, formState }) => {
        const result = get(formState.errors, name)?.message as string | undefined;
        return (
          <Input
            value={field.value}
            onChange={field.onChange}
            isInvalid={!!result}
            errorMessage={result}
            {...props}
          />
        );
      }}
    />
  );
};

export default ControlledInput;
