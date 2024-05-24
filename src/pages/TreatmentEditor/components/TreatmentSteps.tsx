import { HiCheckCircle } from 'react-icons/hi';

export const treatmentSteps = [
  { id: 0, title: 'Respostas' },
  { id: 1, title: 'Descrição' },
];

interface StepProps {
  step: {
    id: number;
    title: string;
  };
  index: number;
  currentStep: number;
  isLastStep: boolean;
}

const Step = ({ step, index, currentStep, isLastStep }: StepProps) => {
  const doneStepStyle =
    'text-sky-600 dark:text-sky-500 after:border-sky-200 dark:after:border-sky-700';
  const stepClass = `flex items-center ${
    currentStep > index ? doneStepStyle : ''
  }`;

  return (
    <li
      key={step.id}
      className={
        isLastStep
          ? stepClass
          : `${stepClass} md:w-full after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`
      }
    >
      <span className="flex items-center">
        {currentStep > index ? (
          <HiCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" />
        ) : (
          <span className="me-2">{index + 1}</span>
        )}
        {step.title}
      </span>
    </li>
  );
};

interface TreatmentSteps {
  currentStep: number;
}

export function TreatmentSteps({ currentStep }: TreatmentSteps) {
  return (
    <ol className="flex items-center justify-between w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
      {treatmentSteps.map((step, index) => (
        <Step
          key={step.id}
          step={step}
          index={index}
          currentStep={currentStep}
          isLastStep={index === treatmentSteps.length - 1}
        />
      ))}
    </ol>
  );
}
