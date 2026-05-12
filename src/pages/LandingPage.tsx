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
      question: "How does the virtual credit card work?",
      answer:
        "Kyro gives you a virtual credit card backed by USDC collateral. Connect your Web3 wallet, deposit USDC, and instantly unlock a credit line you can spend anywhere. Your collateral stays in your control while powering your spending.",
    },
    {
      question: "Do I need to sell my crypto to spend?",
      answer:
        "No. Kyro lets you borrow against your USDC collateral instead of selling it. You keep full ownership of your assets while using your credit line for everyday purchases — no capital gains events triggered.",
    },
    {
      question: "What is USDC collateral?",
      answer:
        "USDC is a stablecoin pegged 1:1 to the US dollar. When you deposit USDC as collateral on Kyro, it backs your virtual credit card's credit line. Your collateral remains on-chain, transparent, and fully in your control.",
    },
    {
      question: "How do I earn yield?",
      answer:
        "Your staked USDC earns competitive APY while serving as collateral for your credit line. The yield you earn grows your collateral, increasing your available credit limit over time.",
    },
    {
      question: "Is my money safe?",
      answer:
        "Yes. Kyro is fully non-custodial — your funds are secured by audited Solana smart contracts, not held by a centralized party. All transactions are transparent and verifiable on-chain, giving you complete control over your assets.",
    },
  ];

  return (
    <div className="min-h-screen bg-[black] text-white overflow-x-hidden">
      <SEO
        title="Kyro - Virtual Credit Card | Spend Without Selling Your Crypto"
        description="Get an instant virtual credit card backed by USDC. Spend anywhere without selling your crypto. Earn yield on collateral. Powered by Solana."
        keywords="virtual credit card, USDC credit card, crypto credit card, spend without selling, virtual card crypto, stablecoin credit, collateral backed credit, yield earning card, solana credit card, non-custodial credit"
        ogTitle="Kyro - Virtual Credit Card | Spend Without Selling Your Crypto"
        ogDescription="Get an instant virtual credit card backed by USDC. Spend anywhere without selling your crypto. Earn yield on collateral. Powered by Solana."
        twitterTitle="Kyro - Virtual Credit Card | Spend Without Selling Your Crypto"
        twitterDescription="Get an instant virtual credit card backed by USDC. Spend anywhere without selling your crypto. Earn yield on collateral. Powered by Solana."
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
              Your Virtual Credit Card.
              <br />
              Backed by Real Assets.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get an instant virtual credit card powered by USDC collateral. Tap to pay at any POS or NFC terminal
              worldwide, earn yield on your deposits, and never sell your crypto.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <GlowingButton variant="primary" onClick={() => navigate("/borrow")}>
              Get Your Card
              <ArrowRight className="w-5 h-5" />
            </GlowingButton>
            <GlowingButton variant="secondary" onClick={() => navigate("/lend/deposit")}>
              Earn as a Lender
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
              title="Connect Your Wallet"
              description="Link your Web3 wallet in seconds. Compatible with all major providers for instant access to your virtual credit card."
              icon={Wallet}
              delay={0.1}
            />
            <StepCard
              step={2}
              title="Deposit Collateral"
              description="Stake USDC as collateral to unlock your credit line. No credit checks, no paperwork — just deposit and go."
              icon={CreditCard}
              delay={0.2}
            />
            <StepCard
              step={3}
              title="Spend Anywhere"
              description="Use your virtual credit card at any POS or NFC terminal worldwide. Tap to pay in stores, shop online, or send to any wallet — accepted everywhere."
              icon={RefreshCw}
              delay={0.3}
            />
            <StepCard
              step={4}
              title="Earn While You Spend"
              description="Your collateral earns competitive APY while backing your credit line. The yield grows your available credit over time."
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
                Lend & Earn Yield
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Supply USDC to the lending pool and earn competitive APY. Your deposits power virtual credit cards while
                generating passive income.
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
              Why Choose Kyro?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Zap}
              title="Instant Virtual Card"
              description="Get a virtual credit card in minutes. No applications, no waiting — connect your wallet and start spending."
            />
            <FeatureCard
              icon={Wallet}
              title="USDC-Backed Credit"
              description="Your credit line is backed 1:1 by USDC collateral. Stable, transparent, and fully on-chain."
            />
            <FeatureCard
              icon={Target}
              title="Yield-Earning Collateral"
              description="Your collateral earns competitive APY, growing your credit limit over time. Your deposits work for you while you spend."
            />
            <FeatureCard
              icon={Shield}
              title="Pay Anywhere"
              description="Tap to pay at any POS or NFC terminal in the world. Shop online, pay in stores, or send to any wallet — no borders, no limits."
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
              Your funds are secured by Solana smart contracts. Non-custodial, transparent, and verifiable on-chain.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              <div className="flex items-center gap-3 bg-[#111] rounded-xl px-6 py-3 border border-white/10">
                <Shield className="w-8 h-8 text-[#9580f7]" />
                <span className="text-lg font-medium">Non-Custodial</span>
              </div>
              <div className="flex items-center gap-3 bg-[#111] rounded-xl px-6 py-3 border border-white/10">
                <Wallet className="w-8 h-8 text-[#9580f7]" />
                <span className="text-lg font-medium">On-Chain Transparent</span>
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
              Why Kyro Over Other Cards?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how Kyro's virtual credit card compares to traditional crypto debit cards and centralized platforms
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
                <h3 className="text-xl font-bold text-white mb-4">Kyro Virtual Credit Card</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">True credit (no selling)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Yield-earning collateral</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Non-custodial & yield-earning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Pay anywhere via POS & NFC</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">No capital gains events</span>
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
              Virtual Credit Card FAQ
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
              Get your virtual credit card today
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Backed by USDC. Powered by Solana. No credit checks required.
            </p>

            <GlowingButton variant="primary" className="text-xl px-12 py-6" onClick={() => navigate("/borrow")}>
              Get Started
              <ChevronRight className="w-6 h-6" />
            </GlowingButton>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
