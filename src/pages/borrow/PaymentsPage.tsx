import { Scanner } from "@yudiel/react-qr-scanner";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Info,
  Loader,
  Lock,
  Nfc,
  Scan,
  Send,
  Shield,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { GlowingButton } from "../../components/GlowingButton";
import NFCPaymentSender, { type NFCPaymentData } from "../../components/NFCPaymentSender";
import { useCreditLine } from "../../solana/useCreditLine";
import { useTransactions } from "../../solana/useTransactions";
import { useTransactionHistory } from "../../solana/useTransactionHistory";

type TransactionStatusState = {
  status: "pending" | "success" | "error";
  message: string;
};

type PaymentData = {
  recipientAddress: string;
  paymentAmount: string;
};

type CreditSummaryBannerProps = {
  creditLimit: number;
  availableCredit: number;
  outstandingDebt: number;
};

const VirtualCreditCard = ({
  creditLimit,
  availableCredit,
  outstandingDebt,
  userAddress,
  isProcessing = false,
}: CreditSummaryBannerProps & {
  userAddress: string;
  isProcessing?: boolean;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isFlipped] = useState(false);
  const usagePercentage = creditLimit > 0 ? ((creditLimit - availableCredit) / creditLimit) * 100 : 0;

  const cardNumber = userAddress
    ? `4532 ${userAddress.slice(2, 6).toUpperCase()} ${userAddress.slice(6, 10).toUpperCase()} ${userAddress.slice(-4).toUpperCase()}`
    : "4532 •••• •••• ••••";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="perspective-1000 mb-8"
    >
      <motion.div
        className="relative w-full max-w-md mx-auto"
        animate={{
          rotateY: isFlipped ? 180 : 0,
          scale: isProcessing ? 1.02 : 1,
        }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Credit Card Front */}
        <motion.div
          className={`relative w-full h-56 bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-white/10 rounded-2xl p-6 text-white ${
            isFlipped ? "backface-hidden" : ""
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Card Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7f67f5]/5 to-[#6b54e0]/5 rounded-2xl overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 border border-white/5 rounded-full"></div>
            <div className="absolute top-8 right-8 w-8 h-8 border border-white/5 rounded-full"></div>
          </div>

          {/* Card Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-[#9580f7]" />
                <span className="font-bold text-lg text-white">Kyro</span>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1 rounded-full hover:bg-white/5 transition-colors"
                disabled={isProcessing}
              >
                {showDetails ? <EyeOff className="w-4 h-4 text-white/70" /> : <Eye className="w-4 h-4 text-white/70" />}
              </button>
            </div>

            <div className="space-y-4">
              <motion.div className="text-xl font-mono tracking-wider text-white/95">
                {showDetails ? cardNumber : cardNumber.replace(/\d(?=\d{4})/g, "•")}
              </motion.div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">Available Credit</div>
                  <motion.div className="text-2xl font-bold text-white">
                    ${availableCredit.toLocaleString()}
                  </motion.div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/60 uppercase tracking-wide">Expires</div>
                  <div className="font-mono text-white/90">12/28</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chip */}
          <div className="absolute top-16 left-6 w-10 h-8 bg-gradient-to-br from-amber-400 to-[#7f67f5] rounded-md" />

          {/* Contactless symbol */}
          <div className="absolute top-16 right-20">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 border-2 border-white/40 rounded-full ${i > 0 ? "opacity-20" : ""}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Credit Card Back (for flip effect) */}
        <motion.div
          className={`absolute inset-0 w-full h-56 bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/10 rounded-2xl ${
            isFlipped ? "" : "backface-hidden"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-full flex flex-col justify-center items-center text-white p-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-xl font-bold mb-2">Payment Processing</div>
            <div className="text-gray-400 text-center">
              Your transaction is being
              <br />
              securely processed
            </div>
          </div>
        </motion.div>

        {/* Usage indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 bg-[#111] border border-white/10 rounded-xl p-4"
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Credit Usage</span>
            <span>{usagePercentage.toFixed(1)}% used</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-2 rounded-full ${
                usagePercentage > 80
                  ? "bg-gradient-to-r from-red-500 to-[#7f67f5]"
                  : usagePercentage > 60
                    ? "bg-gradient-to-r from-amber-500 to-[#7f67f5]"
                    : "bg-gradient-to-r from-green-500 to-emerald-500"
              }`}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Limit: ${creditLimit.toLocaleString()}</span>
            <span>Debt: ${outstandingDebt.toFixed(2)}</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

type QuickActionsProps = {
  onQuickAmount: (amount: string) => void;
  availableCredit: number;
};

const QuickActions = ({ onQuickAmount, availableCredit }: QuickActionsProps) => {
  const quickAmounts = [25, 50, 100, 250, 500].filter((amount) => amount <= availableCredit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-6"
    >
      <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Amounts</h3>
      <div className="flex flex-wrap gap-2">
        {quickAmounts.map((amount) => (
          <motion.button
            key={amount}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onQuickAmount(amount.toString())}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:border-white/20 hover:text-white transition-all duration-300"
          >
            ${amount}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onQuickAmount(availableCredit.toString())}
          className="px-4 py-2 bg-[#7f67f5]/10 border border-[#7f67f5]/30 rounded-lg text-[#9580f7] hover:bg-[#7f67f5]/20 transition-all duration-300"
        >
          MAX
        </motion.button>
      </div>
    </motion.div>
  );
};

type TabToggleProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const TabToggle = ({ activeTab, onTabChange }: TabToggleProps) => {
  return (
    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-8">
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => onTabChange("payment")}
        className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 relative ${
          activeTab === "payment" ? "text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        {activeTab === "payment" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] rounded-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative flex items-center gap-2 justify-center">
          <CreditCard className="w-4 h-4" />
          Pay with Credit
        </span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => onTabChange("receive")}
        className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 relative ${
          activeTab === "receive" ? "text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        {activeTab === "receive" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] rounded-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative flex items-center gap-2 justify-center">
          <ArrowDown className="w-4 h-4" />
          Receive Payments
        </span>
      </motion.button>
    </div>
  );
};

type QRScannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
};

const QRScannerModal = ({ isOpen, onClose, onScan }: QRScannerModalProps) => {
  const [scanResult, setScanResult] = useState<string | undefined>(undefined);

  if (scanResult) {
    onScan(scanResult);
    setScanResult(undefined);
  }

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Scan QR Code</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="relative mb-4">
          <Scanner
            onScan={(results) => {
              if (Array.isArray(results) && results.length > 0 && results[0].rawValue) {
                setScanResult(results[0].rawValue);
              }
            }}
          />
          <p className="text-gray-400 text-sm mt-2">Point your camera at a QR code to scan the wallet address</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

type PaymentSectionProps = {
  availableCredit: number;
  onPayment: (data: { recipientAddress: string; paymentAmount: string }) => void;
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  paymentAmount: string;
  setPaymentAmount: (amount: string) => void;
  isProcessing: boolean;
};

const PaymentSection = ({
  availableCredit,
  onPayment,
  recipientAddress,
  setRecipientAddress,
  paymentAmount,
  setPaymentAmount,
  isProcessing,
}: PaymentSectionProps) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showNFC, setShowNFC] = useState(false);

  const handleNFCPaymentScan = (data: NFCPaymentData) => {
    if (data.recipientAddress && !isNaN(Number(data.recipientAddress))) {
      return;
    }
    console.log("NFC address scanned:", data.recipientAddress);
  };

  const estimatedInterest = paymentAmount ? (parseFloat(paymentAmount) * 0.05) / 12 : 0;

  const handleQRScan = (result: string) => {
    setRecipientAddress(result);
    setShowQRScanner(false);
  };

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRecipientAddress(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <>
      {/* NFC sub-section toggle */}
      <div className="flex justify-end mb-2">
        <button
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            showNFC ? "bg-blue-600 text-white" : "bg-white/5 text-blue-400 hover:bg-white/10 hover:text-blue-300"
          }`}
          onClick={() => setShowNFC((v) => !v)}
        >
          <Nfc className="inline w-4 h-4 mr-1" />
          {showNFC ? "Hide NFC Scanner" : "Scan Wallet Address via NFC"}
        </button>
      </div>

      {showNFC && (
        <div className="mb-6">
          <NFCPaymentSender
            isProcessing={isProcessing}
            availableCredit={availableCredit}
            onPayment={async (recipientAddr, amount) => {
              await onPayment({ recipientAddress: recipientAddr, paymentAmount: amount });
            }}
            onNFCPayment={(data) => {
              handleNFCPaymentScan(data);
            }}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-6"
      >
        {/* Security Badge */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Shield className="w-4 h-4 text-green-400" />
          <span>Secured payment processing</span>
          <Lock className="w-4 h-4 text-green-400" />
        </div>

        <QuickActions onQuickAmount={setPaymentAmount} availableCredit={availableCredit} />

        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Wallet Address</label>
          <div className="relative">
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Enter Solana address..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-[#7f67f5]/50 focus:outline-none transition-all duration-300 pr-32"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQRScanner(true)}
                className="p-2 bg-white/10 hover:bg-white/15 rounded-lg transition-colors duration-300"
                title="Scan QR Code"
              >
                <Scan className="w-4 h-4 text-gray-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePasteAddress}
                className="p-2 bg-white/10 hover:bg-white/15 rounded-lg transition-colors duration-300"
                title="Paste from clipboard"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Payment Amount */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-400">Payment Amount</label>
            <span className="text-sm text-gray-400">Available: ${availableCredit.toLocaleString()} USDC</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-[#7f67f5]/50 focus:outline-none transition-all duration-300 pr-20 text-2xl font-bold"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <span className="text-gray-400 font-medium">USDC</span>
            </div>
          </div>

          {paymentAmount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            >
              <div className="flex items-center gap-2 text-sm text-blue-300">
                <Info className="w-4 h-4" />
                <span>Estimated monthly interest: ${estimatedInterest.toFixed(2)} USDC (5% APR)</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Payment Button */}
        <GlowingButton
          onClick={() => onPayment({ recipientAddress, paymentAmount })}
          className="w-full py-4 text-lg font-semibold"
          disabled={availableCredit <= 0 || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-6 h-6" />
              Pay ${paymentAmount || "0"} with Credit
              <Send className="w-6 h-6" />
            </>
          )}
        </GlowingButton>

        {availableCredit <= 0 && !isProcessing && (
          <div className="flex items-center gap-2 text-sm text-red-500 justify-center mt-2">
            <AlertCircle className="w-4 h-4" />
            <span>Insufficient credit balance. Repay your outstanding debt to free up credit.</span>
          </div>
        )}

        {/* Payment Info */}
        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
          <Lock className="w-3 h-3" />
          <span>Your payment will be processed securely</span>
        </div>
      </motion.div>

      {/* QR Scanner Modal */}
      <QRScannerModal isOpen={showQRScanner} onClose={() => setShowQRScanner(false)} onScan={handleQRScan} />
    </>
  );
};

type ReceiveSectionProps = {
  walletAddress: string;
};

const ReceiveSection = ({ walletAddress }: ReceiveSectionProps) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Receive Payments</h3>
        <p className="text-gray-400 text-sm">Share your QR code or wallet address to receive payments</p>
      </div>

      <div className="bg-white p-6 mx-auto w-fit rounded-xl">
        <QRCodeSVG
          value={walletAddress || "no-wallet"}
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"M"}
          imageSettings={{
            src: "/logo.png",
            x: undefined,
            y: undefined,
            height: 32,
            width: 32,
            opacity: 1,
            excavate: true,
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">Your Wallet Address</p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-mono text-gray-400 truncate">
              {walletAddress ? `${walletAddress.slice(0, 16)}...${walletAddress.slice(-6)}` : "Connect wallet"}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyAddress}
              className="p-2 bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-400">
            Others can scan this QR code or use your wallet address to send you payments directly to your wallet.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

type TransactionStatusProps = {
  status?: "pending" | "success" | "error" | null;
  message?: string;
};

const TransactionStatus = ({ status, message }: TransactionStatusProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Loader className="w-5 h-5 animate-spin" />;
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "text-yellow-400 border-yellow-500/20 bg-yellow-500/10";
      case "success":
        return "text-green-400 border-green-500/20 bg-green-500/10";
      case "error":
        return "text-red-400 border-red-500/20 bg-red-500/10";
      default:
        return "";
    }
  };

  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl p-4 ${getStatusColor()}`}
    >
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <span className="font-medium">{message}</span>
      </div>
    </motion.div>
  );
};

