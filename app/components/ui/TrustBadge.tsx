import Icon from "./Icon";

interface TrustBadgeProps {
  icon: string;
  text: string;
}

export default function TrustBadge({ icon, text }: TrustBadgeProps) {
  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <Icon path={icon} className="w-6 h-6 text-teal-600" />
      <span className="font-semibold text-gray-900 dark:text-white">{text}</span>
    </div>
  );
}
