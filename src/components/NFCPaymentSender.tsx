import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, CreditCard, Loader, Nfc, Smartphone, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// NFC Web API type declarations
declare global {
  interface Window {
    NDEFReader: typeof NDEFReader;
  }

  class NDEFReader {
    constructor();
    scan(): Promise<void>;
    abort(): void;
    onreading: ((event: NDEFReadingEvent) => void) | null;
    onreadingerror: ((event: Event) => void) | null;
  }

  interface NDEFReadingEvent extends Event {
    serialNumber: string;
    message: NDEFMessage;
  }

  interface NDEFMessage {
    records: NDEFRecord[];
  }

  interface NDEFRecord {
    recordType: string;
    data: ArrayBuffer;
  }
}

export type NFCPaymentData = {
  recipientAddress: string;
  amount?: string;
  merchantName?: string;
  description?: string;
};

type NFCPaymentSenderProps = {
  setWalletAddressNFC?: (address: string) => void;
  isProcessing: boolean;
  onNFCPayment: (data: NFCPaymentData) => void;
  availableCredit: number;
  onPayment: (recipientAddress: string, amount: string) => Promise<void>;
};

const NFC_STATUS = {
  idle: "idle",
  scanning: "scanning",
  success: "success",
  error: "error",
} as const;

const isNFCSupported = () => {
  const isSecure =
    typeof window !== "undefined" &&
    (window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.isSecureContext);
  return typeof window !== "undefined" && "NDEFReader" in window && isSecure;
};