type Transaction = {
  type: string;
  amount: number;
  date: string;
  status: string;
  hash?: string;
  blockNumber?: number;
};

const RecentTransactions = ({
  transactions,
  loading,
  onRefresh,
}: {
  transactions: Transaction[];
  loading: boolean;
  onRefresh?: () => void;
}) => {
  const getTransactionIcon = (type: string): React.ReactElement => {
    switch (type) {
      case "payment":
        return <Send className="w-4 h-4 text-red-400" />;
      case "borrow":
        return <Download className="w-4 h-4 text-green-400" />;
      case "repay":
        return <ArrowUp className="w-4 h-4 text-cyan-400" />;
      case "stake":
        return <Wallet className="w-4 h-4 text-purple-400" />;
      case "collateral_withdrawn":
        return <ArrowDown className="w-4 h-4 text-[#9580f7]" />;
      case "credit_opened":
        return <Shield className="w-4 h-4 text-[#9580f7]" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-400" />;
    }
  };

  interface StatusColorMap {
    [key: string]: string;
  }

  const getStatusColor = (status: string): string => {
    const statusColorMap: StatusColorMap = {
      completed: "text-green-400",
      pending: "text-yellow-400",
      failed: "text-red-400",
    };
    return statusColorMap[status] || "text-gray-400";
  };

  const getTransactionLabel = (type: string): string => {
    switch (type) {
      case "borrow":
        return "Credit Used";
      case "repay":
        return "Repayment";
      case "stake":
        return "Collateral Added";
      case "payment":
        return "Direct Payment";
      case "collateral_withdrawn":
        return "Collateral Withdrawn";
      case "credit_opened":
        return "Credit Line Opened";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-[#111] border border-white/10 rounded-2xl p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#9580f7]" />
          Recent Activity
        </h3>
        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={loading}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300 disabled:opacity-50"
            title="Refresh transactions"
          >
            <motion.div
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
            >
              <ArrowRight className="w-4 h-4 transform rotate-45" />
            </motion.div>
          </motion.button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <Loader className="w-8 h-8 text-[#9580f7] mx-auto mb-3 animate-spin" />
            <p className="text-gray-400 text-sm">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-8 h-8 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No activity yet</p>
            <p className="text-gray-500 text-xs mt-1">Your credit activity will appear here</p>
          </div>
        ) : (
          <div
            className="h-full overflow-y-auto space-y-3 scrollbar-hide pr-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {transactions.map((tx, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/8 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{getTransactionLabel(tx.type)}</div>
                    <div className="text-gray-500 text-sm">{tx.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">${tx.amount.toLocaleString()}</div>
                  <div className={`text-sm capitalize ${getStatusColor(tx.status)}`}>{tx.status}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function PaymentsPage() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();

  const [activeTab, setActiveTab] = useState("payment");
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatusState | null>(null);

  const { creditData, creditLineExists, refresh: refreshCreditLine } = useCreditLine();
  const { borrowAndPay } = useTransactions();

  // Transaction states
  const [recipientAddress, setRecipientAddress] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    transactions,
    loading: loadingTransactions,
    refresh: refreshTransactions,
  } = useTransactionHistory();

  const walletAddress = publicKey?.toBase58() || "";

  const handlePayment = async (data: PaymentData): Promise<void> => {
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!data.recipientAddress) {
      toast.error("Please enter a recipient address");
      return;
    }

    if (!data.paymentAmount || parseFloat(data.paymentAmount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    const amount = parseFloat(data.paymentAmount);

    let recipientPubkey: PublicKey;
    try {
      recipientPubkey = new PublicKey(data.recipientAddress);
    } catch {
      toast.error("Invalid recipient address");
      return;
    }

    try {
      setIsProcessing(true);
      setTransactionStatus({ status: "pending", message: "Processing payment..." });

      await borrowAndPay(recipientPubkey, amount);

      setTransactionStatus({ status: "success", message: "Payment successful!" });
      toast.success(`Payment of $${amount} sent successfully!`);

      setRecipientAddress("");
      setPaymentAmount("");
      refreshCreditLine();
      refreshTransactions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      setTransactionStatus({ status: "error", message: msg });
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if user needs to open credit line
  if (!creditLineExists || !creditData?.isActive) {
    return (
      <div className="min-h-screen bg-[black] text-white">
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center"
          >
            <CreditCard className="w-16 h-16 text-[#9580f7] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Open Credit Line First</h2>
            <p className="text-gray-400 mb-6">
              You need to open a credit line before you can make payments. This is like applying for a credit card.
            </p>
            <GlowingButton onClick={() => navigate("/borrow/stake")} className="text-lg px-8 py-4">
              Open Credit Line
              <ArrowRight className="w-5 h-5" />
            </GlowingButton>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[black] text-white">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Instant Credit Payments
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Pay instantly with your crypto credit line
              </p>
            </div>
          </div>
        </div>

        <VirtualCreditCard
          creditLimit={creditData.creditLimit}
          availableCredit={creditData.availableCredit}
          outstandingDebt={creditData.currentDebt}
          userAddress={walletAddress}
          isProcessing={isProcessing}
        />

        <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === "payment" ? (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <PaymentSection
                    availableCredit={creditData.availableCredit}
                    onPayment={handlePayment}
                    recipientAddress={recipientAddress}
                    setRecipientAddress={setRecipientAddress}
                    paymentAmount={paymentAmount}
                    setPaymentAmount={setPaymentAmount}
                    isProcessing={isProcessing}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="receive"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <ReceiveSection walletAddress={walletAddress} />
                </motion.div>
              )}

              <GlowingButton className="mt-4 w-full flex justify-center" onClick={() => navigate("/borrow/dashboard")}>
                <Wallet className="w-5 h-5" />
                Go to Credit Dashboard
                <ArrowRight className="w-5 h-5" />
              </GlowingButton>
            </AnimatePresence>

            <TransactionStatus status={transactionStatus?.status} message={transactionStatus?.message} />
          </div>

          <div className="lg:h-full">
            <RecentTransactions transactions={transactions} loading={loadingTransactions} onRefresh={refreshTransactions} />
          </div>
        </div>

      </div>
    </div>
  );
}
