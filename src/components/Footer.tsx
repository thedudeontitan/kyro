import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a]/80 border-t border-white/[0.06] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center gap-8"
        >
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7f67f5] to-[#6b54e0] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-violet-200 to-[#9580f7] bg-clip-text text-transparent">
                Kyro
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              The best crypto credit card 2025. Spend crypto without selling with yield-earning USDC collateral.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <a href="/borrow" className="text-gray-400 hover:text-[#9580f7] transition-colors duration-300">
                Get Crypto Credit
              </a>
              <a href="/lend/deposit" className="text-gray-400 hover:text-[#9580f7] transition-colors duration-300">
                Stake USDC & Earn
              </a>
              <a href="/waitlist" className="text-gray-400 hover:text-[#9580f7] transition-colors duration-300">
                Join Waitlist
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <motion.a
                href="https://x.com/kyro"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white/10 hover:bg-white/15 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                aria-label="Follow Kyro on Twitter"
                title="Follow us on X (Twitter)"
              >
                <span className="text-sm font-bold">{'\u{1D54F}'}</span>
              </motion.a>
              <motion.a
                href="https://www.instagram.com/kyro/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white/10 hover:bg-white/15 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                aria-label="Follow Kyro on Instagram"
                title="Follow us on Instagram"
              >
                <span className="text-sm font-bold">IG</span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500"
        >
          <div>
            &copy; 2025 Kyro. All rights reserved. The future of crypto credit cards.
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-[#9580f7] transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-[#9580f7] transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
