import { catalogProducts } from "../../data/catalog";
import { ProductGrid } from "../../components/ProductGrid";

export const StylingToolsPage = () => <ProductGrid title="Shop Loc Styling Tools" products={catalogProducts.filter((p) => p.section === "tools")} />;
