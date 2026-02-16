import { Input, InputProps } from "@heroui/react";
import React from "react";
import { Controller, Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import get from "lodash/get";

interface FormFieldProps<T extends FieldValues> extends Omit<InputProps, "name"> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "date";
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  size = "sm",
  ...props
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        const error = get(formState.errors, name);
        const errorMessage = error?.message as string | undefined;
        
        return (
          <Input
            {...field}
            type={type}
            label={label}
            size={size}
            isInvalid={!!error}
            errorMessage={errorMessage}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            {...props}
          />
        );
      }}
    />
  );
}
