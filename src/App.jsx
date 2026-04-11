import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
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