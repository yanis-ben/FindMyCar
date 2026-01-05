import Icon from "../ui/Icon";
import type { Feature } from "../../types";

const gradientClasses: Record<string, string> = {
  'teal-50_emerald-100': 'from-teal-50 to-emerald-100',
  'blue-50_indigo-100': 'from-blue-50 to-indigo-100',
  'purple-50_pink-100': 'from-purple-50 to-pink-100',
  'orange-50_red-100': 'from-orange-50 to-red-100',
  'green-50_teal-100': 'from-green-50 to-teal-100',
  'yellow-50_orange-100': 'from-yellow-50 to-orange-100',
};

const iconBgClasses: Record<string, string> = {
  'teal-600': 'bg-teal-600',
  'blue-600': 'bg-blue-600',
  'purple-600': 'bg-purple-600',
  'orange-600': 'bg-orange-600',
  'green-600': 'bg-green-600',
  'yellow-600': 'bg-yellow-600',
};

export default function FeatureCard({ title, description, icon, gradientFrom, gradientTo, iconBg }: Feature) {
  const gradientKey = `${gradientFrom}_${gradientTo}`;
  const gradientClass = gradientClasses[gradientKey] || 'from-teal-50 to-emerald-100';
  const iconBgClass = iconBgClasses[iconBg] || 'bg-teal-600';

  return (
    <div className={`bg-gradient-to-br ${gradientClass} dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1`}>
      <div className={`w-14 h-14 ${iconBgClass} rounded-xl flex items-center justify-center mb-6`}>
        <Icon path={icon} className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-200">
        {description}
      </p>
    </div>
  );
}
