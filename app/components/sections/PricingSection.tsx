import SectionHeader from "../ui/SectionHeader";
import PricingCard from "../cards/PricingCard";
import { PRICING_PLANS } from "../../constants/pricing";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Tarifs transparents"
          description="Choisissez l'offre qui vous convient"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
