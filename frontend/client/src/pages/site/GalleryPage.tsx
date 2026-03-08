import { motion } from "framer-motion";
import { popularServices } from "../../data/catalog";

export const GalleryPage = () => {
  return (
    <section className="space-y-6">
      <h1 className="text-center text-4xl font-bold">Popular Services</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {popularServices.map((service, i) => (
          <motion.div key={service.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <img src={service.image} alt={service.name} className="h-72 w-full rounded-[10px] border border-slate-300 object-cover" />
            <p className="pt-2 text-center text-xl">{service.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
