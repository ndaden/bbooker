import { Checkbox, CheckboxProps } from "@heroui/react";
import React from "react";
import { Control, Controller, FieldValues, RegisterOptions } from "react-hook-form";
import get from "lodash/get";

interface ControlledCheckboxProps extends Omit<CheckboxProps, "value" | "onChange"> {
  name: string;
  control: Control<FieldValues>;
  rules?: RegisterOptions;
  children: React.ReactNode;
}

const ControlledCheckbox: React.FC<ControlledCheckboxProps> = ({ name, control, rules, children, ...props }) => {
  return (
    <Controller
      defaultValue=""
      name={name}
      control={control}
      rules={rules}
      render={({ field, formState }) => {
        const result = get(formState.errors, name)?.message as string | undefined;
        return (
          <div>
            <Checkbox value={field.value} onChange={field.onChange} {...props}>
              {children}
            </Checkbox>
            {result && (
              <div className="text-sm text-pink-800 ml-7">{result}</div>
            )}
          </div>
        );
      }}
    />
  );
};

export default ControlledCheckbox;
