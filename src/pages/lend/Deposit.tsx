import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, DollarSign, Info, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlowingButton } from "../../components/GlowingButton";
import { SEO } from "../../components/SEO";
import { validateUsdcAmount } from "../../lib/utils-finance";

type LockupPeriod = {
  months: number;
  multiplier: number;
  label: string;
};

type LockupPeriodSelectorProps = {
  selectedPeriod: LockupPeriod;
  onPeriodChange: (period: LockupPeriod) => void;
};

const LockupPeriodSelector = ({ selectedPeriod, onPeriodChange }: LockupPeriodSelectorProps) => {
  const periods: LockupPeriod[] = [
    { months: 1, multiplier: 1.0, label: "1 month" },
    { months: 3, multiplier: 1.25, label: "3 months" },
    { months: 6, multiplier: 1.5, label: "6 months" },
    { months: 12, multiplier: 2.0, label: "12 months" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-white">Lockup Period</h3>
        <Info className="w-4 h-4 text-gray-400" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {periods.map((period) => (
          <motion.button
            key={period.months}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPeriodChange(period)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedPeriod.months === period.months
                ? "border-[#7f67f5] bg-[#7f67f5]/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="text-center">
              <div className="text-white font-medium mb-1">{period.label}</div>
              <div className="text-gray-400 text-sm font-semibold">{period.multiplier}x multiplier</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default function Deposit() {
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState({
    months: 3,
    multiplier: 1.25,
    label: "3 months",
  });
  const [transactionStatus] = useState<"idle" | "depositing" | "success" | "error">("idle");
  const [errorMessage] = useState("");
  const [usdcBalance] = useState(0);
  const [lendingPoolStats] = useState({
    totalDeposited: 0,
    availableLiquidity: 0,
    utilizationRate: 0,
    currentAPY: 12.5,
  });

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    const amount = parseFloat(depositAmount);

    if (!validateUsdcAmount(amount)) {
      toast.error("Invalid deposit amount. Minimum is 1 USDC, maximum is 1,000,000 USDC");
      return;
    }

    toast.info("Coming soon - deposits are not yet available");
  };

  const calculateEstimatedYield = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return 0;
    const amount = parseFloat(depositAmount);
    const baseApy = lendingPoolStats.currentAPY / 100;
    const boostedApy = baseApy * selectedPeriod.multiplier;
    const monthlyYield = (amount * boostedApy) / 12;
    return monthlyYield * selectedPeriod.months;
  };

  const calculateEffectiveAPY = () => {
    return (lendingPoolStats.currentAPY * selectedPeriod.multiplier).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-[black] text-white">
      <SEO
        title="Stake USDC & Earn Yield | Crypto Collateral Lending | Kyro"
        description="Stake your USDC as collateral for crypto credit lines while earning competitive APY. Provide liquidity for crypto-backed credit cards and earn passive income on your stablecoin holdings."
        keywords="stake USDC for credit, USDC staking APY, crypto collateral lending, yield farming USDC, stablecoin lending pool, crypto credit collateral, USDC yield earning, crypto lending platform, DeFi USDC staking"
        ogTitle="Stake USDC & Earn Yield - Crypto Collateral Lending Platform"
        ogDescription="Earn competitive APY by staking USDC as collateral for crypto credit lines. Support crypto-backed spending while generating passive income on your stablecoin assets."
        twitterTitle="Stake USDC & Earn Yield | Crypto Lending Platform"
        twitterDescription="Stake your USDC and earn yield while powering crypto credit cards. Competitive APY, flexible lockup periods, and support the future of crypto spending."
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            Stake USDC & Earn Yield
          </h1>
          <p className="text-gray-400 text-lg">Stake USDC as collateral for crypto credit lines while earning competitive APY from borrowers</p>
        </motion.div>

        {/* Protocol Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Lending Pool Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-gray-400 text-sm">Total Deposited</div>
              <div className="text-xl font-bold text-white">${lendingPoolStats.totalDeposited.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Available Liquidity</div>
              <div className="text-xl font-bold text-white">
                ${lendingPoolStats.availableLiquidity.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Utilization Rate</div>
              <div className="text-xl font-bold text-green-400">{lendingPoolStats.utilizationRate.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Current APY</div>
              <div className="text-xl font-bold text-[#9580f7]">{lendingPoolStats.currentAPY}%</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-8"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Deposit Amount</h3>
              <div className="text-sm text-gray-400">Available: {usdcBalance.toFixed(2)} USDC</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <input
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  type="number"
                  step="0.000001"
                  min="0"
                  className="bg-transparent text-3xl font-bold text-white placeholder-gray-500 focus:outline-none w-full"
                />
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-400">USDC</span>
                  <button
                    onClick={() => setDepositAmount(usdcBalance.toString())}
                    className="px-3 py-1 bg-white/10 border border-white/10 rounded-lg text-white hover:bg-white/15 transition-colors duration-300 text-sm font-medium"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">Pool capacity</span>
                  <span className="text-white">Unlimited</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Your balance</span>
                  <span className="text-white">{usdcBalance.toFixed(6)} USDC</span>
                </div>
              </div>
            </div>
          </div>

          <LockupPeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Estimated Returns</h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-gray-400 text-sm mb-1">Effective APY</div>
                <div className="text-2xl font-bold text-white">{calculateEffectiveAPY()}%</div>
              </div>

              <div>
                <div className="text-gray-400 text-sm mb-1">Est. yield ({selectedPeriod.label})</div>
                <div className="text-2xl font-bold text-white">
                  {calculateEstimatedYield().toFixed(2)}
                  <span className="text-lg text-gray-400 ml-1">USDC</span>
                </div>
              </div>
            </div>

            {selectedPeriod.multiplier > 1 && (
              <div className="bg-[#7f67f5]/10 border border-[#7f67f5]/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                  <span className="text-white font-medium">Bonus Multiplier Active</span>
                </div>
                <p className="text-sm text-gray-400">
                  Earn {selectedPeriod.multiplier}x rewards by locking for {selectedPeriod.label}
                </p>
              </div>
            )}
          </div>

          <GlowingButton onClick={handleDeposit} className="w-full text-lg py-6">
            {transactionStatus === "depositing" ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Depositing to Pool...
              </>
            ) : transactionStatus === "success" ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Deposit Successful!
              </>
            ) : (
              <>
                Stake USDC for Credit
                <DollarSign className="w-5 h-5" />
              </>
            )}
          </GlowingButton>

          {transactionStatus === "error" && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <div className="text-red-400 font-medium">Deposit Failed</div>
                <div className="text-red-300 text-sm">{errorMessage}</div>
              </div>
            </motion.div>
          )}

          {transactionStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <div className="text-green-400 font-medium">Deposit Successful!</div>
                <div className="text-green-300 text-sm">
                  Your USDC has been deposited to the lending pool and is now earning interest.
                </div>
              </div>
            </motion.div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-400">
                <p className="font-medium text-blue-400 mb-1">How it works:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your USDC is staked as collateral for crypto credit lines</li>
                  <li>• Enable crypto-backed credit without selling your assets</li>
                  <li>• Earn competitive yield while your USDC backs real-world spending</li>
                  <li>• Longer lockup periods earn higher yield multipliers</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
