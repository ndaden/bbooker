import React from "react";
import { cn } from "@nextui-org/react";

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step Item */}
              <div className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
                    {
                      "bg-primary text-white": isCurrent,
                      "bg-success text-white": isCompleted,
                      "bg-default-200 text-default-500": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <div
                    className={cn("text-sm font-medium", {
                      "text-primary": isCurrent,
                      "text-default-900": isCompleted,
                      "text-default-400": isUpcoming,
                    })}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-default-400 mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-[2px] flex-1 transition-all duration-300 -mt-12",
                    {
                      "bg-success": index < currentStep,
                      "bg-default-200": index >= currentStep,
                    }
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
