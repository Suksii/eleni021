// Jedini izvor istine za cache tagove — koriste ih `cacheTag()` u čitanjima i
// `updateTag()` u CMS mutacijama.
export const TAGS = {
  categories: "categories",
  products: "products",
  catering: "catering",
  gallery: "gallery",
  testimonials: "testimonials",
  settings: "settings",
} as const;
