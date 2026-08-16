export type MenuCategory =
  | "brunch"
  | "starters"
  | "soups-salads"
  | "wraps-tacos"
  | "burgers-sands"
  | "entrees"
  | "sides"
  | "kids"
  | "drinks";

export type MenuItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  category: MenuCategory;
  image: string;
  featured?: boolean;
  dietary?: Array<"vegetarian" | "kid">;
  source: "opentable" | "advocate" | "listing";
};

export const categories: { id: MenuCategory; label: string; blurb: string }[] = [
  {
    id: "brunch",
    label: "Weekend Brunch",
    blurb: "Saturdays and Sundays, 9 AM – 2 PM. The neighborhood's reason to stay close to home.",
  },
  {
    id: "starters",
    label: "Starters",
    blurb: "Shareable plates from the cafe kitchen.",
  },
  {
    id: "soups-salads",
    label: "Soups & Salads",
    blurb: "Homemade bowls and greens — a Neighbor's specialty.",
  },
  {
    id: "wraps-tacos",
    label: "Wraps & Tacos",
    blurb: "Lunch favorites from the main menu.",
  },
  {
    id: "burgers-sands",
    label: "Burgers & Sands",
    blurb: "Served with hand-cut fries. Prices from the OpenTable menu.",
  },
  {
    id: "entrees",
    label: "Entrées",
    blurb: "Dinner plates, including salmon and shrimp & grits.",
  },
  {
    id: "sides",
    label: "Sides",
    blurb: "The extras that make the plate.",
  },
  {
    id: "kids",
    label: "Junior Brunchers",
    blurb: "A $6 menu for the kids, as served at weekend brunch.",
  },
  {
    id: "drinks",
    label: "Bar",
    blurb: "Full bar, wine, and beer. Brunch classics from the Advocate review.",
  },
];

