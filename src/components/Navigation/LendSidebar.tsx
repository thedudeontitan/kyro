import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, DollarSign, Menu, PieChart, Wallet, X } from "lucide-react";

type SidebarProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
};

export const Sidebar = ({ activeTab, onTabChange, isOpen, onToggle }: SidebarProps) => {
  const menuItems = [
    {
      id: "deposit",
      label: "Deposit",
      icon: DollarSign,
      description: "Lend tokens and earn yield",
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: PieChart,
      description: "View your investments",
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:bg-[#0a0a0a] lg:border-r lg:border-white/10">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-center">
              <a href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#7f67f5] to-[#6b54e0] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  Kyro
                </span>
              </a>
            </div>
          </div>

          <nav className="flex-1 p-6">
            <div className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                      isActive
                        ? "bg-[#7f67f5]/10 border border-[#7f67f5]/30"
                        : "hover:bg-white/5 border border-transparent hover:border-white/10"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabDesktop"
                        className="absolute inset-0 bg-[#7f67f5]/5 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#7f67f5] to-[#6b54e0]"
                            : "bg-white/10 group-hover:bg-white/15"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 text-left">
                        <div
                          className={`font-medium transition-colors duration-300 ${
                            isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                          {item.description}
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive ? "text-[#9580f7]" : "text-gray-500 group-hover:text-gray-400"
                        }`}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full w-80 bg-[#0a0a0a] border-r border-white/10 z-50 lg:hidden"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  Kyro
                </span>
              </div>
              <button onClick={onToggle} className="text-gray-400 hover:text-white transition-colors duration-300">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-6">
            <div className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onTabChange(item.id);
                      onToggle();
                    }}
                    className={`w-full group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                      isActive
                        ? "bg-[#7f67f5]/10 border border-[#7f67f5]/30"
                        : "hover:bg-white/5 border border-transparent hover:border-white/10"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="absolute inset-0 bg-[#7f67f5]/5 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#7f67f5] to-[#6b54e0]"
                            : "bg-white/10 group-hover:bg-white/15"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 text-left">
                        <div
                          className={`font-medium transition-colors duration-300 ${
                            isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                          {item.description}
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive ? "text-[#9580f7]" : "text-gray-500 group-hover:text-gray-400"
                        }`}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </div>
      </motion.div>
    </>
  );
};

type AppBarProps = {
  isWalletConnected: boolean;
  onWalletConnect: () => void;
  onMenuToggle: () => void;
};

export const AppBar = ({ onMenuToggle }: AppBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-30"
    >
      <div className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden text-gray-400 hover:text-white transition-colors duration-300"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Kyro
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
