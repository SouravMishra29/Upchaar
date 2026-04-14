import { useState, useEffect } from "react";
import { fetchPrediction } from "../../services/api";

const riskColors = {
  Low: "text-green-500 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  Moderate: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400",
  High: "text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
};

function PredictionSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPrediction();
  }, []);

  const loadPrediction = async () => {
    try {
      setLoading(true);
      const res = await fetchPrediction();
      if (res.success) {
        setData(res);
      } else {
        setError("Could not fetch prediction data.");
      }
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Nearby Disease Prediction
        </h2>
        <button
          onClick={loadPrediction}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-gray-400 animate-pulse">Analyzing local health data...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && data && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-primary">{data.totalCases}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cases (last 30 days)</p>
            </div>
            <div className={`rounded-xl p-4 text-center border ${riskColors[data.prediction?.riskLevel] || riskColors["Low"]}`}>
              <p className="text-3xl font-bold">{data.prediction?.riskLevel || "Low"}</p>
              <p className="text-xs mt-1 opacity-80">Community Risk Level</p>
            </div>
          </div>

          {/* Top conditions */}
          {data.prediction?.topConditions && (
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Likely Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {data.prediction.topConditions.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Symptom frequency */}
          {data.symptomFrequency?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Symptom Frequency</h3>
              <div className="space-y-2">
                {data.symptomFrequency.slice(0, 5).map(({ symptom, count }, i) => {
                  const max = data.symptomFrequency[0].count;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-300 w-20 capitalize">{symptom}</span>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(count / max) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Advisory */}
          {data.prediction?.advisory && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">Health Advisory</h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">{data.prediction.advisory}</p>
            </div>
          )}

          {/* Prevention tips */}
          {data.prediction?.preventionTips && (
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Prevention Tips</h3>
              <ul className="space-y-1">
                {data.prediction.preventionTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PredictionSection;
