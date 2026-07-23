export const DEFAULT_CATEGORIES = [
  {
    name: "Horror",
    description: "Terrifying and suspenseful anime stories",
    isDefault: true,
  },
  {
    name: "Comedy",
    description: "Humorous and lighthearted anime stories",
    isDefault: true,
  },
  {
    name: "Sci-Fiction",
    description: "Science fiction and futuristic anime stories",
    isDefault: true,
  },
  {
    name: "Mini-Series",
    description: "Short anime story series",
    isDefault: true,
  },
];

export const PREDEFINED_CATEGORY_NAMES = DEFAULT_CATEGORIES.map(
  (cat) => cat.name
);
