import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { catalogProducts, heroImage, popularServices } from "../data/catalog";

export const HomePage = () => {
  const serviceSliderRef = useRef<HTMLDivElement | null>(null);

  const slideServices = (direction: "left" | "right") => {
    if (!serviceSliderRef.current) {
      return;
    }
    const amount = serviceSliderRef.current.clientWidth * 0.9;
    serviceSliderRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="space-y-12 pb-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden border border-slate-300 bg-[#ececec]"
      >
        <img src={heroImage} alt="vicktykof hero" className="h-[350px] w-full object-cover sm:h-[520px]" loading="eager" />
        <div className="flex justify-center py-4">
          <Button component={Link} to="/booking" variant="contained" sx={{ bgcolor: "#000", borderRadius: 0, px: 5, py: 1.2, "&:hover": { bgcolor: "#111" } }}>
            BOOK APPOINTMENT
          </Button>
        </div>
      </motion.section>

      <ProductGrid title="Shop Loc Products" products={catalogProducts.filter((p) => p.section === "products")} />

      <div className="flex justify-center">
        <Button component={Link} to="/products" variant="contained" sx={{ bgcolor: "#000", borderRadius: 0, px: 5, py: 1.2, "&:hover": { bgcolor: "#111" } }}>
          View all
        </Button>
      </div>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-black md:text-5xl">Popular Services</h2>
          <div className="hidden items-center gap-1 md:flex">
            <IconButton onClick={() => slideServices("left")} sx={{ border: "1px solid #cbd5e1", borderRadius: 0 }}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={() => slideServices("right")} sx={{ border: "1px solid #cbd5e1", borderRadius: 0 }}>
              <ChevronRightIcon />
            </IconButton>
          </div>
        </div>
        <div className="flex items-center justify-end text-xs text-slate-500 md:hidden">
          <span>Glisser pour voir plus</span>
          <ChevronRightIcon sx={{ fontSize: 18 }} />
        </div>

        <div className="relative">
          <div ref={serviceSliderRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {popularServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="min-w-[78%] sm:min-w-[46%] lg:min-w-[31%] xl:min-w-[24%]"
              >
                <img src={service.image} alt={service.name} className="h-72 w-full object-cover" />
                <p className="pt-2 text-center text-sm font-medium">{service.name}</p>
              </motion.div>
            ))}
          </div>
          <div className="pointer-events-none absolute bottom-2 right-0 flex items-center rounded-l-full bg-white/85 px-2 py-1 text-xs text-slate-600 md:hidden">
            <ChevronRightIcon sx={{ fontSize: 16 }} />
          </div>
        </div>
      </section>

      <ProductGrid title="Shop Loc Extensions" products={catalogProducts.filter((p) => p.section === "extensions")} />
      <ProductGrid title="Shop Loc Styling Tools" products={catalogProducts.filter((p) => p.section === "tools")} />
      <ProductGrid title="Shop Kits" products={catalogProducts.filter((p) => p.section === "kits")} />
    </div>
  );
};
