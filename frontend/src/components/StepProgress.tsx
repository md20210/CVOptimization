/**
 * StepProgress Component
 * Displays the 7-step optimization pipeline with live progress
 */

import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

export interface Step {
  number: number;
  name: string;
  description: string;
}

interface StepProgressProps {
  currentStep: number; // 0-7 (0 = not started, 7 = completed)
  steps?: Step[];
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

const DEFAULT_STEPS: Step[] = [
  { number: 1, name: 'Keywords', description: 'Extracting job keywords' },
  { number: 2, name: 'Gap Analysis', description: 'Analyzing CV vs requirements' },
  { number: 3, name: 'Summary', description: 'Optimizing professional summary' },
  { number: 4, name: 'Bullets', description: 'Rewriting experience bullets (STAR)' },
  { number: 5, name: 'Skills', description: 'Reorganizing skills section' },
  { number: 6, name: 'Assembly', description: 'Assembling optimized CV' },
  { number: 7, name: 'QA Check', description: 'Final quality assurance' },
];

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  steps = DEFAULT_STEPS,
  variant = 'horizontal',
  className = '',
}) => {
  const getStepStatus = (stepNumber: number): 'completed' | 'active' | 'pending' => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  const getStepIcon = (stepNumber: number) => {
    const status = getStepStatus(stepNumber);

    if (status === 'completed') {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }

    if (status === 'active') {
      return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    }

    return <Circle className="w-6 h-6 text-gray-400" />;
  };

  const getStepClasses = (stepNumber: number) => {
    const status = getStepStatus(stepNumber);
    const baseClasses = 'transition-all duration-300';

    if (status === 'completed') {
      return `${baseClasses} opacity-100`;
    }

    if (status === 'active') {
      return `${baseClasses} opacity-100 scale-105`;
    }

    return `${baseClasses} opacity-50`;
  };

  if (variant === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step) => {
          const status = getStepStatus(step.number);

          return (
            <div
              key={step.number}
              className={`flex items-start space-x-4 ${getStepClasses(step.number)}`}
            >
              <div className="flex-shrink-0 mt-1">{getStepIcon(step.number)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm font-medium ${
                      status === 'active'
                        ? 'text-blue-600 dark:text-blue-400'
                        : status === 'completed'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Step {step.number}: {step.name}
                  </span>

                  {status === 'active' && (
                    <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      In Progress
                    </span>
                  )}

                  {status === 'completed' && (
                    <span className="px-2 py-0.5 text-xs font-medium text-green-600 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                      Complete
                    </span>
                  )}
                </div>

                <p
                  className={`mt-1 text-sm ${
                    status === 'pending' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.number}>
              <div className={`flex flex-col items-center ${getStepClasses(step.number)}`}>
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    status === 'completed'
                      ? 'bg-green-100 border-green-500 dark:bg-green-900'
                      : status === 'active'
                      ? 'bg-blue-100 border-blue-500 dark:bg-blue-900 animate-pulse'
                      : 'bg-gray-100 border-gray-300 dark:bg-gray-800'
                  }`}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : status === 'active' ? (
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  ) : (
                    <span className="text-sm font-semibold text-gray-400">{step.number}</span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-medium ${
                      status === 'active'
                        ? 'text-blue-600 dark:text-blue-400'
                        : status === 'completed'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-200 dark:bg-gray-700 relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500 ${
                      step.number < currentStep ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current step description */}
      {currentStep > 0 && currentStep <= steps.length && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default StepProgress;
