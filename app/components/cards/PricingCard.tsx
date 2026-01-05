import type { PricingPlan } from "../../types";
import PricingFeature from "../ui/PricingFeature";

export default function PricingCard({ name, price, priceDetail, features, ctaText, isPopular, ctaVariant }: PricingPlan) {
  const isPrimary = ctaVariant === "primary";

  return (
    <div className={`border-2 ${isPrimary ? "border-teal-600 shadow-2xl transform scale-105" : "border-gray-200 dark:border-gray-700 hover:border-teal-600 dark:hover:border-teal-400"} rounded-2xl p-8 relative transition-all`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Populaire
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{name}</h3>
      <div className="mb-6">
        <span className="text-5xl font-bold text-gray-900 dark:text-white">{price}</span>
        {priceDetail && <span className="text-gray-500 dark:text-gray-400 ml-2">{priceDetail}</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <PricingFeature key={index} text={feature.text} />
        ))}
      </ul>
      <button className={`w-full py-3 font-semibold rounded-xl transition-colors ${
        isPrimary
          ? "bg-teal-600 text-white hover:bg-teal-700"
          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
      }`}>
        {ctaText}
      </button>
    </div>
  );
}
