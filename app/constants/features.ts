import { Feature } from "../types";

export const FEATURES: Feature[] = [
  {
    title: "Historique des dommages",
    description: "Découvrez les accidents, réparations et dommages signalés. Accédez aux photos des dommages antérieurs.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    gradientFrom: "teal-50",
    gradientTo: "emerald-100",
    iconBg: "teal-600",
  },
  {
    title: "Vérification du kilométrage",
    description: "Détectez les manipulations du compteur kilométrique. Vérifiez l'historique complet des relevés.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    gradientFrom: "green-50",
    gradientTo: "green-100",
    iconBg: "green-600",
  },
  {
    title: "Vérification de vol",
    description: "Consultez les bases de données internationales de véhicules volés. Évitez les mauvaises surprises.",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    gradientFrom: "red-50",
    gradientTo: "red-100",
    iconBg: "red-600",
  },
];
