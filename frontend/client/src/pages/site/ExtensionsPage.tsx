import { catalogProducts } from "../../data/catalog";
import { ProductGrid } from "../../components/ProductGrid";

export const ExtensionsPage = () => <ProductGrid title="Shop Loc Extensions" products={catalogProducts.filter((p) => p.section === "extensions")} />;
