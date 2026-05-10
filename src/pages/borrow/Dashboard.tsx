import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  CreditCard,
  DollarSign,
  Info,
  Loader,
  Minus,
  Plus,
  Shield,
  Target,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GlowingButton } from "../../components/GlowingButton";
import { SEO } from "../../components/SEO";
import { useCreditLine } from "../../solana/useCreditLine";
import { useReputation } from "../../solana/useReputation";
import { useUsdcBalance } from "../../solana/useUsdcBalance";
import { useTransactions } from "../../solana/useTransactions";

type CreditSummaryCardProps = {
  creditLimit: number;
  usedCredit: number;
  availableCredit: number;
};

const CreditSummaryCard = ({ creditLimit, usedCredit, availableCredit }: CreditSummaryCardProps) => {
  const usagePercentage = creditLimit > 0 ? (usedCredit / creditLimit) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <CreditCard className="w-6 h-6 text-[#9580f7]" />
        <h2 className="text-xl font-semibold text-white">Crypto Credit Overview</h2>
      </div>

      <div className="mb-6">
        <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-[#9580f7] to-[#7f67f5] bg-clip-text mb-2">
          ${creditLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-gray-400">Total Credit Limit</div>
      </div>

      <div className="mb-6">
        <div className="text-2xl font-bold text-white mb-2">
          ${availableCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-gray-400 text-sm">Available Credit</div>
      </div>

      {/* Credit Usage Bar */}
      <div className="w-full bg-white/10 rounded-full h-3 mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] h-3 rounded-full"
        />
      </div>
      <div className="flex justify-between text-sm text-gray-400">
        <span>Used: ${usedCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span>{usagePercentage.toFixed(1)}% utilized</span>
      </div>
    </motion.div>
  );
};

type CollateralCardProps = {
  stakedAmount: number;
  currentDebt: number;
  onStakeMore: () => void;
  onWithdraw: (amount: number) => void;
  isWithdrawing: boolean;
};

const CollateralCard = ({ stakedAmount, currentDebt, onStakeMore, onWithdraw, isWithdrawing }: CollateralCardProps) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const canWithdraw = currentDebt === 0 && stakedAmount > 0;
  const availableToWithdraw = currentDebt === 0 ? stakedAmount : 0;

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }
    onWithdraw(amount);
    setWithdrawAmount("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col justify-between bg-[#111] border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#9580f7]" />
          <h3 className="text-lg font-semibold text-white">Collateral</h3>
        </div>
        <div className="group relative">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute right-0 top-6 w-64 bg-[#111] border border-white/10 rounded-lg p-3 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            Your staked USDC acts as collateral and determines your credit limit
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-white mb-1">
          ${stakedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-gray-400 text-sm">USDC Staked</div>
      </div>

      <div className="text-center mb-4">
        <div className="text-sm text-gray-400">Available to withdraw</div>
        <div className="text-lg font-semibold text-white">
          ${availableToWithdraw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {canWithdraw ? (
        <div className="space-y-3 mb-3">
          <div className="relative">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pr-16 text-white placeholder-gray-500 focus:border-[#7f67f5]/50 focus:outline-none"
            />
            <button
              onClick={() => setWithdrawAmount(stakedAmount.toString())}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#7f67f5] text-white text-xs font-medium rounded-lg hover:bg-[#6b54e0] transition-colors"
            >
              MAX
            </button>
          </div>
          <GlowingButton onClick={handleWithdraw} className="w-full" disabled={isWithdrawing}>
            {isWithdrawing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Withdrawing...
              </>
            ) : (
              <>
                <Minus className="w-4 h-4" />
                Withdraw
              </>
            )}
          </GlowingButton>
        </div>
      ) : currentDebt > 0 ? (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center mb-3">
          <div className="text-yellow-400 text-sm">Repay all debt to withdraw collateral</div>
        </div>
      ) : null}

      <GlowingButton onClick={onStakeMore} className="w-full">
        <Plus className="w-4 h-4" />
        Stake More
      </GlowingButton>
    </motion.div>
  );
};

type OutstandingLoanCardProps = {
  principal: number;
  interest: number;
  isOverdue: boolean;
  daysUntilDue: number;
  usdcBalance: number;
  onRepay: (principalAmount: number, interestAmount: number) => void;
  isRepayLoading: boolean;
};

const OutstandingLoanCard = ({
  principal,
  interest,
  isOverdue,
  daysUntilDue,
  usdcBalance,
  onRepay,
  isRepayLoading,
}: OutstandingLoanCardProps) => {
  const totalDebt = principal + interest;
  const [repayMode, setRepayMode] = useState<"full" | "custom">("full");
  const [customAmount, setCustomAmount] = useState("");

  const handleRepay = () => {
    if (repayMode === "full") {
      onRepay(principal, interest);
    } else {
      const amount = parseFloat(customAmount);
      if (!amount || amount <= 0) {
        toast.error("Please enter a valid repayment amount");
        return;
      }
      if (amount > totalDebt) {
        toast.error("Amount exceeds total debt");
        return;
      }
      if (amount > usdcBalance) {
        toast.error("Insufficient USDC balance");
        return;
      }
      const interestPayment = Math.min(amount, interest);
      const principalPayment = amount - interestPayment;
      onRepay(principalPayment, interestPayment);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`flex flex-col justify-between bg-[#111] border rounded-2xl p-6 ${
        isOverdue ? "border-red-500/50" : "border-white/10"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#9580f7]" />
          <h3 className="text-lg font-semibold text-white">Outstanding Loan</h3>
        </div>
        {totalDebt > 0 && (isOverdue || daysUntilDue <= 3) && (
          <div className="flex items-center gap-1 text-[#9580f7]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{isOverdue ? "Overdue" : `${daysUntilDue} days left`}</span>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Principal</span>
          <span className="text-white font-medium">${principal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Interest</span>
          <span className="text-white font-medium">${interest.toFixed(2)}</span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between">
            <span className="text-white font-semibold">Total Debt</span>
            <span className="text-xl font-bold text-white">${totalDebt.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {totalDebt > 0 ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setRepayMode("full")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                repayMode === "full"
                  ? "bg-[#7f67f5] text-white"
                  : "bg-white/10 text-gray-400 hover:bg-white/15"
              }`}
            >
              Full Repayment
            </button>
            <button
              onClick={() => setRepayMode("custom")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                repayMode === "custom"
                  ? "bg-[#7f67f5] text-white"
                  : "bg-white/10 text-gray-400 hover:bg-white/15"
              }`}
            >
              Custom Amount
            </button>
          </div>

          {repayMode === "custom" && (
            <div>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#7f67f5]/50 focus:outline-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                Balance: ${usdcBalance.toFixed(2)} USDC
              </div>
            </div>
          )}

          <GlowingButton onClick={handleRepay} className="w-full" disabled={isRepayLoading}>
            {isRepayLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Processing Repayment...
              </>
            ) : (
              <>
                {repayMode === "full" ? `Repay $${totalDebt.toFixed(2)}` : "Make Repayment"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </GlowingButton>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <div className="text-green-400 font-medium mb-1">All Paid Up!</div>
          <div className="text-green-500 text-sm">No outstanding debt</div>
        </div>
      )}
    </motion.div>
  );
};

type ReputationCardProps = {
  creditScore: number;
  potentialIncrease: number;
  tier: string;
};

const ReputationCard = ({ creditScore, potentialIncrease, tier }: ReputationCardProps) => {
  const scorePercentage = (creditScore / 1000) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-col justify-between bg-[#111] border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-[#9580f7]" />
        <h3 className="text-lg font-semibold text-white">Credit Score</h3>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#9580f7] to-[#7f67f5] bg-clip-text mb-2">
          {creditScore}
        </div>
        <div className="text-gray-400 text-sm">{tier} Tier</div>
      </div>

      {/* Score Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${scorePercentage}%` }}
          transition={{ duration: 1, delay: 0.8 }}
          className="bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] h-2 rounded-full"
        />
      </div>

      {potentialIncrease > 0 && (
        <div className="text-center mb-4">
          <div className="text-sm text-gray-400 mb-1">Potential Credit Increase</div>
          <div className="text-lg font-semibold text-white">
            +${potentialIncrease.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default function BorrowerDashboard() {
  const navigate = useNavigate();

  const { creditData, creditLineExists, refresh: refreshCreditLine } = useCreditLine();
  const { reputationData, refresh: refreshReputation } = useReputation();
  const { balance: usdcBalance, refresh: refreshBalance } = useUsdcBalance();
  const { repay, withdrawCollateral } = useTransactions();

  const [isRepaying, setIsRepaying] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const potentialIncrease = reputationData && reputationData.score >= 750 && creditData
    ? creditData.creditLimit * 0.2
    : 0;

  const handleStakeMore = () => {
    navigate("/borrow/stake");
  };

  const handleRepay = async (principalAmount: number, interestAmount: number) => {
    setIsRepaying(true);
    try {
      await repay(principalAmount, interestAmount);
      toast.success("Repayment successful!");
      refreshCreditLine();
      refreshReputation();
      refreshBalance();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Repayment failed";
      toast.error(msg);
    } finally {
      setIsRepaying(false);
    }
  };

  const handleWithdrawCollateral = async (amount: number) => {
    setIsWithdrawing(true);
    try {
      await withdrawCollateral(amount);
      toast.success("Collateral withdrawn successfully!");
      refreshCreditLine();
      refreshBalance();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Withdrawal failed";
      toast.error(msg);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getTierName = (tier: number): string => {
    switch (tier) {
      case 0: return "Bronze";
      case 1: return "Silver";
      case 2: return "Gold";
      case 3: return "Platinum";
      default: return "Bronze";
    }
  };

  const getDaysUntilDue = (): number => {
    if (!creditData?.repaymentDueDate || creditData.repaymentDueDate === 0) return 0;
    const now = Math.floor(Date.now() / 1000);
    const diff = creditData.repaymentDueDate - now;
    return Math.ceil(diff / (60 * 60 * 24));
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = creditData?.borrowed ? daysUntilDue < 0 : false;

  return (
    <div className="min-h-screen bg-[black] text-white pt-20">
      <SEO
        title="Crypto Credit Dashboard | Manage Your USDC Credit Line | Kyro"
        description="Manage your crypto-backed credit line dashboard. View USDC collateral, outstanding loans, credit utilization, and make repayments. Monitor your crypto credit score and available spending power."
        keywords="crypto credit dashboard, USDC credit line, crypto collateral management, crypto credit score, crypto backed loan dashboard, stablecoin credit management, crypto credit utilization, yield earning collateral"
        ogTitle="Crypto Credit Dashboard - Manage Your Digital Asset Credit"
        ogDescription="Complete dashboard for managing your crypto-backed credit. Track USDC collateral, monitor credit utilization, view outstanding loans, and optimize your crypto credit score."
        twitterTitle="Crypto Credit Dashboard | USDC Collateral Management"
        twitterDescription="Manage your crypto credit line with real-time dashboard. Track USDC collateral, credit utilization, and earn yield while maintaining spending power."
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            Your Crypto Credit Dashboard
          </h1>
        </motion.div>

        {/* Show different content based on whether user has an active credit line */}
        {!creditData || (!creditData.isActive && !creditLineExists) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center"
          >
            <CreditCard className="w-16 h-16 text-[#9580f7] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No Active Crypto Credit Line</h2>
            <p className="text-gray-400 mb-6">
              Stake your USDC as collateral to unlock crypto-backed credit and start spending crypto without selling your assets
            </p>
            <GlowingButton onClick={handleStakeMore} className="text-lg px-8 py-4">
              Stake USDC & Get Crypto Credit
              <ArrowRight className="w-5 h-5" />
            </GlowingButton>
          </motion.div>
        ) : (
          <>
            {/* Credit Summary - Full Width */}
            <div className="mb-8">
              <CreditSummaryCard
                creditLimit={creditData.creditLimit}
                usedCredit={creditData.currentDebt}
                availableCredit={creditData.availableCredit}
              />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <CollateralCard
                stakedAmount={creditData.collateral}
                currentDebt={creditData.currentDebt}
                onStakeMore={handleStakeMore}
                onWithdraw={handleWithdrawCollateral}
                isWithdrawing={isWithdrawing}
              />

              <OutstandingLoanCard
                principal={creditData.borrowed}
                interest={creditData.interestAccrued}
                isOverdue={isOverdue}
                daysUntilDue={Math.abs(daysUntilDue)}
                usdcBalance={usdcBalance}
                onRepay={handleRepay}
                isRepayLoading={isRepaying}
              />

              <ReputationCard
                creditScore={reputationData?.score ?? 500}
                potentialIncrease={potentialIncrease}
                tier={getTierName(reputationData?.tier ?? 0)}
              />
            </div>

            {/* Repayment Summary */}
            {creditData.totalRepaid > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-8"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Repayment Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Total Repaid</div>
                    <div className="text-white font-semibold text-lg">${creditData.totalRepaid.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">On-Time Payments</div>
                    <div className="text-green-400 font-semibold text-lg">{reputationData?.onTimeRepayments ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Late Payments</div>
                    <div className="text-red-400 font-semibold text-lg">{reputationData?.lateRepayments ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">USDC Balance</div>
                    <div className="text-white font-semibold text-lg">${usdcBalance.toFixed(2)}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
