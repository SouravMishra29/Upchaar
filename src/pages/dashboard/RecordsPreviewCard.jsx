import { motion } from "framer-motion";

function RecordsPreviewCard({ onClick }) {
  return (
    <motion.div
      layoutId="records-card"
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
          Previous Records
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Access your medical history
        </p>
      </div>

      {/* RECORD PREVIEW */}
      <div className="mt-4 space-y-3 flex-1 overflow-hidden">

        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
          Fever • 12 Aug 2025
        </div>

        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
          Cold & Cough • 03 Aug 2025
        </div>

        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
          Body Pain • 28 July 2025
        </div>

      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-400">
          Secure storage
        </span>

        <span className="text-sm font-medium text-primary">
          View →
        </span>
      </div>

    </motion.div>
  );
}

export default RecordsPreviewCard;