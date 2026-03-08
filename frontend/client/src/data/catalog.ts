export type CatalogProduct = {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  section: "products" | "extensions" | "tools" | "kits";
};

export const heroImage = "https://i.pinimg.com/1200x/46/8c/e4/468ce43bcd9438b44189c7ab079aec61.jpg";

export const catalogProducts: CatalogProduct[] = [
  {
    id: "prod-gel",
    name: "Pink Super Hold Gel",
    price: 22,
    rating: 4.7,
    image: "https://i.pinimg.com/736x/c0/a9/01/c0a901126637db7df87c593e4ff1ffc2.jpg",
    section: "products",
  },
  {
    id: "prod-spray",
    name: "Funky Loc Spray",
    price: 22,
    rating: 4.8,
    image: "https://i.pinimg.com/1200x/e1/1b/9a/e11b9a6b5cc5c8933ca04f2ffe2d8ea4.jpg",
    section: "products",
  },
  {
    id: "prod-retwist",
    name: "Super Hold Retwist Gel",
    price: 22,
    rating: 4.8,
    image: "https://i.pinimg.com/1200x/bd/41/ac/bd41acc7ebe600068dc43309307a8e9b.jpg",
    section: "products",
  },
  {
    id: "prod-mist",
    name: "Rose Water Hydrating Mist",
    price: 22,
    rating: 4.8,
    image: "https://i.pinimg.com/736x/c4/c2/96/c4c2961fe08bf6840bbd31a9f48ae141.jpg",
    section: "products",
  },
  {
    id: "ext-black",
    name: "Human Hair Loc Extensions - Black",
    price: 71,
    rating: 4.7,
    image: "https://i.pinimg.com/736x/77/2d/7e/772d7e95948eee8401c6a80087ef1907.jpg",
    section: "extensions",
  },
  {
    id: "ext-brown",
    name: "Human Hair Loc Extensions - Dark Brown",
    price: 71,
    rating: 4.9,
    image: "https://i.pinimg.com/736x/d1/b9/0a/d1b90a28bb2fdc917f513e2dc224242d.jpg",
    section: "extensions",
  },
  {
    id: "ext-ombre",
    name: "Human Hair Loc Extensions - Ombre",
    price: 76,
    rating: 4.8,
    image: "https://i.pinimg.com/736x/13/4b/0a/134b0aecb10d8dfe62b6419fd57c3754.jpg",
    section: "extensions",
  },
  {
    id: "ext-soft",
    name: "Human Hair Loc Extensions - Soft Brown",
    price: 74,
    rating: 4.7,
    image: "https://i.pinimg.com/736x/ad/6a/85/ad6a8561f09b8bd56b9abbcad8100efc.jpg",
    section: "extensions",
  },
  {
    id: "tool-needle",
    name: "Crochet Needle",
    price: 22,
    rating: 4.8,
    image: "https://i.pinimg.com/736x/c6/3c/45/c63c45c67a9d8d1b898ab1259a540b01.jpg",
    section: "tools",
  },
  {
    id: "tool-cleaner",
    name: "Pipe Cleaners for Loc Curls",
    price: 19,
    rating: 4.8,
    image: "https://i.pinimg.com/1200x/40/1e/15/401e1599beed8bf296fe536ce7ae95f1.jpg",
    section: "tools",
  },
  {
    id: "tool-clip-set",
    name: "Section Clips Set",
    price: 16,
    rating: 4.6,
    image: "https://i.pinimg.com/736x/13/4b/0a/134b0aecb10d8dfe62b6419fd57c3754.jpg",
    section: "tools",
  },
  {
    id: "tool-comb-pro",
    name: "Precision Parting Comb",
    price: 18,
    rating: 4.7,
    image: "https://i.pinimg.com/736x/ad/6a/85/ad6a8561f09b8bd56b9abbcad8100efc.jpg",
    section: "tools",
  },
  {
    id: "kit-detox",
    name: "Loc Detox Kit",
    price: 29,
    rating: 4.9,
    image: "https://i.pinimg.com/1200x/e1/1b/9a/e11b9a6b5cc5c8933ca04f2ffe2d8ea4.jpg",
    section: "kits",
  },
  {
    id: "kit-maintenance",
    name: "Maintenance Starter Kit",
    price: 64,
    rating: 4.6,
    image: "https://i.pinimg.com/736x/c0/a9/01/c0a901126637db7df87c593e4ff1ffc2.jpg",
    section: "kits",
  },
  {
    id: "kit-travel",
    name: "Travel Mini Care Kit",
    price: 34,
    rating: 4.5,
    image: "https://i.pinimg.com/736x/13/4b/0a/134b0aecb10d8dfe62b6419fd57c3754.jpg",
    section: "kits",
  },
  {
    id: "kit-premium",
    name: "Premium Wash + Style Kit",
    price: 79,
    rating: 4.8,
    image: "https://i.pinimg.com/736x/ad/6a/85/ad6a8561f09b8bd56b9abbcad8100efc.jpg",
    section: "kits",
  },
];

export const popularServices = [
  { id: "srv-1", name: "Book Comb Retwist", image: "https://i.pinimg.com/1200x/46/8c/e4/468ce43bcd9438b44189c7ab079aec61.jpg" },
  { id: "srv-2", name: "Book Comb Retwist + Loc Petals", image: "https://i.pinimg.com/736x/d1/b9/0a/d1b90a28bb2fdc917f513e2dc224242d.jpg" },
  { id: "srv-3", name: "Book Comb Retwist + Rope Twist", image: "https://i.pinimg.com/736x/c4/c2/96/c4c2961fe08bf6840bbd31a9f48ae141.jpg" },
  { id: "srv-4", name: "Book Comb Retwist + Pipe Cleaners", image: "https://i.pinimg.com/736x/77/2d/7e/772d7e95948eee8401c6a80087ef1907.jpg" },
];
