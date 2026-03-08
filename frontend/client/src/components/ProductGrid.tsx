import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarIcon from "@mui/icons-material/Star";
import { Badge, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import type { CatalogProduct } from "../data/catalog";
import { useCartStore } from "../store/cart.store";

type ProductGridProps = {
  title: string;
  products: CatalogProduct[];
};

export const ProductGrid = ({ title, products }: ProductGridProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const cartItems = useCartStore((state) => state.items);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const quantityByProductId = useMemo(
    () =>
      cartItems.reduce<Record<string, number>>((acc, item) => {
        acc[item.product.id] = item.quantity;
        return acc;
      }, {}),
    [cartItems],
  );

  const slide = (direction: "left" | "right") => {
    if (!sliderRef.current) {
      return;
    }

    const amount = sliderRef.current.clientWidth * 0.9;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-center text-3xl font-bold text-black md:text-5xl">{title}</h2>
        <div className="hidden items-center gap-1 md:flex">
          <IconButton onClick={() => slide("left")} sx={{ border: "1px solid #cbd5e1", borderRadius: 0 }}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={() => slide("right")} sx={{ border: "1px solid #cbd5e1", borderRadius: 0 }}>
            <ChevronRightIcon />
          </IconButton>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, i) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.05 }}
            className="min-w-[78%] overflow-hidden rounded-[16px] border border-slate-300 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:min-w-[46%] lg:min-w-[31%] xl:min-w-[24%]"
          >
            <div className="relative">
              <img src={product.image} alt={product.name} className="h-64 w-full object-cover" loading="lazy" />
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <button
                  className="rounded-none border border-white/70 bg-black/85 p-2 text-white transition hover:bg-violet-600"
                  aria-label={`Add ${product.name} to wishlist`}
                >
                  <FavoriteBorderIcon fontSize="small" />
                </button>
                <button
                  onClick={() => addItem(product)}
                  className="rounded-none border border-white/70 bg-black p-2 text-white transition hover:bg-violet-600"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <Badge
                    badgeContent={quantityByProductId[product.id] ?? 0}
                    color="secondary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.65rem",
                        height: "17px",
                        minWidth: "17px",
                      },
                    }}
                  >
                    <ShoppingBagOutlinedIcon fontSize="small" />
                  </Badge>
                </button>
              </div>
            </div>

            <div className="space-y-1 p-3">
              <p className="text-sm font-semibold leading-tight text-black">{product.name}</p>
              <p className="text-sm font-medium text-slate-900">From ${product.price.toFixed(2)}</p>
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <StarIcon key={`${product.id}-star-${idx}`} sx={{ fontSize: "0.95rem" }} />
                ))}
                <span className="pl-1 text-xs text-slate-600">({product.rating.toFixed(1)})</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center overflow-hidden rounded-none border border-slate-300">
                  <button
                    onClick={() => decrement(product.id)}
                    className="px-3 py-[7px] text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                    aria-label={`Decrease ${product.name}`}
                  >
                    -
                  </button>
                  <span className="min-w-[28px] border-l border-r border-slate-300 px-2 py-[7px] text-center text-xs font-semibold">
                    {quantityByProductId[product.id] ?? 0}
                  </span>
                  <button
                    onClick={() => (quantityByProductId[product.id] ? increment(product.id) : addItem(product))}
                    className="px-3 py-[7px] text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                    aria-label={`Increase ${product.name}`}
                  >
                    +
                  </button>
                </div>
                <button
                  className="rounded-none border border-slate-300 bg-[#f8f8f8] px-2 py-[6px] text-slate-800 transition hover:border-violet-400 hover:text-violet-600"
                  aria-label="Save to favorites"
                >
                  <FavoriteBorderIcon sx={{ fontSize: "1rem" }} />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
