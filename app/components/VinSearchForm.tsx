"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VinSearchForm() {
  const [vin, setVin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedVin = vin.trim().toUpperCase();

    if (!trimmedVin) {
      setError("Veuillez entrer un VIN ou une plaque d'immatriculation");
      return;
    }

    // Détecter format plaque française (AB-123-CD ou AB123CD)
    const plateRegex = /^[A-Z]{2}[-\s]?\d{3}[-\s]?[A-Z]{2}$/;
    if (plateRegex.test(trimmedVin)) {
      setError("❌ Recherche par plaque d'immatriculation non disponible dans la version MVP. Cette fonctionnalité nécessite une API payante (SIV ou Identité Auto) pour convertir la plaque en VIN. Utilisez directement le numéro VIN du véhicule.");
      return;
    }

    // Valider format VIN (17 caractères alphanumériques, sans I, O, Q)
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (!vinRegex.test(trimmedVin)) {
      setError("Format VIN invalide. Le VIN doit contenir 17 caractères alphanumériques (sans I, O, Q)");
      return;
    }

    router.push(`/report?vin=${encodeURIComponent(trimmedVin)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="Entrez le numéro VIN (17 caractères)"
            className="flex-1 px-6 py-4 text-lg rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-all"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Vérifier
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Exemple VIN:</strong> VF7NX9HD8DY598843 (Citroën), 1HGBH41JXMN109186 (Honda)
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            💡 <strong>Où trouver le VIN ?</strong> Carte grise (champ E), pare-brise, portière conducteur, ou capot moteur
          </p>
        </div>
      </div>
    </form>
  );
}
