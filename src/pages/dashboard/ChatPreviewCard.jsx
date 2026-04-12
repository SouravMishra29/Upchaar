import { motion } from "framer-motion";

function ChatPreviewCard({ onClick }) {
  return (
    <motion.div
      layoutId="chat-card"
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Chat Assistant
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          AI-powered symptom analysis
        </p>
      </div>

      {/* CHAT PREVIEW (FIXED HEIGHT CONTROL) */}
      <div className="mt-6 space-y-3 flex-1 overflow-hidden">

        <div className="flex justify-start">
          <div className="bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl max-w-[75%]">
            I have headache since morning
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-primary text-white text-sm px-4 py-2 rounded-xl max-w-[75%]">
            Possible causes: dehydration or stress
          </div>
        </div>

        <div className="flex justify-end">
          <div className="flex gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Secure • Private • AI-powered
        </span>

        <span className="text-sm font-medium text-primary">
          Open →
        </span>
      </div>

    </motion.div>
  );
}

export default ChatPreviewCard;