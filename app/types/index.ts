export interface Feature {
  title: string;
  description: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
}

export interface PricingFeature {
  text: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  priceDetail?: string;
  features: PricingFeature[];
  ctaText: string;
  isPopular?: boolean;
  ctaVariant: "primary" | "secondary";
}

export interface TrustBadge {
  icon: string;
  text: string;
}
