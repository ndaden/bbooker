import React from "react";
import { Controller } from "react-hook-form";
import get from "lodash/get";

const ControlledFileInput = ({ name, control, rules, ...props }) => {
  return (
    <Controller
      defaultValue={""}
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState, formState }) => {
        const result = get(formState.errors, name)?.message;
        console.log(formState.errors);
        return (
          <div>
            <div className="rounded-md bg-zinc-800 p-3">
              <div className="text-sm text-zinc-300 mb-2">
                Photo de votre centre
              </div>
              <div>
                <input
                  accept=".jpg,.png,.jpeg"
                  value={field.value?.fileName}
                  onChange={(event) => {
                    field.onChange(event.target.files[0]);
                  }}
                  {...props}
                />
              </div>
            </div>
            {!!result && (
              <div className="text-red-700 text-sm py-2">
                {result?.toString()}
              </div>
            )}
          </div>
        );
      }}
    ></Controller>
  );
};

export default ControlledFileInput;
