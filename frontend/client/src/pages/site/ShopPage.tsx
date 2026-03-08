import { catalogProducts } from "../../data/catalog";
import { ProductGrid } from "../../components/ProductGrid";

export const ShopPage = () => <ProductGrid title="Shop Loc Products" products={catalogProducts.filter((p) => p.section === "products")} />;
