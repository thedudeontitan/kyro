import { motion } from "framer-motion";

type GlowingButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
};

export const GlowingButton = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}: GlowingButtonProps) => {
  const baseClasses =
    "relative px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-[#7f67f5] to-[#6b54e0] text-white",
    secondary: "border-2 border-white/20 text-gray-300 hover:border-white/40 hover:text-white",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
