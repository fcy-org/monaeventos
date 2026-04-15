const InputField = ({
  label,
  value,
  error,
  onChange,
  type = "text",
  placeholder,
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-body text-muted-foreground font-medium">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      autoComplete={autoComplete}
      className={`w-full px-4 py-3 rounded-xl border bg-card font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all ${
        error ? "border-destructive" : "border-border"
      }`}
    />
    {error && <span className="text-xs text-destructive font-body">{error}</span>}
  </div>
);

export default InputField;
