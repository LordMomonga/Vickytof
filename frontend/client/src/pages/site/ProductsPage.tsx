import { catalogProducts } from "../../data/catalog";
import { ProductGrid } from "../../components/ProductGrid";

export const ProductsPage = () => <ProductGrid title="New Product" products={catalogProducts.filter((p) => p.section === "products")} />;
