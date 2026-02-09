import React from "react";
import { Control, Controller, FieldValues, RegisterOptions } from "react-hook-form";
import get from "lodash/get";

interface ControlledFileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: Control<FieldValues>;
  rules?: RegisterOptions;
  label?: string;
}

const ControlledFileInput: React.FC<ControlledFileInputProps> = ({ name, control, rules, label, ...props }) => {
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
            <div className="rounded-md bg-zinc-800 p-3">
              <div className="text-sm text-zinc-300 mb-2">{label}</div>
              <div>
                <input
                  accept=".jpg,.png,.jpeg"
                  value={field.value?.fileName || ""}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    field.onChange(file || null);
                  }}
                  {...props}
                />
              </div>
            </div>
            {!!result && (
              <div className="text-red-700 text-sm py-2">
                {result}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default ControlledFileInput;
