import { motion } from "framer-motion";
import { CheckCircle, DollarSign, Info, Loader, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlowingButton } from "../../components/GlowingButton";
import { validateUsdcAmount } from "../../lib/utils-finance";

type CreditLineInfo = {
  creditLimit: number;
  currentDebt: number;
  availableCredit: number;
  isActive: boolean;
  repaymentDueDate: number;
  collateralAmount?: number;
  collateral?: number;
};

export default function StakeCollateral() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [transactionStatus] = useState<"idle" | "approving" | "staking" | "success" | "error">("idle");
  const [usdcBalance] = useState(0);
  const [creditLineInfo] = useState<CreditLineInfo | null>(null);
  const [creditLineExists] = useState(false);

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    const amount = parseFloat(stakeAmount);
    if (!validateUsdcAmount(amount)) {
      toast.error("Invalid amount. Minimum is 1 USDC.");
      return;
    }
    toast.info("Coming soon - staking is not yet available");
  };

  const calculateCreditLimit = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return 0;
    return parseFloat(stakeAmount) * 1.0;
  };

  const isValidAmount = stakeAmount && parseFloat(stakeAmount) > 0 && parseFloat(stakeAmount) <= usdcBalance;
  const isLoading = transactionStatus === "approving" || transactionStatus === "staking";
  const canStake = isValidAmount && !isLoading;

  const hasExistingCredit = creditLineExists || (creditLineInfo && creditLineInfo.isActive);

  return (
    <div className="min-h-screen bg-[black] text-white">
      <div className="relative z-10 max-w-lg mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            {hasExistingCredit ? "Add More Collateral" : "Stake USDC as Collateral"}
          </h1>
          <p className="text-gray-400 text-lg">
            {hasExistingCredit
              ? "Increase your credit limit by adding more USDC collateral"
              : "Stake USDC to open your credit line and start borrowing"}
          </p>
        </motion.div>

        {/* Current Credit Line Info */}
        {hasExistingCredit && creditLineInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#9580f7]" />
              Current Credit Line
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-sm">Credit Limit</div>
                <div className="text-xl font-bold text-white">${creditLineInfo.creditLimit.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Available Credit</div>
                <div className="text-xl font-bold text-green-400">${creditLineInfo.availableCredit.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Current Debt</div>
                <div className="text-xl font-bold text-red-400">${creditLineInfo.currentDebt.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Status</div>
                <div className="text-xl font-bold text-green-400">
                  {creditLineInfo.isActive ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#111] border border-white/10 rounded-2xl p-8"
        >
          <div className="mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 focus-within:border-[#7f67f5]/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <input
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.00"
                  type="number"
                  step="0.000001"
                  min="0"
                  className="bg-transparent text-4xl font-bold text-white placeholder-gray-500 focus:outline-none w-full"
                />
                <div className="flex items-center gap-3">
                  <span className="text-xl text-gray-400">USDC</span>
                  <button
                    onClick={() => setStakeAmount(usdcBalance.toString())}
                    className="px-3 py-1 bg-white/10 border border-white/10 rounded-lg text-white hover:bg-white/15 transition-colors duration-300 text-sm font-medium"
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 px-2">
              <span className="text-gray-400 text-sm">Balance: {usdcBalance.toFixed(2)} USDC</span>
            </div>
          </div>

          {/* Credit Limit Preview */}
          {stakeAmount && parseFloat(stakeAmount) > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8"
            >
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">
                  {hasExistingCredit ? "Additional Credit Limit" : "Credit Limit"}
                </div>
                <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#9580f7] to-[#7f67f5] bg-clip-text">
                  ${calculateCreditLimit().toFixed(2)}
                </div>
                {hasExistingCredit && creditLineInfo && (
                  <div className="mt-2 text-gray-400 text-sm">
                    New Total: ${(creditLineInfo.creditLimit + calculateCreditLimit()).toFixed(2)}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <div className="text-center text-gray-400 text-sm mb-8 leading-relaxed">
            {hasExistingCredit
              ? "Adding more USDC will increase your credit limit at a 1:1 ratio."
              : "Your staked USDC secures your credit line at a 1:1 ratio (100% collateral backing)."}
          </div>

          <GlowingButton onClick={handleStake} className="w-full text-xl py-6" disabled={!canStake}>
            {transactionStatus === "staking" ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                {hasExistingCredit ? "Adding Collateral..." : "Opening Credit Line..."}
              </>
            ) : transactionStatus === "success" ? (
              <>
                <CheckCircle className="w-6 h-6" />
                {hasExistingCredit ? "Collateral Added!" : "Credit Line Opened!"}
              </>
            ) : hasExistingCredit ? (
              <>
                <Plus className="w-6 h-6" />
                Add Collateral
              </>
            ) : (
              <>
                <DollarSign className="w-6 h-6" />
                Open Credit Line
              </>
            )}
          </GlowingButton>

          {/* Contract Info */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-400">
                <p className="font-medium text-blue-400 mb-1">How it works:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your USDC is locked as collateral</li>
                  <li>• Credit limit equals collateral amount (1:1 ratio)</li>
                  <li>• You can borrow up to your credit limit</li>
                  <li>• Add more collateral anytime to increase your limit</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
