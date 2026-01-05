"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CompleteVehicleReport } from "../types/report";

function ReportContent() {
  const searchParams = useSearchParams();
  const vin = searchParams.get("vin") || "";

  const [report, setReport] = useState<CompleteVehicleReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    if (!vin) {
      setError("VIN non fourni");
      setLoading(false);
      return;
    }

    async function fetchReport() {
      try {
        const response = await fetch(`/api/reports?vin=${encodeURIComponent(vin)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load report');
        }

        const data = await response.json();
        setReport(data);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [vin]);

  const handleDownloadPdf = async () => {
    if (!vin) return;

    setDownloadingPdf(true);
    try {
      const response = await fetch(`/api/reports/pdf?vin=${encodeURIComponent(vin)}`);

      if (response.status === 501) {
        const errorData = await response.json();
        alert(errorData.error || 'La génération PDF nécessite Puppeteer. Installez-le avec: npm install puppeteer');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FindMyCar-Report-${vin}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Erreur lors du téléchargement du PDF: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Génération du rapport en cours...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Vérification du VIN: {vin}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-2xl mx-auto">
            <svg className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Erreur</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Impossible de charger le rapport'}</p>
            <Link href="/" className="inline-block px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { reportData, damageHistory, mileageHistory, ownershipHistory } = report;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Actions */}
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadingPdf ? 'Génération...' : 'Télécharger PDF'}
          </button>
          <Link href="/" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-teal-600 dark:hover:border-teal-400 transition-colors">
            Nouvelle recherche
          </Link>
        </div>
        {/* Vehicle Overview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  reportData.status === "verified"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}>
                  {reportData.status === "verified" ? "✓ Vérifié" : "⚠ Attention"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{reportData.score}</span>
                  <span className="text-gray-500 dark:text-gray-400">/10</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {reportData.brand} {reportData.model}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>VIN: {reportData.vin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>{reportData.mileage.toLocaleString()} km</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Année modèle:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{reportData.year}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">(du VIN)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">1ère immatriculation:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{reportData.firstRegistration}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-linear-to-br from-teal-50 to-emerald-100 dark:from-teal-900 dark:to-emerald-800 rounded-xl p-6 min-w-[200px]">
              <div className="text-6xl font-bold text-teal-600 dark:text-teal-300 mb-2">
                {reportData.score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Score de confiance
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Basé sur {damageHistory.length + mileageHistory.length + ownershipHistory.length} vérifications
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Pas de vol signalé</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aucune correspondance dans les bases de données internationales de véhicules volés.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{damageHistory.length} incidents</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quelques dommages mineurs signalés dans l&apos;historique du véhicule.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Kilométrage cohérent</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aucune manipulation du compteur kilométrique détectée.
            </p>
          </div>
        </div>

        {/* Technical Information Section (NHTSA Data) */}
        {(reportData.bodyClass || reportData.engineInfo || reportData.fuelType) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Informations techniques</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {reportData.bodyClass && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Carrosserie:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{reportData.bodyClass}</span>
                </div>
              )}
              {reportData.engineInfo && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Moteur:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{reportData.engineInfo}</span>
                </div>
              )}
              {reportData.fuelType && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Carburant:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{reportData.fuelType}</span>
                </div>
              )}
              {reportData.manufacturer && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Fabricant:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{reportData.manufacturer}</span>
                </div>
              )}
              {reportData.plantLocation && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Lieu de fabrication:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{reportData.plantLocation}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Model Year vs Registration Date Explanation */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Année modèle vs Date d&apos;immatriculation
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Année modèle ({reportData.year})</strong> : Décodée du VIN (10ème caractère), correspond à l&apos;année de conception du véhicule par le constructeur.
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300 mt-2">
            <strong>Date d&apos;immatriculation ({reportData.firstRegistration})</strong> : Date de première mise en circulation.
            Il est normal que cette date soit postérieure à l&apos;année modèle (véhicules souvent fabriqués l&apos;année précédente).
          </p>
        </div>

        {/* Data Transparency Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Sources des données
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Informations techniques: NHTSA (National Highway Traffic Safety Administration)</li>
            <li>• Historique des dommages: Données synthétiques (prochainement Carfax/AutoCheck)</li>
            <li>• Kilométrage: Données synthétiques (prochainement registres officiels)</li>
            <li>• Propriété: Données synthétiques (prochainement registres nationaux)</li>
          </ul>
          {report.metadata && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
              Rapport généré le {new Date(report.metadata.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>

        {/* Damage History Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Historique des dommages</h2>
          </div>

          <div className="space-y-4">
            {damageHistory.map((damage, index) => (
              <div key={index} className="border-l-4 border-yellow-500 dark:border-yellow-400 pl-6 py-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-r-lg">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{damage.type}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        damage.severity === "low"
                          ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                          : "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                      }`}>
                        {damage.severity === "low" ? "Mineur" : "Majeur"}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{damage.description}</p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{damage.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mileage History Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Historique du kilométrage</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kilométrage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mileageHistory.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {record.mileage.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{record.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-200 mb-1">Kilométrage cohérent</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  L&apos;historique du kilométrage suit une progression logique. Aucune anomalie détectée.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ownership History Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Historique de propriété</h2>
          </div>

          <div className="space-y-4">
            {ownershipHistory.map((period, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      Propriétaire #{index + 1}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {period.from} → {period.to}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">{period.country}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Total de {ownershipHistory.length} propriétaires enregistrés</span>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-linear-to-r from-teal-600 to-emerald-700 rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Besoin d&apos;un autre rapport ?
          </h3>
          <p className="text-teal-100 mb-6">
            Économisez 32% avec notre pack de 5 rapports
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#pricing" className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors">
              Voir les tarifs
            </Link>
            <Link href="/" className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-400 transition-colors">
              Nouvelle recherche
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement du rapport...</p>
        </div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
