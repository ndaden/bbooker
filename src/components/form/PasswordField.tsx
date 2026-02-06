import { Input, Button, Progress } from "@nextui-org/react";
import React, { useState, useMemo } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import get from "lodash/get";

interface PasswordStrength {
  score: number;
  label: string;
  color: "danger" | "warning" | "success";
}

interface PasswordFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  showStrengthIndicator?: boolean;
  showToggleVisibility?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: score * 20, label: "Faible", color: "danger" };
  if (score <= 3) return { score: score * 20, label: "Moyen", color: "warning" };
  return { score: score * 20, label: "Fort", color: "success" };
}

export function PasswordField<T extends FieldValues>({
  name,
  control,
  label,
  showStrengthIndicator = false,
  showToggleVisibility = true,
  size = "sm",
  className = "",
}: PasswordFieldProps<T>) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        const error = get(formState.errors, name);
        const errorMessage = error?.message as string | undefined;
        const strength = showStrengthIndicator 
          ? calculatePasswordStrength(field.value || "")
          : null;

        return (
          <div className="w-full">
            <Input
              {...field}
              type={isVisible ? "text" : "password"}
              label={label}
              size={size}
              isInvalid={!!error}
              errorMessage={errorMessage}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={className}
              endContent={
                showToggleVisibility && (
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {isVisible ? (
                      <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaEye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                )
              }
            />
            {showStrengthIndicator && field.value && strength && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-default-500">Force du mot de passe</span>
                  <span className={`text-xs font-medium text-${strength.color}`}>
                    {strength.label}
                  </span>
                </div>
                <Progress 
                  size="sm" 
                  value={strength.score} 
                  color={strength.color}
                  aria-label="Force du mot de passe"
                />
                <ul className="mt-2 text-xs text-default-400 space-y-1">
                  <li className={field.value.length >= 8 ? "text-success" : ""}>
                    {field.value.length >= 8 ? "✓" : "○"} 8 caractères minimum
                  </li>
                  <li className={/[A-Z]/.test(field.value) ? "text-success" : ""}>
                    {/[A-Z]/.test(field.value) ? "✓" : "○"} Une majuscule
                  </li>
                  <li className={/[a-z]/.test(field.value) ? "text-success" : ""}>
                    {/[a-z]/.test(field.value) ? "✓" : "○"} Une minuscule
                  </li>
                  <li className={/[0-9]/.test(field.value) ? "text-success" : ""}>
                    {/[0-9]/.test(field.value) ? "✓" : "○"} Un chiffre
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(field.value) ? "text-success" : ""}>
                    {/[^A-Za-z0-9]/.test(field.value) ? "✓" : "○"} Un caractère spécial
                  </li>
                </ul>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
