import SectionHeader from "../ui/SectionHeader";
import FeatureCard from "../cards/FeatureCard";
import { FEATURES } from "../../constants/features";

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white dark:bg-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Que contient un rapport FindMyCar ?"
          description="Toutes les informations essentielles pour acheter en toute confiance"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
