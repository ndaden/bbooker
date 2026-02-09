import { RadioGroup, RadioGroupProps } from "@nextui-org/react";
import React from "react";
import { Control, Controller, FieldValues, RegisterOptions } from "react-hook-form";

interface ControlledRadioProps extends Omit<RadioGroupProps, "value" | "onValueChange"> {
  name: string;
  control: Control<FieldValues>;
  rules?: RegisterOptions;
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
}

const ControlledRadio: React.FC<ControlledRadioProps> = ({ name, control, rules, orientation, children, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        return (
          <RadioGroup
            value={field.value}
            orientation={orientation}
            name={name}
            onValueChange={field.onChange}
            {...props}
          >
            {children}
          </RadioGroup>
        );
      }}
    />
  );
};

export default ControlledRadio;
