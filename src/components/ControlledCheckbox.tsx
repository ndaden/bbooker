import { Checkbox } from "@nextui-org/react";
import React from "react";
import { Controller } from "react-hook-form";
import get from "lodash/get";

const ControlledCheckbox = ({ name, control, rules, children, ...props }) => {
  return (
    <Controller
      defaultValue={""}
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState, formState }) => {
        const result = get(formState.errors, name)?.message;
        return (
          <Checkbox
            value={field.value}
            onChange={field.onChange}
            isInvalid={!!result}
            {...props}
          >
            {children}
          </Checkbox>
        );
      }}
    ></Controller>
  );
};

export default ControlledCheckbox;