const NFCPaymentSender: React.FC<NFCPaymentSenderProps> = ({
  setWalletAddressNFC,
  isProcessing,
  onNFCPayment,
  availableCredit,
  onPayment,
}) => {
  const [nfcStatus, setNfcStatus] = useState<"idle" | "scanning" | "success" | "error">(NFC_STATUS.idle);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<NFCPaymentData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const nfcReaderRef = useRef<NDEFReader | null>(null);

  useEffect(() => {
    // Cleanup NFC scan on unmount
    return () => {
      if (nfcReaderRef.current && nfcReaderRef.current.abort) {
        nfcReaderRef.current.abort();
      }
    };
  }, []);

  const startNFCScan = async () => {
    if (!isNFCSupported()) {
      setErrorMsg("NFC is not supported on this device or not available over HTTP.");
      setNfcStatus(NFC_STATUS.error);
      return;
    }
    setErrorMsg(null);
    setNfcStatus(NFC_STATUS.scanning);

    try {
      const ndef = new window.NDEFReader();
      nfcReaderRef.current = ndef;

      await ndef.scan();

      ndef.onreadingerror = () => {
        setErrorMsg("NFC reading error. Try again.");
        setNfcStatus(NFC_STATUS.error);
      };

      ndef.onreading = (event: NDEFReadingEvent) => {
        try {
          let paymentData: NFCPaymentData | null = null;
          let debugInfo = "";
          for (const record of event.message.records) {
            const decoded = new TextDecoder().decode(record.data);
            debugInfo += `Record type: ${record.recordType}, data: ${decoded}\n`;
            if (record.recordType === "text") {
              const text = decoded;
              try {
                paymentData = JSON.parse(text);
                debugInfo += `Parsed as JSON: ${JSON.stringify(paymentData)}\n`;
                if (paymentData && paymentData.recipientAddress) break;
              } catch (jsonErr) {
                debugInfo += `JSON parse error: ${jsonErr}\n`;
                // Fallback: colon-separated
                const parts = text.split(":");
                debugInfo += `Colon parts: ${JSON.stringify(parts)}\n`;
                if (parts.length === 1 && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(parts[0])) {
                  // Accept single Solana wallet address as recipient
                  paymentData = { recipientAddress: parts[0] };
                  debugInfo += `Parsed as single wallet address: ${JSON.stringify(paymentData)}\n`;
                  break;
                }
                if (parts.length >= 2) {
                  paymentData = {
                    recipientAddress: parts[0],
                    amount: parts[1],
                    merchantName: parts[2] || undefined,
                    description: parts[3] || undefined,
                  };
                  debugInfo += `Parsed as colon-separated: ${JSON.stringify(paymentData)}\n`;
                  break;
                }
              }
            }
          }
          console.log("NFC Debug Info:\n" + debugInfo);
          // Only show error if we truly failed to parse a wallet address
          if (paymentData && paymentData.recipientAddress) {
            setScannedData(paymentData);
            if (setWalletAddressNFC) {
              setWalletAddressNFC(paymentData.recipientAddress);
            }
            setNfcStatus(NFC_STATUS.success);
            setShowPaymentModal(true);
            onNFCPayment(paymentData);
            toast.success("NFC wallet address scanned!");
            setErrorMsg(null); // Clear any previous error
          } else {
            // Only show error if nothing valid was parsed
            setErrorMsg(
              "Invalid NFC payment data.\n\nDebug info:\n" +
                debugInfo +
                "\nRaw event: " +
                JSON.stringify(event.message.records)
            );
            setNfcStatus(NFC_STATUS.error);
          }
        } catch (err) {
          console.log("NFC Debug Exception:", err);
          setErrorMsg("Failed to process NFC data. " + (err instanceof Error ? err.message : String(err)));
          setNfcStatus(NFC_STATUS.error);
        }
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setErrorMsg(
        errorMessage?.includes("secure")
          ? "NFC requires HTTPS or localhost."
          : "Failed to start NFC scan. " + errorMessage
      );
      setNfcStatus(NFC_STATUS.error);
    }
  };

  const stopNFCScan = () => {
    setNfcStatus(NFC_STATUS.idle);
    setErrorMsg(null);
    setScannedData(null);
    setShowPaymentModal(false);
    setPaymentAmount("");
    if (nfcReaderRef.current && nfcReaderRef.current.abort) {
      nfcReaderRef.current.abort();
    }
  };

  const handlePaymentConfirm = async () => {
    if (!scannedData?.recipientAddress || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (parseFloat(paymentAmount) > availableCredit) {
      toast.error("Payment amount exceeds available credit");
      return;
    }

    setPaymentProcessing(true);
    try {
      await onPayment(scannedData.recipientAddress, paymentAmount);
      toast.success(`Payment of $${paymentAmount} USDC sent successfully!`);
      setShowPaymentModal(false);
      setPaymentAmount("");
      stopNFCScan();
    } catch (error) {
      console.error("NFC Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentAmount("");
    setPaymentProcessing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col items-center"
    >
      <div className="flex flex-col items-center mb-4">
        <Nfc className="w-10 h-10 text-blue-400 mb-2" />
        <div className="text-lg font-semibold text-white mb-1">Scan NFC Payment Request</div>
        <div className="text-sm text-gray-400 text-center">
          Tap your phone to the receiver's phone to scan their wallet address.
        </div>
      </div>

      <div className="w-full flex flex-col items-center">
        {nfcStatus === NFC_STATUS.idle && (
          <button
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={startNFCScan}
            disabled={isProcessing}
          >
            <Nfc className="w-5 h-5" />
            Start NFC Scan
          </button>
        )}

        {nfcStatus === NFC_STATUS.scanning && (
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mb-2"
            >
              <Smartphone className="w-8 h-8 text-blue-400" />
            </motion.div>
            <div className="text-blue-300 font-medium mb-1">Waiting for NFC payment request...</div>
            <div className="text-xs text-gray-400 mb-2 text-center">Hold your phone close to the receiver's phone.</div>
            <button
              className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors text-sm"
              onClick={stopNFCScan}
            >
              Cancel
            </button>
          </div>
        )}

        {nfcStatus === NFC_STATUS.success && scannedData && (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
            <div className="text-green-300 font-semibold mb-1">Wallet Address Scanned!</div>
            <div className="text-xs text-gray-400 break-all mb-2">{scannedData.recipientAddress}</div>
            <button
              className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors text-sm"
              onClick={stopNFCScan}
            >
              Done
            </button>
          </div>
        )}

        {nfcStatus === NFC_STATUS.error && (
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
            <div className="text-red-300 font-semibold mb-1">NFC Error</div>
            <div className="text-xs text-red-200 mb-2 text-center">{errorMsg}</div>
            <button
              className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors text-sm"
              onClick={stopNFCScan}
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Payment Amount Modal */}
      <AnimatePresence>
        {showPaymentModal && scannedData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="z-50 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Nfc className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">NFC Payment</h3>
                    <p className="text-gray-400 text-sm">Enter payment amount</p>
                  </div>
                </div>
                <button
                  onClick={closePaymentModal}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                  disabled={paymentProcessing}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Recipient Address Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Wallet Address</label>
                  <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                    <span className="text-sm font-mono text-gray-300 break-all">{scannedData.recipientAddress}</span>
                  </div>
                </div>

                {/* Payment Amount Input */}
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
                      min="0"
                      step="0.000001"
                      className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-all duration-300 pr-20 text-xl font-bold"
                      disabled={paymentProcessing}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-400 font-medium">USDC</span>
                    </div>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 100, Math.min(availableCredit, 250)]
                    .filter((amount) => amount <= availableCredit)
                    .map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setPaymentAmount(amount.toString())}
                        className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300 hover:border-blue-500/50 hover:text-white transition-all duration-300 text-sm"
                        disabled={paymentProcessing}
                      >
                        ${amount}
                      </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closePaymentModal}
                    className="flex-1 py-3 px-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-300 hover:bg-gray-600/50 transition-all duration-300 font-medium"
                    disabled={paymentProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentConfirm}
                    disabled={
                      !paymentAmount ||
                      parseFloat(paymentAmount) <= 0 ||
                      parseFloat(paymentAmount) > availableCredit ||
                      paymentProcessing
                    }
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {paymentProcessing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay ${paymentAmount || "0"} USDC
                      </>
                    )}
                  </button>
                </div>

                {/* Payment Info */}
                <div className="flex items-center gap-2 text-xs text-gray-500 justify-center pt-2">
                  <AlertCircle className="w-3 h-3" />
                  <span>Payment will be processed instantly using your credit line</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NFCPaymentSender;
