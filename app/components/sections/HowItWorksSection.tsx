import SectionHeader from "../ui/SectionHeader";
import StepCard from "../cards/StepCard";
import { STEPS } from "../../constants/steps";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Comment ça marche ?"
          description="Obtenez votre rapport en 3 étapes simples"
        />

        <div className="grid md:grid-cols-3 gap-12">
          {STEPS.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
