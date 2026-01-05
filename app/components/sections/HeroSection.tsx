import VinSearchForm from "../VinSearchForm";
import TrustBadge from "../ui/TrustBadge";
import { TRUST_BADGES } from "../../constants/trustBadges";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Vérifiez l&apos;historique de
          <span className="text-teal-600 dark:text-teal-400"> n&apos;importe quel véhicule</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          Achetez en toute confiance. Vérifiez le kilométrage, les accidents, les propriétaires et le statut vol avant d&apos;acheter.
        </p>

        <div className="max-w-2xl mx-auto mb-12">
          <VinSearchForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          {TRUST_BADGES.map((badge, index) => (
            <TrustBadge key={index} {...badge} />
          ))}
        </div>
      </div>
    </section>
  );
}
