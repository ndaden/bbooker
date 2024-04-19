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
    ></Controller>
  );
};

export default ControlledCheckbox;
