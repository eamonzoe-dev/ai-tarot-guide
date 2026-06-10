type RitualFieldProps = {
  variant?: "breath" | "settle" | "ready" | "breathing" | "focus";
};

type RitualPromptProps = {
  lines: string[];
};

export function RitualField({ variant = "breathing" }: RitualFieldProps) {
  const classVariant = variant === "breathing" ? "breath" : variant;

  return (
    <div
      className={`ritual-field ritual-field-${classVariant}`}
      aria-hidden="true"
    >
      <div className="ritual-glow" />
      <div className="ritual-halo" />
      <div className="ritual-ring ritual-ring-outer" />
      <div className="ritual-ring ritual-ring-inner" />
      <span className="ritual-particle ritual-particle-1" />
      <span className="ritual-particle ritual-particle-2" />
      <span className="ritual-particle ritual-particle-3" />
      <span className="ritual-particle ritual-particle-4" />
      <span className="ritual-particle ritual-particle-5" />
      <span className="ritual-particle ritual-particle-6" />
    </div>
  );
}

export function RitualPrompt({ lines }: RitualPromptProps) {
  return (
    <div className="ritual-prompt">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
