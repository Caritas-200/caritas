import React, { useState } from "react";

interface ProgressBarProps {
  currentStep: number; // Current step (1, 2, or 3)
  totalSteps?: number; // Total steps (default is 3)
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 3,
}) => {
  // Calculate the progress percentage based on the current step
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full pb-4 mb-4 border-b-2">
      {/* Progress Bar Container */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span className={currentStep >= 1 ? "font-bold text-blue-600" : ""}>
          Step 1
        </span>
        <span className={currentStep >= 2 ? "font-bold text-blue-600" : ""}>
          Step 2
        </span>
        <span className={currentStep === 3 ? "font-bold text-blue-600" : ""}>
          Final
        </span>
      </div>
    </div>
  );
};

// Example usage of ProgressBar component with step navigation
const ProgressBarDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <ProgressBar currentStep={currentStep} />

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4 ">
        <button
          onClick={handlePrevious}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 ${
            currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentStep === 1}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
            currentStep === 3 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentStep === 3}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProgressBar;
