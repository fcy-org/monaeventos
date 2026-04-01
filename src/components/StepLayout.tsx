const StepLayout = ({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-5 w-full max-w-md mx-auto">
    <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground text-center mb-2">
      {question}
    </h2>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

export default StepLayout;
