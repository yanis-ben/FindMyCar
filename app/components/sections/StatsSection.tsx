import StatCard from "../cards/StatCard";
import { STATS } from "../../constants/stats";

export default function StatsSection() {
  return (
    <section className="py-20 bg-linear-to-r from-teal-600 to-emerald-700 dark:from-teal-800 dark:to-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