const img = (id: string, extra = "") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80${extra}`;

export const menuItems: MenuItem[] = [
  {
    id: "pulled-pork-benedict",
    slug: "pulled-pork-eggs-benedict",
    name: "Pulled Pork Eggs Benedict",
    description:
      "The brunch signature. A potato pancake instead of an English muffin, pulled pork, poached eggs, and jalapeño-infused hollandaise.",
    priceCents: 1100,
    category: "brunch",
    image: img("photo-1598515214211-89d3c73ae83b"),
    featured: true,
    source: "advocate",
  },
  {
    id: "chicken-fried-ribeye",
    slug: "chicken-fried-ribeye-and-eggs",
    name: "Chicken Fried Rib-Eye & Eggs",
    description:
      "Crispy fried rib-eye with eggs — one of the three plates the staff named first when asked what to order at brunch.",
    priceCents: 1295,
    category: "brunch",
    image: img("photo-1546833999-b9f581a1996d"),
    featured: true,
    source: "advocate",
  },
  {
    id: "nola-french-toast",
    slug: "new-orleans-french-toast",
    name: "New Orleans-Style French Toast",
    description:
      "Dusted in powdered sugar with bourbon syrup. Tastes like it came straight out of the French Quarter.",
    priceCents: 1095,
    category: "brunch",
    image: img("photo-1484723091739-30a097e8f929"),
    featured: true,
    source: "advocate",
  },
  {
    id: "eggs-florentine",
    slug: "eggs-florentine",
    name: "Eggs Florentine",
    description: "Poached eggs, wilted spinach, and hollandaise on toasted muffin.",
    priceCents: 1095,
    category: "brunch",
    image: img("photo-1533089860892-a7c6f0a88666"),
    source: "opentable",
  },
  {
    id: "meat-omelet",
    slug: "meat-omelet",
    name: "Meat Omelet",
    description: "A hearty three-egg omelet with the kitchen's meat mix, served all brunch.",
    priceCents: 1095,
    category: "brunch",
    image: img("photo-1510693206972-df098062cb71"),
    source: "opentable",
  },
  {
    id: "fajita-omelet",
    slug: "fajita-omelet",
    name: "Fajita Omelet",
    description:
      "The patio favorite from OpenTable diners — a fajita omelet made for Saturday morning outside.",
    priceCents: 1095,
    category: "brunch",
    image: img("photo-1544025162-d76694265947"),
    source: "opentable",
  },
  {
    id: "belgian-waffles",
    slug: "belgian-waffles",
    name: "Belgian Waffles",
    description: "Crisp Belgian waffles from the weekend brunch board.",
    priceCents: 1000,
    category: "brunch",
    image: img("photo-1562376552-0d160a2f238d"),
    source: "opentable",
  },
  {
    id: "breakfast-tacos",
    slug: "breakfast-tacos",
    name: "Breakfast Tacos",
    description: "A Dallas brunch staple, served Saturday and Sunday mornings.",
    priceCents: 995,
    category: "brunch",
    image: img("photo-1552332386-f8dd00dc2f85"),
    source: "opentable",
  },
  {
    id: "steel-cut-oatmeal",
    slug: "steel-cut-oatmeal",
    name: "Steel Cut Oatmeal",
    description: "Slow-cooked steel cut oats from the brunch menu.",
    priceCents: 795,
    category: "brunch",
    dietary: ["vegetarian"],
    image: img("photo-1517673132405-a56a62b18caf"),
    source: "opentable",
  },
  {
    id: "house-pancakes",
    slug: "house-pancakes",
    name: "House Pancakes",
    description: "A short stack from the brunch board.",
    priceCents: 995,
    category: "brunch",
    dietary: ["vegetarian"],
    image: img("photo-1567620905732-2d1ec7ab7445"),
    source: "opentable",
  },
  {
    id: "fried-green-tomatoes",
    slug: "fried-green-tomatoes",
    name: "Fried Green Tomatoes",
    description: "A Southern starter from the cafe board, meant for the table.",
    priceCents: 795,
    category: "starters",
    dietary: ["vegetarian"],
    image: img("photo-1540189549336-e6e99c3679fe"),
    source: "listing",
  },
  {
    id: "spinach-artichoke",
    slug: "spinach-artichoke-dip",
    name: "Spinach & Artichoke Dip",
    description: "Warm dip with grilled bread — a casual kitchen starter.",
    priceCents: 895,
    category: "starters",
    dietary: ["vegetarian"],
    image: img("photo-1576506295286-5cda18df43e7"),
    source: "listing",
  },
  {
    id: "soup-du-jour",
    slug: "soup-of-the-day",
    name: "Soup of the Day",
    description: "Homemade soup, the way the cafe listed it — ask the floor for today's pot.",
    priceCents: 595,
    category: "soups-salads",
    image: img("photo-1547592180-85f173990554"),
    source: "listing",
  },
  {
    id: "house-salad",
    slug: "house-salad",
    name: "House Salad",
    description:
      "Neighbor's is known for salads and sandwiches. Mixed greens, garden vegetables, house vinaigrette.",
    priceCents: 795,
    category: "soups-salads",
    dietary: ["vegetarian"],
    image: img("photo-1512621776951-a57141f2eefd"),
    source: "listing",
  },
  {
    id: "caesar-salad",
    slug: "caesar-salad",
    name: "Caesar Salad",
    description: "Romaine, parmesan, croutons, and classic dressing.",
    priceCents: 895,
    category: "soups-salads",
    dietary: ["vegetarian"],
    image: img("photo-1550304943-4f24f54ddde9"),
    source: "listing",
  },
  {
    id: "chicken-wrap",
    slug: "chicken-wrap",
    name: "Chicken Wrap",
    description: "Grilled chicken wrap from the wraps-and-more board.",
    priceCents: 895,
    category: "wraps-tacos",
    image: img("photo-1626700051175-6818013e1d4f"),
    source: "opentable",
  },
  {
    id: "house-tacos",
    slug: "house-tacos",
    name: "House Tacos",
    description: "Tacos from the main menu — lunch and dinner.",
    priceCents: 995,
    category: "wraps-tacos",
    image: img("photo-1565299585323-38d6b0865b47"),
    source: "opentable",
  },
  {
    id: "veggie-burger",
    slug: "veggie-burger",
    name: "Veggie Burger",
    description: "The vegetarian burger from the OpenTable menu.",
    priceCents: 895,
    category: "burgers-sands",
    dietary: ["vegetarian"],
    image: img("photo-1520072959219-c595dc870360"),
    featured: true,
    source: "opentable",
  },
  {
    id: "barnyard-burger",
    slug: "barnyard-burger",
    name: "The Barnyard Burger",
    description: "Neighbor's house burger, listed at $9.55 on the OpenTable menu.",
    priceCents: 955,
    category: "burgers-sands",
    image: img("photo-1568901346375-23c9450c58cd"),
    featured: true,
    source: "opentable",
  },
  {
    id: "ahi-tuna-burger",
    slug: "ahi-tuna-burger",
    name: "Ahi Tuna Burger",
    description: "Seared ahi tuna burger from the burgers-and-sands board.",
    priceCents: 1195,
    category: "burgers-sands",
    image: img("photo-1553979459-d2229ba7433b"),
    featured: true,
    source: "opentable",
  },
  {
    id: "chicken-sandwich",
    slug: "chicken-sandwich",
    name: "Chicken Sandwich",
    description: "Chicken sandwich with hand-cut fries.",
    priceCents: 895,
    category: "burgers-sands",
    image: img("photo-1606755962773-d324e0a13086"),
    source: "opentable",
  },
  {
    id: "tuna-sandwich",
    slug: "tuna-sandwich",
    name: "Tuna Sandwich",
    description: "Tuna sandwich from the OpenTable menu, same price as the chicken.",
    priceCents: 895,
    category: "burgers-sands",
    image: img("photo-1528735602780-2552fd46c7af"),
    source: "opentable",
  },
  {
    id: "shrimp-and-grits",
    slug: "shrimp-and-grits",
    name: "Shrimp & Grits",
    description: "A Neighbor's entrée. Gulf shrimp over stone-ground grits.",
    priceCents: 1395,
    category: "entrees",
    image: img("photo-1559339352-11d035aa65de"),
    featured: true,
    source: "opentable",
  },
  {
    id: "salmon",
    slug: "pan-seared-salmon",
    name: "Pan-Seared Salmon",
    description: "Salmon from the entrée board, served with the day's vegetables.",
    priceCents: 1695,
    category: "entrees",
    image: img("photo-1467003909585-2f8a72700288"),
    featured: true,
    source: "opentable",
  },
  {
    id: "hand-cut-fries",
    slug: "hand-cut-fries",
    name: "Hand-Cut Fries",
    description: "The fries the cafe is known to send with sandwiches.",
    priceCents: 395,
    category: "sides",
    dietary: ["vegetarian"],
    image: img("photo-1573080496219-bb080dd4f877"),
    source: "listing",
  },
  {
    id: "cheese-grits",
    slug: "cheese-grits",
    name: "Cheese Grits",
    description: "A side of stone-ground grits.",
    priceCents: 395,
    category: "sides",
    dietary: ["vegetarian"],
    image: img("photo-1543339494-b4cd4f7ba686"),
    source: "listing",
  },
  {
    id: "junior-brunch",
    slug: "junior-brunch-plate",
    name: "Junior Brunch Plate",
    description: "The $6 junior brunchers menu — pancakes or eggs and toast for the kids.",
    priceCents: 600,
    category: "kids",
    dietary: ["kid"],
    image: img("photo-1506084868230-bb9d95c24759"),
    source: "advocate",
  },
  {
    id: "mimosa",
    slug: "mimosa",
    name: "Mimosa",
    description: "Brunch pour, $2.95 as reviewed in the Lake Highlands Advocate.",
    priceCents: 295,
    category: "drinks",
    image: img("photo-1514362545857-3bc16c4c7d1b"),
    source: "advocate",
  },
  {
    id: "bloody-mary",
    slug: "bloody-mary",
    name: "Bloody Mary",
    description: "House Bloody Mary, $3.95 at weekend brunch.",
    priceCents: 395,
    category: "drinks",
    image: img("photo-1551024709-8f23befc6f87"),
    source: "advocate",
  },
  {
    id: "house-wine",
    slug: "house-wine",
    name: "House Wine",
    description: "Wine by the glass from the full bar.",
    priceCents: 700,
    category: "drinks",
    image: img("photo-1510812431401-41d2bd2722f3"),
    source: "listing",
  },
  {
    id: "draft-beer",
    slug: "draft-beer",
    name: "Draft Beer",
    description: "Beer from the bar — patio optional.",
    priceCents: 550,
    category: "drinks",
    image: img("photo-1535958636474-b021ee887b13"),
    source: "listing",
  },
];

export function getMenuItem(slugOrId: string) {
  return menuItems.find((item) => item.slug === slugOrId || item.id === slugOrId);
}

export function getFeaturedItems() {
  return menuItems.filter((item) => item.featured);
}

export function getItemsByCategory(category: MenuCategory) {
  return menuItems.filter((item) => item.category === category);
}

export function searchMenu(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return getFeaturedItems().slice(0, 6);

  return menuItems
    .filter((item) => {
      const haystack = `${item.name} ${item.description} ${item.category}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    })
    .slice(0, 6);
}
