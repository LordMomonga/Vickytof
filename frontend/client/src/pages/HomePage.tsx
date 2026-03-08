import { motion } from "framer-motion";

const products = [
  { name: "Pink Super Hold Gel", price: "From $22.00", rating: "(4.7)" },
  { name: "Funky Loc Spray", price: "From $22.00", rating: "(4.8)" },
  { name: "Super Hold Retwist Gel", price: "From $22.00", rating: "(4.8)" },
  { name: "Rose Water Hydrating Mist", price: "From $22.00", rating: "(4.8)" },
];

const styles = [
  "Book Comb Retwist",
  "Book Comb Retwist + Loc Petals",
  "Book Comb Retwist + Rope Twist",
  "Book Comb Retwist + Pipe Cleaners",
];

export const HomePage = () => {
  return (
    <div className="space-y-14 pb-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-[20px] border border-slate-300 bg-[#eceaec]"
      >
        <div className="h-[420px] w-full bg-[linear-gradient(140deg,#d8d4dc_0%,#f1eff4_45%,#d9d5de_100%)]" />
      </motion.section>

      <section className="space-y-5">
        <h2 className="text-center text-3xl font-bold text-black">Shop Products</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((item, i) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.07 }}
              className="overflow-hidden rounded-[18px] border border-slate-300 bg-[#f4f2f7]"
            >
              <div className="h-64 bg-gradient-to-b from-[#ddd7e6] via-[#f0edf5] to-[#d9d2e3]" />
              <div className="space-y-1 p-4">
                <p className="text-lg font-semibold leading-tight text-black">{item.name}</p>
                <p className="text-base font-medium text-slate-900">{item.price}</p>
                <p className="text-sm font-medium text-violet-700">★★★★★ {item.rating}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-center text-3xl font-bold text-black">Loc Style Gallery</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {styles.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.07 }}
              className="overflow-hidden rounded-[18px] border border-slate-300 bg-[#f2f0f4]"
            >
              <div className="h-72 bg-gradient-to-br from-[#d7d1e2] to-[#f4f2f7]" />
              <p className="p-4 text-center text-sm font-medium text-slate-900">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
