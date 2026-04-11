import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatSection from "./ChatSection";
import RecordsSection from "./RecordsSection";
import PredictionSection from "./PredictionSection";
import ChatPreviewCard from "./ChatPreviewCard";
import RecordsPreviewCard from "./RecordsPreviewCard";
import PredictionPreviewCard from "./PredictionPreviewCard";

function Dashboard() {
  const [active, setActive] = useState(null);

  return (
    <div className="h-full bg-gray-50 dark:bg-[#0b1220] px-4 py-4">

      {/* 🔥 MAIN CONTAINER */}
      <div className="relative w-full max-w-[1400px] mx-auto h-[calc(100vh-100px)]">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">

          <ChatPreviewCard onClick={() => setActive("chat")} />

          <div className="flex flex-col gap-4">
            <RecordsPreviewCard onClick={() => setActive("records")} />
            <PredictionPreviewCard onClick={() => setActive("prediction")} />
          </div>

        </div>

        {/* 🔥 EXPANDED VIEW */}
        <AnimatePresence>
          {active && (
            <motion.div
              className="absolute inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                layoutId={`${active}-card`}
                className="h-full w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 flex flex-col"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                          
                  <button
                    onClick={() => setActive(null)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                               bg-gray-100 dark:bg-gray-800
                               text-sm font-medium text-gray-700 dark:text-gray-200
                               hover:bg-gray-200 dark:hover:bg-gray-700
                               transition group"
                  >
                    <span className="transition-transform group-hover:-translate-x-1">
                      ←
                    </span>
                    Back
                  </button>
                          
                  <div /> {/* keeps alignment clean */}
                          
                </div>

                <div className="flex-1 min-h-0">
                  {active === "chat" && <ChatSection />}
                  {active === "records" && <RecordsSection />}
                  {active === "prediction" && <PredictionSection />}
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}

export default Dashboard;