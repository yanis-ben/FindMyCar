import type { Step } from "../../types";

export default function StepCard({ number, title, description }: Step) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}
