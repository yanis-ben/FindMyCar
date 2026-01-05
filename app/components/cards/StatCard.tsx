import type { Stat } from "../../types";

export default function StatCard({ value, label }: Stat) {
  return (
    <div>
      <div className="text-5xl font-bold text-white mb-2">{value}</div>
      <div className="text-teal-100">{label}</div>
    </div>
  );
}
