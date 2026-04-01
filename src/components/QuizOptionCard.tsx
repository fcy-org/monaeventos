import { motion } from "framer-motion";

interface QuizOptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  index: number;
}

const QuizOptionCard = ({ label, selected, onClick, index }: QuizOptionCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      onClick={onClick}
      className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 font-body text-sm tracking-wide
        ${selected
          ? "border-accent bg-accent/10 text-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:bg-card/80"
        }`}
    >
      {label}
    </motion.button>
  );
};

export default QuizOptionCard;
