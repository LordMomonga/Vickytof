import { catalogProducts } from "../../data/catalog";
import { ProductGrid } from "../../components/ProductGrid";

export const KitsPage = () => <ProductGrid title="Shop Kits" products={catalogProducts.filter((p) => p.section === "kits")} />;
