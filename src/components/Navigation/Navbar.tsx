import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06] relative"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
            <a href="/" className="flex flex-row gap-3 items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7f67f5] to-[#6b54e0] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-violet-200 to-[#9580f7] bg-clip-text text-transparent">
                Kyro
              </span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={() => navigate("/borrow")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors duration-300 font-medium"
            >
              Borrow
            </motion.button>
            <motion.button
              onClick={() => navigate("/lend/deposit")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors duration-300 font-medium"
            >
              Lend
            </motion.button>
            <motion.button
              onClick={() => navigate("/waitlist")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#7f67f5]/30 transition-all duration-300"
            >
              Waitlist
            </motion.button>

            <WalletMultiButton />

            {/* Social Media Icons */}
            <div className="flex gap-3 ml-4 pl-4 border-l border-white/10">
              <motion.a
                href="https://x.com/kyro"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                aria-label="Follow Kyro on Twitter"
                title="Follow us on X (Twitter)"
              >
                <span className="text-xs font-bold">{'\u{1D54F}'}</span>
              </motion.a>
              <motion.a
                href="https://www.instagram.com/kyro/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                aria-label="Follow Kyro on Instagram"
                title="Follow us on Instagram"
              >
                <span className="text-xs font-bold">IG</span>
              </motion.a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            aria-label="Toggle mobile menu"
          >
            <motion.span
              animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 6 : 0 }}
              className="w-6 h-0.5 bg-gray-300 block transition-all"
            />
            <motion.span
              animate={{ opacity: isMenuOpen ? 0 : 1 }}
              className="w-6 h-0.5 bg-gray-300 block transition-all"
            />
            <motion.span
              animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -6 : 0 }}
              className="w-6 h-0.5 bg-gray-300 block transition-all"
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMenuOpen ? "auto" : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden overflow-hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/[0.06]"
      >
        <div className="px-4 py-6 space-y-4">
          <motion.button
            onClick={() => {
              navigate("/borrow");
              setIsMenuOpen(false);
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 font-medium"
          >
            Borrow
          </motion.button>

          <motion.button
            onClick={() => {
              navigate("/lend/deposit");
              setIsMenuOpen(false);
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 font-medium"
          >
            Lend
          </motion.button>

          <motion.button
            onClick={() => {
              navigate("/waitlist");
              setIsMenuOpen(false);
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#7f67f5]/30 transition-all duration-300"
          >
            Waitlist
          </motion.button>

          <div className="flex justify-center pt-4 border-t border-white/10 mb-4">
            <WalletMultiButton />
          </div>

          {/* Mobile Social Media Icons */}
          <div className="flex justify-center gap-4 pt-4 border-t border-white/10">
            <motion.a
              href="https://x.com/kyro"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
              aria-label="Follow Kyro on Twitter"
              title="Follow us on X (Twitter)"
            >
              <span className="text-sm font-bold">{'\u{1D54F}'}</span>
            </motion.a>
            <motion.a
              href="https://www.instagram.com/kyro/"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
              aria-label="Follow Kyro on Instagram"
              title="Follow us on Instagram"
            >
              <span className="text-sm font-bold">IG</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
