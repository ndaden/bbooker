import { Textarea, TextAreaProps } from "@heroui/react";
import React from "react";
import { Control, Controller, FieldValues, RegisterOptions } from "react-hook-form";
import get from "lodash/get";

interface ControlledTextAreaProps extends Omit<TextAreaProps, "value" | "onChange"> {
  name: string;
  control: Control<FieldValues>;
  rules?: RegisterOptions;
}

const ControlledTextArea: React.FC<ControlledTextAreaProps> = ({ name, control, rules, ...props }) => {
  return (
    <Controller
      defaultValue=""
      name={name}
      control={control}
      rules={rules}
      render={({ field, formState }) => {
        const result = get(formState.errors, name)?.message as string | undefined;
        return (
          <Textarea
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

export default ControlledTextArea;
