export interface Equivalence {
  value: string;
  label: string;
  icon: string;
}

type EquivalenceFn = (amount: number) => Equivalence;

export const EQUIVALENCES: Record<string, { equivalence: EquivalenceFn }> = {
  "water-saved": {
    // 1 Olympic pool = 660,000 gallons (FINA standard)
    equivalence: (gallons: number) => ({
      value: (gallons / 660000).toFixed(1),
      label: "Olympic swimming pools",
      icon: "Waves",
    }),
  },
  "trees-cared": {
    // 1 mature tree absorbs ~48 lbs CO2/year (USDA Forest Service)
    equivalence: (trees: number) => ({
      value: ((trees * 48) / 2000).toFixed(1),
      label: "tons of CO2 absorbed/year",
      icon: "Wind",
    }),
  },
  "litter-collected": {
    // Average person generates 4.4 lbs/day waste (EPA)
    equivalence: (lbs: number) => ({
      value: String(Math.round(lbs / 4.4)),
      label: "person-days of waste diverted",
      icon: "UserCheck",
    }),
  },
  "park-hours": {
    // Volunteer value: $31.80/hr (Independent Sector 2023)
    equivalence: (hours: number) => ({
      value: `$${Math.round(hours * 31.8).toLocaleString()}`,
      label: "in volunteer economic value",
      icon: "HandCoins",
    }),
  },
  "challenges-completed": {
    // Cerritos population: 51,460
    equivalence: (count: number) => ({
      value: ((count / 51460) * 100).toFixed(2) + "%",
      label: "of Cerritos residents engaged",
      icon: "Users",
    }),
  },
};

export function getEquivalence(counterId: string, value: number): Equivalence | null {
  const entry = EQUIVALENCES[counterId];
  if (!entry) return null;
  return entry.equivalence(value);
}
