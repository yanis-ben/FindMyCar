import { PricingPlan } from "../types";

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Rapport unique",
    price: "29€",
    features: [
      { text: "1 rapport complet" },
      { text: "Téléchargement PDF" },
      { text: "Support client" },
    ],
    ctaText: "Choisir",
    ctaVariant: "secondary",
  },
  {
    name: "Pack 5 rapports",
    price: "99€",
    priceDetail: "19,80€/rapport",
    features: [
      { text: "5 rapports complets" },
      { text: "Économisez 32%" },
      { text: "Support prioritaire" },
    ],
    ctaText: "Choisir",
    isPopular: true,
    ctaVariant: "primary",
  },
  {
    name: "Entreprise",
    price: "Sur mesure",
    features: [
      { text: "Rapports illimités" },
      { text: "API dédiée" },
      { text: "Support dédié" },
    ],
    ctaText: "Nous contacter",
    ctaVariant: "secondary",
  },
];
