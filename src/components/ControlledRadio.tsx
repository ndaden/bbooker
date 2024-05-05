import { RadioGroup, Switch } from "@nextui-org/react";
import React from "react";
import { Controller } from "react-hook-form";
// import get from "lodash/get";

const ControlledRadio = ({ name, control, rules, orientation, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState, formState }) => {
        // const result = get(formState.errors, name)?.message;
        return (
          <RadioGroup
            value={field.value}
            orientation={orientation}
            name={name}
            onValueChange={field.onChange}
            {...props}
          >
            {props.children}
          </RadioGroup>
        );
      }}
    ></Controller>
  );
};

export default ControlledRadio;
