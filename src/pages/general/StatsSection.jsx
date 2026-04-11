import { motion } from "framer-motion";

function StatsSection() {
  const stats = [
    { value: "10K+", label: "Users" },
    { value: "500+", label: "Doctors" },
    { value: "99%", label: "Accuracy" },
  ];

  return (
    <section className="py-20">

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">

        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-primary">{s.value}</h3>
            <p className="text-gray-600 dark:text-gray-300">{s.label}</p>
          </motion.div>
        ))}

      </div>
    </section>
  );
}

export default StatsSection;