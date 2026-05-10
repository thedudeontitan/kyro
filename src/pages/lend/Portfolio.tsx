import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Loader,
  PieChart,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlowingButton } from "../../components/GlowingButton";
import { useLenderInfo } from "../../solana/useLenderInfo";
import { useLendingPool } from "../../solana/useLendingPool";
import { useTransactions } from "../../solana/useTransactions";
import { useUsdcBalance } from "../../solana/useUsdcBalance";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend?: number;
  className?: string;
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, className = "" }: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-[#111] border border-white/10 rounded-2xl p-6 group hover:border-white/20 transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm ${trend > 0 ? "text-green-400" : trend < 0 ? "text-red-400" : "text-gray-400"}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>
              {trend > 0 ? "+" : ""}
              {trend.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </motion.div>
  );
};

const PortfolioOverview = ({ lenderData, poolStats }: { lenderData: any; poolStats: any }) => {
  const totalValue = lenderData ? lenderData.depositedAmount + lenderData.earnedInterest : 0;
  const totalEarned = lenderData ? lenderData.earnedInterest : 0;
  const currentAPY = poolStats ? poolStats.currentAPY : 12.5;
  const activePositions = lenderData && lenderData.depositedAmount > 0 ? 1 : 0;

  const valueTrend = totalEarned > 0 ? 8.2 : 0;
  const apyTrend = 2.1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Portfolio Value"
        value={`$${totalValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={DollarSign}
        trend={valueTrend}
      />
      <StatCard
        title="Total Earned"
        value={`$${totalEarned.toFixed(2)}`}
        subtitle="All time interest"
        icon={TrendingUp}
        trend={totalEarned > 0 ? valueTrend : 0}
      />
      <StatCard title="Current APY" value={`${currentAPY}%`} icon={Target} trend={apyTrend} />
      <StatCard title="Active Positions" value={activePositions.toString()} icon={PieChart} />
    </div>
  );
};

type LenderPosition = {
  depositedAmount: number;
  earnedInterest: number;
  depositTimestamp: number;
  lastUpdateTimestamp: number;
  apy: number;
};

const ActivePositions = ({
  lenderData,
  onWithdraw,
  isWithdrawing,
}: {
  lenderData: LenderPosition | null;
  onWithdraw: (amount: number) => void;
  isWithdrawing: boolean;
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");

  if (!lenderData || lenderData.depositedAmount === 0) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Active Positions</h2>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Active Positions</h3>
          <p className="text-gray-400 mb-6">Start lending to see your positions here</p>
          <GlowingButton onClick={() => (window.location.href = "/lend/deposit")} className="text-sm">
            Start Lending
            <ArrowRight className="w-4 h-4" />
          </GlowingButton>
        </div>
      </div>
    );
  }

  const totalValue = lenderData.depositedAmount + lenderData.earnedInterest;
  const depositDate = new Date(lenderData.depositTimestamp * 1000);
  const daysSinceDeposit = Math.floor((Date.now() - lenderData.depositTimestamp * 1000) / (1000 * 60 * 60 * 24));

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount > totalValue) {
      toast.error("Withdrawal amount exceeds available balance");
      return;
    }

    onWithdraw(amount);
    setWithdrawAmount("");
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Active Positions</h2>
        <div className="text-sm text-green-400">1 Active Position</div>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">USDC</span>
            </div>
            <div>
              <div className="text-white font-semibold">
                $
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-gray-400 text-sm">USDC Lending Position</div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="text-white font-semibold">{lenderData.apy}% APY</div>
            <div className="text-gray-400 text-sm">Variable Rate</div>
          </div>

          <div className="text-center md:text-left">
            <div className="text-white font-semibold">${lenderData.earnedInterest.toFixed(2)}</div>
            <div className="text-gray-400 text-sm">Interest Earned</div>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">{daysSinceDeposit} days active</span>
          </div>
        </div>

        {/* Position Details */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-1">Principal Deposited</div>
              <div className="text-white font-semibold">${lenderData.depositedAmount.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Deposit Date</div>
              <div className="text-white font-semibold">{depositDate.toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Last Updated</div>
              <div className="text-white font-semibold">
                {new Date(lenderData.lastUpdateTimestamp * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Withdrawal Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Withdraw Funds</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter withdrawal amount"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#7f67f5]/50 focus:outline-none transition-all duration-300"
            />
            <div className="text-xs text-gray-400 mt-1">Available: ${totalValue.toFixed(2)} USDC</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setWithdrawAmount(totalValue.toString())}
              className="px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:border-white/20 hover:text-white transition-all duration-300 text-sm"
            >
              MAX
            </button>
            <GlowingButton onClick={handleWithdraw} disabled={isWithdrawing || !withdrawAmount} className="px-6">
              {isWithdrawing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Withdrawing...
                </>
              ) : (
                "Withdraw"
              )}
            </GlowingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const PoolStats = ({ poolStats }: { poolStats: any }) => {
  if (!poolStats) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center py-8">
          <Loader className="w-8 h-8 text-[#9580f7] animate-spin" />
        </div>
      </div>
    );
  }

  const utilizationRate = poolStats.utilizationRate || 0;
  const riskLevel = utilizationRate > 90 ? "High" : utilizationRate > 70 ? "Medium" : "Low";
  const riskColor = utilizationRate > 90 ? "text-red-400" : utilizationRate > 70 ? "text-yellow-400" : "text-green-400";

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">Pool Health & Statistics</h2>
        <div className={`flex items-center gap-1 ${riskColor}`}>
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{riskLevel} Risk</span>
        </div>
      </div>

      {/* Utilization Rate */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 font-medium">Pool Utilization</span>
          <span className="text-2xl font-bold text-white">{utilizationRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(utilizationRate, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Total Borrowed: ${poolStats.totalBorrowed.toLocaleString()}</span>
          <span>Total Deposited: ${poolStats.totalDeposited.toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Available Liquidity"
          value={`$${poolStats.availableLiquidity.toLocaleString()}`}
          icon={Users}
        />
        <StatCard title="Total Protocol Fees" value={`$${poolStats.protocolFees.toFixed(2)}`} icon={Shield} />
        <StatCard title="Risk Level" value={riskLevel} subtitle="Based on utilization" icon={Activity} />
      </div>
    </div>
  );
};

export default function Portfolio() {
  const { lenderData, refresh: refreshLender } = useLenderInfo();
  const { poolStats } = useLendingPool();
  const { withdraw } = useTransactions();
  const { refresh: refreshBalance } = useUsdcBalance();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async (amount: number) => {
    setIsWithdrawing(true);
    try {
      await withdraw(amount);
      toast.success("Withdrawal successful!");
      refreshLender();
      refreshBalance();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Withdrawal failed";
      toast.error(msg);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[black] text-white">

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            Your Portfolio
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Complete overview of your lending positions and earnings
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <PortfolioOverview lenderData={lenderData} poolStats={poolStats} />
          <ActivePositions lenderData={lenderData} onWithdraw={handleWithdraw} isWithdrawing={isWithdrawing} />
          <PoolStats poolStats={poolStats} />
        </motion.div>
      </div>
    </div>
  );
}
