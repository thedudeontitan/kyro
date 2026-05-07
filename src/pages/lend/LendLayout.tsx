import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Navigation/LendSidebar";

export default function LendLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("deposit")) return "deposit";
    if (path.includes("portfolio")) return "portfolio";
    return "deposit";
  };

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "deposit") {
      navigate("/lend/deposit");
    } else if (tabId === "portfolio") {
      navigate("/lend/portfolio");
    }
  };

  return (
    <div className="min-h-screen bg-[black] text-white">
      <button
        onClick={handleMenuToggle}
        className="fixed top-6 left-6 z-50 lg:hidden bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-3 text-gray-400 hover:text-white transition-all duration-300 hover:border-white/20"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex">
        <Sidebar
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
          isOpen={isSidebarOpen}
          onToggle={handleMenuToggle}
        />

        <div className="flex-1 min-h-screen">
          <main className="h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
