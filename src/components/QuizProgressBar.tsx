import { motion } from "framer-motion";

interface QuizProgressBarProps {
  progress: number;
}

const QuizProgressBar = ({ progress }: QuizProgressBarProps) => {
  return (
    <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-accent rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default QuizProgressBar;
