import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import { useAuth } from "./context/AuthContext";

// 🔥 SCROLL HANDLER (added)
function ScrollToSection() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return null;
}

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <ScrollToSection /> {/* 🔥 added */}

      <div className="bg-gray-50 dark:bg-[#0b1220] min-h-screen">

        <Navbar />

        {/* 🔥 THIS IS THE FIX */}
        <main className="pt-[72px] min-h-screen">
          <AppRoutes />
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;