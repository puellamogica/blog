export const categories = {
  tech: {
    name: "Tech",
    gradient: "bg-linear-to-r from-sky-500 to-indigo-500",
  },
  life: {
    name: "Life",
    gradient: "bg-linear-to-r from-rose-400 to-pink-600",
  },
  notes: {
    name: "Notes",
    gradient: "bg-linear-to-r from-amber-400 to-orange-500",
  },
} as const;

export type CategoryKey = keyof typeof categories;

export const categoryKeys = Object.keys(categories) as [
  CategoryKey,
  ...CategoryKey[],
];
