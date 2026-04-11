import { motion } from "framer-motion";

function PredictionPreviewCard({ onClick }) {
  return (
    <motion.div
      layoutId="prediction-card"
      onClick={onClick}
      className="flex-1 cursor-pointer rounded-2xl 
bg-white dark:bg-gray-900
border border-gray-300 dark:border-gray-700
shadow-[0_1px_2px_rgba(0,0,0,0.06)]
p-6 flex flex-col justify-between overflow-hidden
ring-1 ring-black/5 dark:ring-white/10"
    >

      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Nearby Prediction
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Health trends in your area
        </p>
      </div>

      {/* CONTENT */}
      <div className="mt-4 space-y-3 flex-1 overflow-hidden">

        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm flex justify-between">
          <span>Flu Cases</span>
          <span className="text-red-500 font-medium">↑ High</span>
        </div>

        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm flex justify-between">
          <span>Dengue Risk</span>
          <span className="text-yellow-500 font-medium">Medium</span>
        </div>

        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm flex justify-between">
          <span>Air Quality</span>
          <span className="text-green-500 font-medium">Good</span>
        </div>

      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-400">
          Real-time insights
        </span>

        <span className="text-sm font-medium text-primary">
          Explore →
        </span>
      </div>

    </motion.div>
  );
}

export default PredictionPreviewCard;