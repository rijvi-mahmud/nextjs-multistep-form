"use client";

import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  name: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex space-x-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;

          const borderClass = isCompleted
            ? "border-sky-600"
            : isCurrent
            ? "border-sky-600"
            : "border-gray-200";

          const textClass = isCompleted
            ? "text-sky-600"
            : isCurrent
            ? "text-sky-600"
            : "text-gray-500";

          return (
            <li key={step.id} className="flex-1">
              <div
                className={cn(
                  `group flex w-full flex-col border-t-4 pt-4`,
                  borderClass
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className={cn(`text-sm font-medium`, textClass)}>
                  {step.id} {(isCompleted || isCurrent) && "✔"}
                </span>
                <span className="text-sm font-medium text-zinc-500">
                  {step.name}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
