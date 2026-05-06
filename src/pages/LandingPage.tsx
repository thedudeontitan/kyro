import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  CreditCard,
  PiggyBank,
  Plus,
  RefreshCw,
  Shield,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { GlowingButton } from "../components/GlowingButton";
import Navbar from "../components/Navigation/Navbar";
import { SEO } from "../components/SEO";

type StepCardProps = {
  step: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
};

const StepCard = ({ step, title, description, icon: Icon, delay }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-[#111] border border-white/10 rounded-2xl p-8 group hover:border-white/20 transition-all duration-300"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] rounded-full flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">0{step}</div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
};

type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-[#111] border border-white/10 rounded-2xl p-6 group hover:border-white/20 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <motion.div initial={false} className="border-b border-white/10 last:border-b-0">
      <motion.button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left"
      >
        <span className="text-lg font-medium text-white">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
          <Plus className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pb-6">
          <p className="text-gray-400 leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How does the crypto credit card work?",
      answer:
        "Kyro's crypto credit card lets you spend crypto without selling your assets. Stake USDC as collateral to get instant crypto-backed credit lines. Use tap-to-pay technology for real-world purchases while earning yield on your collateral.",
    },
    {
      question: "Can I spend crypto without selling it?",
      answer:
        "Yes! Our crypto credit card allows you to spend your crypto purchasing power without triggering capital gains events. Your USDC collateral remains yours while backing your credit line for everyday spending.",
    },
    {
      question: "What makes this the best crypto credit card 2025?",
      answer:
        "Unlike traditional crypto cards, Kyro offers yield-earning collateral, non-custodial control, no liquidation of assets, and real tap-to-pay functionality. You keep ownership while gaining spending power.",
    },
    {
      question: "How do I earn yield on my crypto collateral?",
      answer:
        "Your staked USDC earns competitive APY while serving as collateral for your crypto credit line. This creates self-repaying crypto credit where your yield helps cover interest payments automatically.",
    },
    {
      question: "Is this better than other crypto cards?",
      answer:
        "Kyro offers true non-custodial crypto credit with yield-earning collateral, unlike centralized alternatives. You maintain self-custody while accessing crypto credit lines with competitive terms and real-world utility.",
    },
  ];

  return (
    <div className="min-h-screen bg-[black] text-white overflow-x-hidden">
      <SEO
        title="Kyro - Best Crypto Credit Card 2025 | Spend Crypto Without Selling"
        description="Get the best crypto credit card 2025. Spend crypto without selling with Kyro's USDC-backed credit lines. Earn yield on collateral while using crypto for everyday purchases with tap-to-pay."
        keywords="best crypto credit card 2025, crypto credit card, spend crypto without selling, USDC credit card, crypto backed credit card, stablecoin credit card, crypto collateral credit, yield backed credit, crypto tap to pay, real world crypto payments, avoid capital gains crypto"
        ogTitle="Kyro - Revolutionary Crypto Credit Card | Turn Crypto Into Spending Power"
        ogDescription="Revolutionary crypto credit card that lets you spend crypto without selling. Stake USDC, get instant credit, earn yield on collateral. The future of crypto payments is here."
        twitterTitle="Kyro - Crypto Credit Card | Spend USDC Without Selling"
        twitterDescription="Get instant crypto credit using your USDC. No selling required. Earn yield while spending crypto in stores with tap-to-pay technology."
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 pt-32 pb-16">
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              Crypto Credit Card.
              <br />
              Spend Without Selling.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get instant crypto-backed credit using your USDC. Earn yield on collateral while spending crypto in real
              life with tap-to-pay technology. No selling required.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <GlowingButton variant="primary" onClick={() => navigate("/borrow")}>
              Start Borrowing
              <ArrowRight className="w-5 h-5" />
            </GlowingButton>
            <GlowingButton variant="secondary" onClick={() => navigate("/lend/deposit")}>
              Start Lending
              <TrendingUp className="w-5 h-5" />
            </GlowingButton>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in minutes with our seamless Web3 credit experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard
              step={1}
              title="Connect Crypto Wallet"
              description="Connect your existing Web3 wallet to access crypto credit. Seamless integration with all major wallet providers for instant USDC credit lines."
              icon={Wallet}
              delay={0.1}
            />
            <StepCard
              step={2}
              title="Get Crypto-Backed Credit"
              description="Receive instant crypto credit backed by your USDC collateral. No traditional credit checks - just stake crypto for credit."
              icon={CreditCard}
              delay={0.2}
            />
            <StepCard
              step={3}
              title="Spend Crypto Everywhere"
              description="Use your crypto credit for everyday purchases. Tap-to-pay in stores, online shopping, and real-world payments without selling your crypto."
              icon={RefreshCw}
              delay={0.3}
            />
            <StepCard
              step={4}
              title="Earn Yield on Collateral"
              description="Your staked USDC earns competitive APY while serving as collateral. Self-repaying crypto credit that grows your wealth."
              icon={PiggyBank}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Lender Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                Stake USDC for Credit
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Stake your USDC as collateral to unlock crypto credit lines. Earn competitive APY while your assets back
                real-world crypto spending power.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-[#9580f7]" />
                  <span className="text-gray-300">Competitive APY rates</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-[#9580f7]" />
                  <span className="text-gray-300">Automated smart contracts</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-[#9580f7]" />
                  <span className="text-gray-300">Transparent on-chain transactions</span>
                </div>
              </div>

              <GlowingButton variant="primary" onClick={() => navigate("/lend/deposit")}>
                Start Lending
                <TrendingUp className="w-5 h-5" />
              </GlowingButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-[#111] border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Yield</h3>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Current APY</span>
                    <span className="text-3xl font-bold text-white">12.5%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] h-2 rounded-full"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-gray-400 text-sm mb-1">Your Deposits</div>
                    <div className="text-xl font-bold text-white">$25,000</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-gray-400 text-sm mb-1">Total Earned</div>
                    <div className="text-xl font-bold text-white">$3,125</div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/lend/deposit")}
                  className="w-full bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] text-white py-4 rounded-xl font-medium transition-all duration-300"
                >
                  Deposit Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              Why Choose Us?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Zap}
              title="Crypto Card Technology"
              description="Advanced crypto credit card technology built for Web3. Support for all major wallets and real-world payments."
            />
            <FeatureCard
              icon={Wallet}
              title="USDC Credit Line"
              description="Get instant credit backed by your USDC. Stable, reliable crypto collateral for everyday spending."
            />
            <FeatureCard
              icon={Target}
              title="Yield-Backed Credit"
              description="Your collateral earns yield while providing credit. Turn staked crypto into spending power that pays for itself."
            />
            <FeatureCard
              icon={Shield}
              title="Tap-to-Pay Crypto"
              description="Use crypto for real-world purchases with NFC tap-to-pay technology. Fast, secure, and widely accepted."
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              Security & Transparency
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Your crypto credit is fully self-custodial and transparent. Avoid capital gains while spending crypto for
              everyday purchases.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              <div className="flex items-center gap-3 bg-[#111] rounded-xl px-6 py-3 border border-white/10">
                <Shield className="w-8 h-8 text-[#9580f7]" />
                <span className="text-lg font-medium">Non-Custodial Crypto Card</span>
              </div>
              <div className="flex items-center gap-3 bg-[#111] rounded-xl px-6 py-3 border border-white/10">
                <Wallet className="w-8 h-8 text-[#9580f7]" />
                <span className="text-lg font-medium">Real-World Crypto Payments</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              Why Choose Kyro Over Other Crypto Cards?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Compare Kyro's crypto credit card with traditional crypto debit cards and centralized lending platforms
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-8"
          >
            <div className="grid md:grid-cols-3 gap-8">
              {/* Kyro */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">Kyro</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Best Crypto Credit Card 2025</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">True crypto credit (no selling)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Yield-earning USDC collateral</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Non-custodial & self-repaying</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Real-world tap-to-pay</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Avoid capital gains tax</span>
                  </li>
                </ul>
              </div>

              {/* Traditional Crypto Debit Cards */}
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 font-bold text-sm">Others</span>
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-4">Traditional Crypto Cards</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-500">Requires selling crypto</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-500">No yield on holdings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-500">Custodial control</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-500">Limited spending options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-500">Capital gains implications</span>
                  </li>
                </ul>
              </div>

              {/* Centralized Platforms */}
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 font-bold text-xs">CeFi</span>
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-4">Centralized Platforms</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-500">Credit with collateral</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-500">Custodial risk</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-500">Centralized control</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-500">Geographic restrictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-500">Variable APY terms</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              Crypto Credit Card FAQ
            </h2>
          </motion.div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              Ready for the best crypto credit card 2025?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Experience crypto credit without selling your assets. Start spending crypto in stores with our stablecoin
              credit card.
            </p>

            <GlowingButton variant="primary" className="text-xl px-12 py-6" onClick={() => navigate("/borrow")}>
              Start Now
              <ChevronRight className="w-6 h-6" />
            </GlowingButton>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
