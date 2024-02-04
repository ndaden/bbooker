import { Textarea } from "@nextui-org/react";
import React from "react";
import { Controller } from "react-hook-form";
import get from "lodash/get";

const ControlledTextArea = ({ name, control, rules, ...props }) => {
  return (
    <Controller
      defaultValue={""}
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState, formState }) => {
        const result = get(formState.errors, name)?.message;
        return (
          <Textarea
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

export default ControlledTextArea;
